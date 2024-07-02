import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Managing Authorization Methods For A PKP that Owns Itself

This guide covers how to add and remove Authentication Methods for a Programmable Key Pair (PKP) that owns itself. For an overview of what a PKP is, please go [here](../../sdk/wallets/minting).

When a PKP is created, an ERC-721 NFT is minted and ownership of it is granted to the address whom minted it by default (there is an option to assign ownership to another address on mint, but that's not covered by this guide). The owner of the NFT is the designated "controller" of the PKP, and is the entity that is authorized to use the PKP.

In order for the "controller" of a PKP to be able to use it, they must first authenticate with the Lit network (i.e. verify who they say they are), so the Lit network can verify they're authorized to use the PKP. Typically, when the owner of the PKP is an Externally Owned Account (EOA), they authenticate themselves by signing a Sign-in With Ethereum ([ERC-4361](https://eips.ethereum.org/EIPS/eip-4361)) message. However, there are multiple other Authentication Methods that can be used such as:

- [Social Logins](../../sdk/wallets/auth-methods/lit-auth-methods/social-login)
- [WebAuthn](../../sdk/wallets/auth-methods/lit-auth-methods/web-authn)
- [Stytch OPT / TOTP](../../sdk/wallets/auth-methods/lit-auth-methods/email-sms)

Another Authentication Method that is available to use with PKPs is Custom Authentication. This is possible by creating a Lit Action, uploading it to IPFS, and then adding the IPFS Content Identifier (CID) as a permitted Authentication Method for the PKP. Because Lit Actions are JavaScript scripts, arbitrary steps can be performed to authenticate an entity using Custom Authentication. This allows for Authentication Methods that use custom logic such as `fetch`ing data from an API, or even implementing a Social Login that's not supported natively by Lit.

In this guide we're going to cover an example implementation of adding and removing Authentication Methods when the "controller" of the PKP is itself. This is different from when an EOA is the "controller" because we need to authenticate as the PKP by signing a message, but we can only sign a message with the PKP once we're authenticated and checked for authorization to use the PKP.

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Authentication Methods](../../sdk/wallets/auth-methods)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)
- [Lit Actions](../../sdk/serverless-signing/overview)

## Example Implementation

When a PKP owns itself, it enables a more decentralized approach, as there is no "admin address" that has direct control of the PKP. Instead, the authentication and authorization is handled by alternative Authentication Methods that make use of the systems mentioned above.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/71b41fd2d46d55cf486e1d7014a09ed4f90a85c5/pkp-update-authmethod/nodejs/src/index.ts).

### Overview

In this example implementation, `EOA_A` will mint a PKP, add a Custom Authentication Method to authorize itself to use the PKP, and transfer ownership of the PKP to the PKP's Ethereum address. It will then use this Custom Authentication Method to generate PKP Session Signatures, which allows it to add another Custom Authentication Method for authorizing `EOA_B` to use the PKP. Subsequently, `EOA_B` will use the second Custom Authentication Method to remove the first Custom Authentication Method (the one that authorized EOA_A to use the PKP) as a permitted authentication method for the PKP, effectively removing `EOA_A`’s control over the PKP.

To accomplish the above, the example implementation takes the following steps:

1. Mint a new PKP using an EOA 
   - Provided as the environment variable: `process.env.ETHEREUM_PRIVATE_KEY_A`
2. Add a Custom Authentication Method to the PKP that authenticates a signed SIWE message and verifies it's signed by `ETHEREUM_PRIVATE_KEY_A`
   - This is done by adding a Lit Action as a permitted Authentication Method for the PKP by uploading our Lit Action code to IPFS
3. Verify the Custom Authentication Method is permitted to be used for the PKP
4. Transfer ownership of the PKP NFT from `ETHEREUM_PRIVATE_KEY_A` to the PKP's Ethereum address
5. Get PKP Session Signatures using the Custom Authentication Method from step 2
6. Transfer some test Lit tokens from `ETHEREUM_PRIVATE_KEY_A` to the PKP's Ethereum address
   - This is necessary because we're interacting with the PKP Permissions contract on Lit's Chronicle chain to add and remove Authentication Methods, and we're required to pay gas for these onchain transactions
