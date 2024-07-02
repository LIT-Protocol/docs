import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Storing Wrapped Key Metadata

This guide covers the `storeEncryptedKeyMetadata` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

The `storeEncryptedKeyMetadata` function allows you to manually initialize a Wrapped Key by providing the required Wrapped Key metadata. Lit will store the provided metadata in a private instance of DynamoDB, effectively registering the Wrapped Key for use.

This method is useful for when you would like to implement your own method of generating a private key and encrypting it with Lit network's public BLS key. This could be code completely ran on your own infrastructure, or this could be a custom Lit Action that you've implemented. The stored metadata can then later be used with the other Wrapped Keys SDK methods (e.g. [signMessageWithEncryptedKey](./sign-message.md) or [signTransactionWithEncryptedKey](./sign-transaction.md)), or custom Lit Actions you create to sign data with a Wrapped Key.

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
Below we will walk through an implementation of `storeEncryptedKeyMetadata`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/storeWrappedKeyMetadata.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)
- [Encrypting using the Lit SDK](../../sdk/access-control/quick-start#performing-encryption)

## `storeEncryptedKeyMetadata`'s Interface

<!-- TODO Update URL once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/api/store-encrypted-key-metadata.ts)

```ts
/** Get a previously encrypted and persisted private key and its metadata.
 * Note that this method does _not_ decrypt the private key; only the _encrypted_ key and its metadata will be returned to the caller.
 */
export async function storeEncryptedKeyMetadata(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    ciphertext: string;
    dataToEncryptHash: string;
    publicKey: string;
    keyType: string;
  }
): Promise<boolean>
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

where `pkpAddress` is the addressed derived from the `pkpSessionSigs`. This restricts the decryption of the Wrapped Key to only those whom can generate valid Authentication Signatures from the PKP which generated the Wrapped Key.

A valid `pkpSessionSigs` object can be obtained using the [getPkpSessionSigs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getPkpSessionSigs) helper method available on an instance of [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html). We dive deeper into obtaining a `pkpSessionSigs` using `getPkpSessionSigs` in the [Generating PKP Session Signatures](#generating-pkp-session-signatures) section of this guide.

#### `litNodeClient`

This is an instance of the [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) that is connected to a Lit network.

#### `ciphertext`

This is the result of encrypting the clear text private key and the Access Control Conditions for decryption using the Lit SDK.

This value can be obtained using the Lit SDK's [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method:

:::note
In the below example, `process.env.PKP_ETH_ADDRESS` would be the Ethereum address of the PKP you would like to associate the Wrapped Key with. This restricts the decryption (and by extension, usage) of the Wrapped Key to only those whom can generate valid Authentication Signatures from the PKP which corresponds to this address.
:::

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { encryptString } from '@lit-protocol/lit-node-client';

const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    debug: false,
});
await litNodeClient.connect();

const { ciphertext, dataToEncryptHash } = await encryptString(
    {
        accessControlConditions: [
            {
                contractAddress: '',
                standardContractType: '',
                chain: 'ethereum',
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                comparator: '=',
                value: process.env.PKP_ETH_ADDRESS,
                },
            },
        ],
        // For enhanced security, "lit_" should be prepended to all stored private keys.
        dataToEncrypt: `lit_${process.env.CLEAR_TEXT_PRIVATE_KEY}`,
    },
    litNodeClient,
)
```

#### `dataToEncryptHash`

This is the SHA-256 hash of the clear text private key.

This value can be obtained using the Lit SDK's [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method:

:::note
In the below example, `process.env.PKP_ETH_ADDRESS` would be the Ethereum address of the PKP you would like to associate the Wrapped Key with. This restricts the decryption (and by extension, usage) of the Wrapped Key to only those whom can generate valid Authentication Signatures from the PKP which corresponds to this address.
:::

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { encryptString } from '@lit-protocol/lit-node-client';

const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    debug: false,
});
await litNodeClient.connect();

const { ciphertext, dataToEncryptHash } = await encryptString(
    {
        accessControlConditions: [
            {
                contractAddress: '',
                standardContractType: '',
                chain: 'ethereum',
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                comparator: '=',
                value: process.env.PKP_ETH_ADDRESS,
                },
            },
        ],
        dataToEncrypt: process.env.CLEAR_TEXT_PRIVATE_KEY,
    },
    litNodeClient,
)
```

#### `publicKey`

This is the corresponding public key for the private key you're encrypting and turning into a Wrapped Key.

#### `keyType`

This is the algorithm used to derive the private key you're importing. This might be `K256`, `ed25519`, or other key formats.

### Return Value

`storeEncryptedKeyMetadata` will return `Promise<boolean>` indicating the success of storing the Wrapped Key metadata within Lit's private instance of DynamoDB.

## Example Implementation

Now that we know what the `storeEncryptedKeyMetadata` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/storeWrappedKeyMetadata.ts).

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

### Getting a Wrapped Key's Metadata

Now that we know what the `storeEncryptedKeyMetadata` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/storeWrappedKeyMetadata.ts).

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { encryptString } from '@lit-protocol/lit-node-client';
import { api } from "@lit-protocol/wrapped-keys";

const { storeEncryptedKeyMetadata } = api;

const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    debug: false,
});
await litNodeClient.connect();

const { ciphertext, dataToEncryptHash } = await encryptString(
    {
        accessControlConditions: [
            {
                contractAddress: '',
                standardContractType: '',
                chain: 'ethereum',
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                comparator: '=',
                value: process.env.PKP_ETH_ADDRESS,
                },
            },
        ],
        dataToEncrypt: process.env.CLEAR_TEXT_PRIVATE_KEY,
    },
    litNodeClient,
)

const successfullyStoredMetadata = await storeEncryptedKeyMetadata({
    pkpSessionSigs,
    litNodeClient,
    ciphertext;
    dataToEncryptHash;
    publicKey: process.env.PUBLIC_KEY;
    keyType: `K256`;
});
```

### Summary

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/storeWrappedKeyMetadata.ts).

After executing the example implementation above, you will have stored the metadata for a Wrapped Key and associated with the PKP that produced the provided `pkpSessionSigs`.

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)
