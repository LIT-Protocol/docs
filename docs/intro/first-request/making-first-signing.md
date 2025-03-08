import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Making Your First Signing Request

This guide will walk you through an example of signing data using a Programmable Key Pair (PKP).

PKPs are programmable key pairs that can be used to sign data. They are typically used with [Lit Actions](../../sdk/serverless-signing/overview) while executing code on the Lit network, but they can also be used standalone.

We will cover:

- Connecting to the Lit network
- Minting a PKP owned by an Ethereum wallet
- Signing a message with the PKP

This guide uses Lit's [Datil-dev Network](../../connecting-to-a-lit-network/testnets#datil-test), a free test network designed for developers to familiarize themselves with the Lit SDK. Since no payment is required, the code is less complex. For building production-ready applications, the [Datil-test Network](../../connecting-to-a-lit-network/testnets#datil-test) is recommended. Once your application is ready for deployment, you can move it to [Datil](../../connecting-to-a-lit-network/mainnets#datil), the Lit production network.

:::info
For more in-depth guides on PKP signing, please see the [PKPs](../../user-wallets/pkps/overview) section.
:::

## Installing the Example Dependencies

To start PKP signing with the Lit SDK, you'll need to install these packages:

- `@lit-protocol/lit-node-client`: The core Lit SDK package.
- `@lit-protocol/constants`: A package containing useful constants across the SDK.
- `@lit-protocol/auth-helpers`: A package containing useful functions for generating Session Signatures and authentication.
- `@lit-protocol/contracts-sdk`: A package containing useful functions for interacting with the Chronicle Yellowstone blockchain.
- `ethers@v5`: A package for interacting with Ethereum, required for wallet operations.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
@lit-protocol/contracts-sdk \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
@lit-protocol/contracts-sdk \
ethers@v5
```

</TabItem>
</Tabs>

If you're just getting started with Lit or development in general, we recommend taking a look at our [Starter Guides](https://github.com/LIT-Protocol/developer-guides-code/tree/master/starter-guides). These guides provide an environment for getting started with the Lit SDK.

## Walkthrough

### Connecting to the Lit Network

As covered in the [Connecting to Lit](./connecting-to-lit) guide, signing with Lit requires an active connection to the Lit network. This is achieved by initializing a [LitNodeClient](./connecting-to-lit) instance, which connects to Lit nodes.

Additionally, we'll initialize an Ethereum wallet using the `ETHEREUM_PRIVATE_KEY` environment variable. This wallet is essential for:

- Generating Session Signatures, which authenticate your requests with the Lit network.
- Minting the PKP, as it allows us to pay the minting fee on the blockchain.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";

const litNodeClient = new LitNodeClient({
  litNetwork: LIT_NETWORK.DatilDev,
  debug: false
});
await litNodeClient.connect();

const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY!, // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

</p>
</details>

### Minting a PKP

In order to sign data with a PKP, we must first mint one. To mint the PKP, we'll use the `LitContracts` class, which interacts with the [Chronicle Yellowstone](../../connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone) blockchain—Lit's custom EVM rollup. By setting the `signer` to the wallet we initialized earlier, we can pay the PKP minting fee using the Lit test token.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";

const litContracts = new LitContracts({
    signer: ethersWallet,
    network: LIT_NETWORK.DatilDev,
    debug: false
});
await litContracts.connect();

const pkpInfo = (await litContracts.pkpNftContractUtils.write.mint()).pkp;
```

</p>
</details>

### Generating Session Signatures

As covered in the [Generating Session Signatures](./generating-session-sigs) guide, Session Signatures authenticate your interactions with the Lit network and are required to sign data using a PKP.

In this step, we'll generate Session Signatures that grant permission to:

- **Sign with a Specific PKP**: We specify that the session can only use the PKP we just minted by including its token ID in the resource ability requests.
- **Execute Lit Actions**: We enable the Lit Action Execution resource because the `pkpSign` method requires permission to execute Lit Actions.

These permissions ensure that the session can only perform specific actions with defined resources, enhancing security.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import { LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  generateAuthSig,
  LitActionResource,
  LitPKPResource,
} from "@lit-protocol/auth-helpers";

const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    resourceAbilityRequests: [
        {
            resource: new LitPKPResource(pkpInfo.tokenId),
            ability: LIT_ABILITY.PKPSigning,
        },
        {
          resource: new LitActionResource("*"),
          ability: LIT_ABILITY.LitActionExecution,
        },
    ],
    authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
        }) => {
        const toSign = await createSiweMessage({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: ethersWallet.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
        });

        return await generateAuthSig({
            signer: ethersWallet,
            toSign,
        });
    },
});
```
</p>
</details>

### Signing Data

With the generated Session Signatures, we can use the `pkpSign` method to sign our data using the PKP. In this example, we're signing the hash of the message **"The answer to the universe is 42."**.

If you'd like to see the `pkpSign` method's parameters, you can find them [here](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#pkpSign).

<details>
<summary> Click here to see how this is done</summary>
<p>

```ts
const signingResult = await litNodeClient.pkpSign({
  pubKey: pkpInfo.publicKey,
  sessionSigs,
  toSign: ethers.utils.arrayify(
    ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("The answer to the universe is 42.")
    )
  ),
})
```

</p>
</details>

Our `signingResult` will appear as an ECDSA signature:

<details>
<summary> Click here to see the signature</summary>
<p>

```ts
{
  r: '2755ed0cc55452c5c1ba75cad13167c537a44a6cd0fdb9da3e48a05bf8de3c5d',
  s: '3458584d1524f9d52aef1ec97386f1914fcf948f2b63c8fd8406dec38be0744f',
  recid: 0,
  signature: '0x2755ed0cc55452c5c1ba75cad13167c537a44a6cd0fdb9da3e48a05bf8de3c5d3458584d1524f9d52aef1ec97386f1914fcf948f2b63c8fd8406dec38be0744f1b',
  publicKey: '045931A629B8C00995A86E3CE6880416EE082240BE6E7FD144648115E6FB9ECB525D4B6F6CADCB17D39F318828A66E71DA501C529478C090CD682876C2F4258D49',
  dataSigned: '760404FCE401CD30392E61B48DED0382A9987C18793093A52BA25E443B20F58A'
}
```
</p>
</details>

We can easily verify that the returned signature was made by our PKP by recovering the public key and Ethereum address from `signingResult`:

<details>
<summary> Click here to see how this is done</summary>
<p>

```ts
const encodedSig = ethers.utils.joinSignature({
  v: signingResult.recid,
  r: `0x${signingResult.r}`,
  s: `0x${signingResult.s}`,
});

const recoveredPubkey = ethers.utils.recoverPublicKey(
  `0x${signingResult.dataSigned}`,
  encodedSig
);
const recoveredAddress = ethers.utils.recoverAddress(
  `0x${signingResult.dataSigned}`,
  encodedSig
);

console.log(recoveredPubkey === pkpInfo.publicKey); // true
console.log(recoveredAddress === pkpInfo.ethAddress); // true
```

</p>
</details>

# Learn More

By now you should have successfully signed data using a Lit PKP. If you’d like to learn more about what’s possible with Lit's PKP signing, visit the [Programmable Key Pairs](../../user-wallets/pkps/overview) section.

<FeedbackComponent/>