7. Initialize and connect a [PKP Ethers Wallet](https://v6-api-doc-lit-js-sdk.vercel.app/modules/pkp_ethers_src.html) using the PKP Session Signatures from step 5
8. Send a transaction to Chronicle to add a second Custom Authentication Method that authenticates a signed SIWE message and verifies it's signed by `ETHEREUM_PRIVATE_KEY_B`
   - This transaction executes the `addPermittedAction` function on the PKP Permissions contract
9. Verify the Custom Authentication Method is permitted to be used for the PKP
10. Get PKP Session Signatures using the Custom Authentication Method from step 8
11. Initialize and connect a PKP Ethers Wallet using the PKP Session Signatures from step 10
12. Send a transaction to Chronicle to remove the Custom Authentication Method from step 2 as a permitted method to be used with the PKP
13. Verify the Custom Authentication Method from step 2 is no longer permitted

### Installing the Required Dependencies

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/contracts-sdk \
@lit-protocol/lit-node-client \
@lit-protocol/pkp-ethers \
bs58 \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/contracts-sdk \
@lit-protocol/lit-node-client \
@lit-protocol/pkp-ethers \
bs58 \
ethers@v5
```

</TabItem>
</Tabs>

### Creating the Custom Authentication Lit Actions

Before continuing with the rest of the implementation, you need to have the IPFS Content Identifiers (CID) for the two Lit Actions that will be added to the PKP as permitted Authentication Methods.

As an example, below is the Lit Action code this guide will be using for the Custom Authentication Methods. These Lit Actions are taking the following steps:

1. Creates an [Access Control Conditions](../../sdk/access-control/evm/basic-examples) that check for a specific address
2. Uses the [checkConditions](https://actions-docs.litprotocol.com/#checkconditions) method from the Lit Actions API to derive an address from the provided Authentication Signature, then uses the Access Control Conditions to test if the derived address matches what's expected
3. If the derived address doesn't match, [setResponse](https://actions-docs.litprotocol.com/#setresponse) is used to notify the user that they're not authorized. If the derived address matches, `setResponse` returns `"true"`.
   - This guide covers this further in the below sections, but the Lit Action **must** return `"true"` as a `string` in order for [getLitActionSessionSigs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getLitActionSessionSigs) to return the Session Signatures

<Tabs
defaultValue="eth-address-a"
values={[
{label: 'Ethereum Address A Lit Action', value: 'eth-address-a'},
{label: 'Ethereum Address B Lit Action', value: 'eth-address-b'},
]}>
<TabItem value="eth-address-a">

```ts
(async () => {
  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "ETHEREUM_ADDRESS_A", // <-- Replace with your Ethereum address A
      },
    },
  ];

  const testResult = await Lit.Actions.checkConditions({
    conditions: accessControlConditions,
    authSig: JSON.parse(authSig),
    chain: "ethereum",
  });

  if (!testResult) {
    LitActions.setResponse({
      response: "Address is not authorized",
    });
    return;
  }

  LitActions.setResponse({
    response: "true",
  });
})();
```

</TabItem>

<TabItem value="eth-address-b">

```ts
(async () => {
  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "ETHEREUM_ADDRESS_B", // <-- Replace with your Ethereum address B
      },
    },
  ];

  const testResult = await Lit.Actions.checkConditions({
    conditions: accessControlConditions,
    authSig: JSON.parse(authSig),
    chain: "ethereum",
  });

  if (!testResult) {
    LitActions.setResponse({
      response: "Address is not authorized",
    });
    return;
  }

  LitActions.setResponse({
    response: "true",
  });
})();
```

#### `accessControlConditions`

```ts
const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "ETHEREUM_ADDRESS", // <-- Replace with Ethereum address A or B
      },
    },
];
```

</TabItem>
</Tabs>

If you're following this guide, you should replace `ETHEREUM_ADDRESS_A` and `ETHEREUM_ADDRESS_B` with the addresses corresponding to the ENVs `ETHEREUM_PRIVATE_KEY_A` and `ETHEREUM_PRIVATE_KEY_B`. Then you'll want to upload the Lit Action code to IPFS ([Pinata](https://www.pinata.cloud/) provides this service), and copy the IPFS CID for both Lit Actions and set the values for their respective ENVs: `LIT_ACTION_CHECK_ADDRESS_A` and `LIT_ACTION_CHECK_ADDRESS_B`.

### Instantiating the Ethers Signers

The `ETHEREUM_PRIVATE_KEY_A` and `ETHEREUM_PRIVATE_KEY_B` environment variables are required. `ETHEREUM_PRIVATE_KEY_A` should have Lit test tokens on the `datil-dev` network (if you need some the faucet is [here](https://faucet.litprotocol.com/)).

These Ethers signers will be used to provide Authentication Signatures to the `getLitActionSessionSigs` function that will provide PKP Session Signatures used to add and remove Custom Authentication Methods for the PKP.

```ts
import * as ethers from 'ethers';

