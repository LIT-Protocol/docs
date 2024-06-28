import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Importing an Existing Private Key

This guide covers the `importPrivateKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `importPrivateKey` function, you can import an existing private key into the Lit network to be turned into a Wrapped Key. The private key will first be encrypted using Lit network's BLS key, and the resulting encryption metadata (`ciphertext` and `dataToEncryptHash`) will be returned to you and stored by Lit on your behalf in a private DynamoDB instance.

Afterwards, you will be able to make use of the SDK's signing methods (`signTransactionWithEncryptedKey` and `signMessageWithEncryptedKey`) to sign messages and transaction with the resulting Wrapped Key, all within a Lit node's trusted execution environment.

<!-- TODO Update URL once this PR is merged: https://github.com/LIT-Protocol/developer-guides-code/pull/21 -->
Below we will walk through an implementation of `importPrivateKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/importKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `importPrivateKey`'s Interface

<!-- TODO Update URL once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/ac8f17372a2c0a204286515e35b6abeb26e1effc/packages/wrapped-keys/src/lib/api/import-private-key.ts)

```ts
/**
 * Import a provided private key into the wrapped keys service backend.
 * First, the key is pre-pended with `LIT_PREFIX` for security reasons, then the salted key is encrypted and stored in the backend service.
 * The key will be associated with the PKP address embedded in the `pkpSessionSigs` you provide. One and only one wrapped key can be associated with a given LIT PKP.
 */
async function importPrivateKey(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    privateKey: string;
    publicKey: string;
    keyType: string;
  }
): Promise<string>
```

### Parameters

#### `pkpSessionSigs`

When a Wrapped Key is generated, it's encrypted with the following [Access Control Conditions](../../sdk/access-control/evm/basic-examples):

```ts
[
    {
        contractAddress: '',
        standardContractType: '',
        chain: CHAIN_ETHEREUM,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
        comparator: '=',
        value: pkpAddress,
        },
    },
];
```

where `pkpAddress` is the address derived from the `pkpSessionSigs`. This restricts the decryption (and by extension, usage) of the Wrapped Key to only those whom can generate valid Authentication Signatures from the PKP which generated the Wrapped Key.

A valid `pkpSessionSigs` object can be obtained using the [getPkpSessionSigs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getPkpSessionSigs) helper method available on an instance of [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html). We dive deeper into obtaining a `pkpSessionSigs` using `getPkpSessionSigs` in the [Generating PKP Session Signatures](#generating-pkp-session-signatures) section of this guide.

#### `litNodeClient`

This is an instance of the [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) that is connected to a Lit network. It's used to communicate with both the Lit network and the Wrapped Keys service.

#### `privateKey`

This parameter is the private key (as a clear text `string`) you're importing into the Lit network to be made into a Wrapped Key. The Wrapped Keys SDK encrypts it using the [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method from the Lit SDK, with the following [Access Control Conditions](../../sdk/access-control/evm/basic-examples):

```ts
[
    {
        contractAddress: '',
        standardContractType: '',
        chain: CHAIN_ETHEREUM,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
        comparator: '=',
        value: pkpAddress,
        },
    },
];
```

where `pkpAddress` is derived from the provided `pkpSessionSigs`.

This means that the PKP used to produce the Session Signatures (`pkpSessionSigs`) is the only entity authorized to decrypt the imported private key.

#### `publicKey`

This is the public key for the private key you're importing. It's stored in Lit's private DynamoDB instance to allow for querying of the Wrapped Key's address without having to decrypt the private key within the Wrapped Key's Lit Action.

#### `keyType`

This is the algorithm used to derive the private key you're importing. This might be `K256`, `ed25519`, or other key formats.

### Return Value

`importPrivateKey` will return `Promise<string>` after it successfully encrypts and imports the private key. The `string` returned is the corresponding Ethereum address for the PKP used to generate `pkpSessionSigs`.

## Example Implementation

Now that we know what the `importPrivateKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/importKey.ts).

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
@lit-protocol/lit-auth-client \
@lit-protocol/lit-node-client \
@lit-protocol/wrapped-keys \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/lit-auth-client \
@lit-protocol/lit-node-client \
@lit-protocol/wrapped-keys \
ethers@v5
```

</TabItem>
</Tabs>

### Instantiating an Ethers Signer

The `ETHEREUM_PRIVATE_KEY` environment variable is required. The corresponding Ethereum address needs to have ownership of the PKP we will be using to generate the `pkpSessionSigs`. 

```ts
import * as ethers from 'ethers';

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(
        "https://chain-rpc.litprotocol.com/http"
    )
);
```

### Instantiating a `LitNodeClient`

Here we are instantiating an instance of `LitNodeClient` and connecting it to the `cayenne` Lit network.

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    debug: false,
});
await litNodeClient.connect();
```

### Generating PKP Session Signatures

The `LIT_PKP_PUBLIC_KEY` environment variable is required. This PKP should be owned by the corresponding Ethereum address for the `ETHEREUM_PRIVATE_KEY` environment variable.

The PKP's Ethereum address will be used for the Access Control Conditions used to encrypt the generated private key, and by default, will be the only entity able to authorize decryption of the private key.

:::note
The `expiration` used for the Auth Method **must** be 10 minutes or less to be valid.
:::

:::note
The Auth Method used in this example implementation is signing a Sign in With Ethereum ([EIP-4361](https://eips.ethereum.org/EIPS/eip-4361)) message using an Externally Owned Account (EOA), but any Auth Method can be used to authenticate with Lit to get PKP Session Signatures.
:::

```ts
import { EthWalletProvider } from "@lit-protocol/lit-auth-client";
import {
  LitAbility,
  LitActionResource,
  LitPKPResource,
} from "@lit-protocol/auth-helpers";

const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
    pkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
    authMethods: [
        await EthWalletProvider.authenticate({
            signer: ethersSigner,
            litNodeClient,
            expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
        }),
    ],
    resourceAbilityRequests: [
    {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
    },
    ],
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
});
```

### Importing a Private Key

Now that we have all that we need, we can call `importPrivateKey` to import our key as a Wrapped Key.

```ts
import { importPrivateKey } from "@lit-protocol/wrapped-keys";

const pkpAddress = await importPrivateKey({
    pkpSessionSigs,
    litNodeClient,
    privateKey: process.env.ETHEREUM_PRIVATE_KEY,
    publicKey: process.env.ETHEREUM_PUBLIC_KEY,
    keyType: 'K256'
});
```

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/importKey.ts).

After executing the example implementation above, you will have imported your private key as a Wrapped Key into the Lit network. The `pkpAddress` returned from `importPrivateKey` is confirmation of what PKP has authorization to decrypt and use the Wrapped Key.

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)