const ethersSignerA = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY_A,
    new ethers.providers.JsonRpcProvider(
        "https://chain-rpc.litprotocol.com/http"
    )
);
const ethersSignerB = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY_B,
    new ethers.providers.JsonRpcProvider(
        "https://chain-rpc.litprotocol.com/http"
    )
);
```

### Instantiating a `LitContractsClient`

Here we are instantiating an instance of `LitContractsClient` and connecting it to the `datil-dev` Lit test network. This client is how we'll mint a new PKP and add and remove permitted Authentication Methods for the PKP.

`ethersSignerA` is being set as the transaction signer for the contracts client. It will be used to sign and broadcast transaction to the `datil-dev` network to update the PKP Permissions contract, and will be charged Lit test tokens as gas for these transactions.

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";

const litContracts = new LitContracts({
    signer: ethersSignerA,
    network: 'datil-dev',
    debug: false,
});
await litContracts.connect();
```

### Mint a New PKP

Next we mint a new PKP - this is the PKP we'll be adding and removing Custom Authentication Methods from.

```ts
const mintedPkp = (await litContracts.pkpNftContractUtils.write.mint()).pkp;
```

`mintedPkp` will be an object containing the properties:

```ts
{
    tokenId: any;
    publicKey: string;
    ethAddress: string;
}
```

Where

- `tokenId` is the id for the PKP NFT
- `publicKey` is the PKP's public key
- `ethAddress` is the Ethereum address derived from `publicKey`
 
We'll be using the `tokenId` to add and remove the Authentication Methods.

### Adding the First Custom Authentication Method

Now that we have a PKP, we're going to add the Lit Action that authorizes `ETHEREUM_PRIVATE_KEY_A` to use the PKP:

```ts
import { AuthMethodScope } from "@lit-protocol/constants";

const addAuthMethodAReceipt = await litContracts.addPermittedAction({
    pkpTokenId: mintedPkp.tokenId,
    ipfsId: process.env.LIT_ACTION_CHECK_ADDRESS_A,
    authMethodScopes: [AuthMethodScope.SignAnything],
});
```

- `pkpTokenId` is the id of the PKP NFT we got from [Minting a new PKP](#mint-a-new-pkp)
- `ipfsId` is the IPFS CID of the [Custom Authentication Lit Action](#creating-the-custom-authentication-lit-actions) that authorizes `ETHEREUM_PRIVATE_KEY_A` to use the PKP
- `authMethodScopes` is what we're allowing the Custom Authentication Method to do
  - Here we're allowing it to `SignAnything` which means it can sign arbitrary data which is required to produce PKP Session Signatures

### (Optional) Verify First Custom Authentication Method is Permitted

This step is optional, but here we're verifying that `process.env.LIT_ACTION_CHECK_ADDRESS_A` was added as a permitted Authentication Method for the new PKP:



```ts
import bs58 from "bs58";

const LIT_ACTION_A_IPFS_CID_BYTES = `0x${Buffer.from(
  bs58.decode(process.env.LIT_ACTION_CHECK_ADDRESS_A)
).toString("hex")}`;

let isPermittedA =
    await litContracts.pkpPermissionsContract.read.isPermittedAction(
        mintedPkp.tokenId,
        LIT_ACTION_A_IPFS_CID_BYTES
    );
if (!isPermittedA)
    throw new Error("Lit Action Auth Method A is not permitted for the PKP");
```

### Transferring PKP Ownership to Itself

Because ownership of the PKP is determined by what address owns it's corresponding NFT, we can transfer ownership by simply transferring the NFT to a new address:

```ts
const transferPkpOwnershipReceipt = await (
    await litContracts.pkpNftContract.write.transferFrom(
        ethersSignerA.address,
        mintedPkp.ethAddress,
        mintedPkp.tokenId,
        {
            gasLimit: 125_000,
        }
    )
).wait();
```

Here we're transferring the NFT from `ethersSignerA.address` to `mintedPkp.ethAddress`. After this transaction is included in a block, `ETHEREUM_PRIVATE_KEY_A` will no longer be the "controller" of the PKP and will need to obtain PKP Session Signature to use the PKP using the Custom Authentication Method  [added previously](#adding-the-first-custom-authentication-method).

### Instantiating a `LitNodeClient`

Next we instantiate an instance of `LitNodeClient` and connecting it to the `datil-dev` Lit network.

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";

const litNodeClient = new LitNodeClient({
    litNetwork: 'datil-dev',
    debug: false,
});
await litNodeClient.connect();
```

### Generating PKP Session Signatures Using the First Custom Authentication Method

Because we've transferred ownership of the PKP from `ETHEREUM_PRIVATE_KEY_A` to itself, `ETHEREUM_PRIVATE_KEY_A` can no longer use the PKP directly. Instead we have to send a request to the Lit network to generate Session Signatures using our PKP. To do this, we have to authenticate with an Authentication Method so the Lit network can check if we're authorized to the PKP. Below we're using the Custom Authentication Method for authorizing `ETHEREUM_PRIVATE_KEY_A`:

```ts
import {
  LitAbility,
  LitActionResource,
  LitPKPResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

const pkpSessionSigsA = await litNodeClient.getLitActionSessionSigs({
    pkpPublicKey: mintedPkp.publicKey,
    resourceAbilityRequests: [
    {
        resource: new LitPKPResource("*"),
        ability: LitAbility.PKPSigning,
    },
    {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
    },
    ],
    litActionIpfsId: process.env.LIT_ACTION_CHECK_ADDRESS_A,
    jsParams: {
        authSig: JSON.stringify(
            await generateAuthSig({
                signer: ethersSignerA,
                // @ts-ignore
                toSign: await createSiweMessageWithRecaps({
                        uri: "http://localhost",
                        expiration: new Date(
                        Date.now() + 1000 * 60 * 60 * 24
                    ).toISOString(), // 24 hours
                    walletAddress: ethersSignerA.address,
                    nonce: await litNodeClient.getLatestBlockhash(),
                    litNodeClient,
                }),
            })
        ),
    },
});
```

- `pkpPublicKey` This is the public key of the PKP use to generate the Session Signatures
- `resourceAbilityRequests` This is an array of [Lit Resources and Abilities](../../sdk/authentication/session-sigs/resources-and-abilities) that we're allowing anyone with the PKP Session Signature to use the PKP for
  - Above we're requesting the ability to sign arbitrary data and execute Lit Actions with the PKP
- `litActionIpfsId` This is the IPFS CID for the Custom Authentication Method we [permitted previously](#adding-the-first-custom-authentication-method) that authorizes the corresponding Ethereum address for `ETHEREUM_PRIVATE_KEY_A`
- `jsParams` This object contains parameters that will be made available to the Lit Action while it's executing
  - The keys for each property will be the name of the variable within the Lit Action, and the values will be assigned automatically to each variable
  - Above we're generating an Authentication Signature using `ethersSignerA`, `JSON.stringify`ing the resulting object, and providing it to be used with the Lit Action as the variable `authSig`
  - The Lit Action will derive an address from the `authSig` variable, and will compare it against the Custom Authentication Method's Access Control Conditions to determine whether or not the address is permitted to use the PKP

After `getLitActionSessionSigs` successfully execute, we will have Session Signatures produces by the Lit network using our PKP, authorizing us to request the Lit network to sign data with the PKP, and execute Lit Actions.

### Funding the PKP

Because adding and removing Authentication Methods are onchain transactions, and the PKP is the only authorized entity to add and remove methods, we need to send the PKP some Lit test tokens to be able to add or remove methods:

```ts
import * as ethers from "ethers";

const fundPkpTxReceipt = await (
    await ethersSignerA.sendTransaction({
        to: mintedPkp.ethAddress,
        value: ethers.utils.parseEther("0.0001"),
    })
).wait();
```

Here we're simply transferring tokens from the corresponding Ethereum address for `ETHEREUM_PRIVATE_KEY_A`, to the PKP's Ethereum address.

### Instantiating a PKP Ethers Wallet Using `pkpSessionSigsA`

Because we transferred ownership of the PKP NFT to itself, it's the only authorized entity to make any changes to the PKP Permission contracts that governs permitted Authentication methods. So in order to make any changes to the permitted Authentication Methods, we need to sign a transaction using the PKP.

To do this we're going to make use of the `PKPEthersWallet` export from the `@lit-protocol/pkp-ethers` package:

```ts
const pkpEthersWalletA = new PKPEthersWallet({
    litNodeClient,
    pkpPubKey: mintedPkp.publicKey,
    controllerSessionSigs: pkpSessionSigsA,
});
await pkpEthersWalletA.init();
```

- `litNodeClient` is the client we instantiated in the [Instantiating a `LitNodeClient`](#instantiating-a-litnodeclient) section
- `pkpPubKey` is the public key for the PKP we're going to modifying permitted Authentication Methods for
- `controllerSessionSigs` is the PKP Session Signatures we generated in the [Generating PKP Session Signatures Using a Lit Action](#generating-pkp-session-signatures-using-a-lit-action) section
  - These Session Signatures authorizes us with the Lit network to sign a transaction using the PKP

### Instantiating a `LitContractClient` with `pkpSessionSigsA`

We previously instantiated a `LitContractClient` in the [Instantiating a `LitContractClient`](#instantiating-a-litcontractsclient) section, but we passed `ethersSignerA` as the signer for transactions.

Now we're going to instantiate another `LitContractClient` instance, this time using the PKP Ethers Wallet as the signer:

```ts
const litContractsPkpSignerA = new LitContracts({
    signer: pkpEthersWalletA,
    network: 'datil-dev',
    debug: false,
});
await litContractsPkpSignerA.connect();
```

### Adding the Second Custom Authentication Method

Using the `LitContractClient` instance with the PKP signer, we can now sign a transaction to add the second Custom Authentication Method (`process.env.LIT_ACTION_CHECK_ADDRESS_B`) that authorizes the corresponding Ethereum address for `ETHEREUM_PRIVATE_KEY_B` to use the PKP:

```ts
import bs58 from "bs58";

const LIT_ACTION_B_IPFS_CID_BYTES = `0x${Buffer.from(
  bs58.decode(process.env.LIT_ACTION_CHECK_ADDRESS_B)
).toString("hex")}`;

const addAuthMethodBReceipt = await (
    await litContractsPkpSignerA.pkpPermissionsContract.write.addPermittedAction(
        mintedPkp.tokenId,
        LIT_ACTION_B_IPFS_CID_BYTES,
        [AuthMethodScope.SignAnything],
        {
            gasPrice: await ethersSignerA.provider.getGasPrice(),
            gasLimit: 250_000,
        }
    )
).wait();
```

### (Optional) Verify Second Custom Authentication Method is Permitted

This step is optional, but here we're verifying that `process.env.LIT_ACTION_CHECK_ADDRESS_B` was added as a permitted Authentication Method for the new PKP:

```ts
import bs58 from "bs58";

const LIT_ACTION_B_IPFS_CID_BYTES = `0x${Buffer.from(
  bs58.decode(process.env.LIT_ACTION_CHECK_ADDRESS_B)
).toString("hex")}`;

const isPermittedB =
    await litContracts.pkpPermissionsContract.read.isPermittedAction(
        mintedPkp.tokenId,
        LIT_ACTION_B_IPFS_CID_BYTES
    );
if (!isPermittedB)
    throw new Error("Lit Action Auth Method B is not permitted for the PKP");
```

### Generating PKP Session Signatures Using the Second Custom Authentication Method

Similar to when we generating PKP Session [Signatures using the first Custom Authentication Method](#generating-pkp-session-signatures-using-the-first-custom-authentication-method), we're going to create new PKP Session Signatures using `ETHEREUM_PRIVATE_KEY_B` as the authenticated entity:

:::note
Notice we're using `ethersSignerB` to sign the `authSig` passed into the Lit Action.
:::

```ts
import {
  LitAbility,
  LitActionResource,
  LitPKPResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

const pkpSessionSigsB = await litNodeClient.getLitActionSessionSigs({
    pkpPublicKey: mintedPkp.publicKey,
    resourceAbilityRequests: [
    {
        resource: new LitPKPResource("*"),
        ability: LitAbility.PKPSigning,
    },
    {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
    },
    ],
    litActionIpfsId: process.env.LIT_ACTION_CHECK_ADDRESS_B,
    jsParams: {
        authSig: JSON.stringify(
            await generateAuthSig({
                signer: ethersSignerB,
                // @ts-ignore
                toSign: await createSiweMessageWithRecaps({
                    uri: "http://localhost",
                    expiration: new Date(
                    Date.now() + 1000 * 60 * 60 * 24
                    ).toISOString(), // 24 hours
                    walletAddress: ethersSignerB.address,
                    nonce: await litNodeClient.getLatestBlockhash(),
                    litNodeClient,
                }),
            })
        ),
    },
});
```

### Instantiating a PKP Ethers Wallet Using `pkpSessionSigsB`

Also similar to [Instantiating a PKP Ethers Wallet Using `pkpSessionSigsB`](#instantiating-a-pkp-ethers-wallet-using-pkpsessionsigsa), we create a `PKPEthersWallet` instance, but with `pkpSessionSigsB` as the `controllerSessionSigs`:

```ts
const pkpEthersWalletB = new PKPEthersWallet({
    litNodeClient,
    pkpPubKey: mintedPkp.publicKey,
    controllerSessionSigs: pkpSessionSigsB,
});
await pkpEthersWalletB.init();
```

### Instantiating a `LitContractClient` with `pkpSessionSigsB`

Similar to [Instantiating a `LitContractClient` with `pkpSessionSigsA`](#instantiating-a-litcontractclient-with-pkpsessionsigsa), we create an instance using `pkpEthersWalletB`:

```ts
const litContractsPkpSignerB = new LitContracts({
    signer: pkpEthersWalletB,
    network: 'datil-dev',
    debug: false,
});
await litContractsPkpSignerB.connect();
```

### Removing the First Custom Authentication Method

Now that we have two Custom Authentication Methods, one for authorizing `ETHEREUM_PRIVATE_KEY_A`'s Ethereum address and another for authorizing `ETHEREUM_PRIVATE_KEY_B`'s address, we can remove one of them:

```ts
import bs58 from "bs58";

const LIT_ACTION_A_IPFS_CID_BYTES = `0x${Buffer.from(
  bs58.decode(process.env.LIT_ACTION_CHECK_ADDRESS_A)
).toString("hex")}`;

const removeAuthMethodAReceipt = await (
    await litContractsPkpSignerB.pkpPermissionsContract.write.removePermittedAction(
        mintedPkp.tokenId,
        LIT_ACTION_A_IPFS_CID_BYTES,
        {
            gasPrice: await ethersSignerA.provider.getGasPrice(),
            gasLimit: 100_000,
        }
    )
).wait();
```

The above is creating a transaction to the PKP Permission Contract to call the `removePermittedAction` function with the IPFS CID of `process.env.LIT_ACTION_CHECK_ADDRESS_A`. After this transaction is included in a block, `ETHEREUM_PRIVATE_KEY_A`'s Ethereum address will no longer be authorized to use the PKP - including using it to generate PKP Session Signatures.

### (Optional) Verify First Custom Authentication Method is Not Permitted

This step is optional, but here we're verifying that `process.env.LIT_ACTION_CHECK_ADDRESS_A` was removed as a permitted Authentication Method for the PKP:

```ts
import bs58 from "bs58";

const LIT_ACTION_A_IPFS_CID_BYTES = `0x${Buffer.from(
  bs58.decode(process.env.LIT_ACTION_CHECK_ADDRESS_A)
).toString("hex")}`;

isPermittedA =
    await litContracts.pkpPermissionsContract.read.isPermittedAction(
        mintedPkp.tokenId,
        LIT_ACTION_A_IPFS_CID_BYTES
    );
if (isPermittedA)
    throw new Error(
        "Lit Action Auth Method A is still permitted for the PKP when it's supposed to have been removed"
    );
```

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/71b41fd2d46d55cf486e1d7014a09ed4f90a85c5/pkp-update-authmethod/nodejs/src/index.ts).

After executing the example implementation above, you will have completed all the steps covered in the [Overview](#overview) section. You will have a PKP that currently only has `process.env.LIT_ACTION_CHECK_ADDRESS_B` as a permitted Authentication Method, meaning only `ETHEREUM_PRIVATE_KEY_B`'s Ethereum address can be authorized to use the PKP.
