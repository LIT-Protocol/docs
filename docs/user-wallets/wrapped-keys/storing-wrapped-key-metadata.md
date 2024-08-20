import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Storing Wrapped Key Metadata

This guide covers the `storeEncryptedKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

The `storeEncryptedKey` function allows you to manually initialize a Wrapped Key by providing the required Wrapped Key metadata. Lit will store the provided metadata in a private instance of DynamoDB, effectively registering the Wrapped Key for use.

This method is useful for when you would like to implement your own method of generating a private key and encrypting it with Lit network's public BLS key. This could be code completely ran on your own infrastructure, or this could be a custom Lit Action that you've implemented. The stored metadata can then later be used with the other Wrapped Keys SDK methods (e.g. [signMessageWithEncryptedKey](./sign-message.md) or [signTransactionWithEncryptedKey](./sign-transaction.md)), or custom Lit Actions you create to sign data with a Wrapped Key.

Below we will walk through an implementation of `storeEncryptedKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/storeWrappedKey.ts).

## Overview of How it Works

:::note
The [StoreEncryptedKeyParams](https://v6-api-doc-lit-js-sdk.vercel.app/types/wrapped_keys_src.StoreEncryptedKeyParams.html) required for this method include the encryption metadata of the private key that will be turned into a Wrapped Key. For more information on how to obtain the encryption metadata, please refer to this guide on [encrypting data using the Lit SDK](../../user-wallets/wrapped-keys/custom-wrapped-keys#generating-and-encrypting-a-private-key), and this guide on [Custom Wrapped Keys](../../user-wallets/wrapped-keys/custom-wrapped-keys#generating-and-encrypting-a-private-key).
:::

1. The Wrapped Keys SDK will derive the PKP's Ethereum address from the provided PKP Session Signatures
2. The SDK stores the provided [StoreEncryptedKeyParams](https://v6-api-doc-lit-js-sdk.vercel.app/types/wrapped_keys_src.StoreEncryptedKeyParams.html) using the Wrapped Keys backend service, associating the resulting Wrapped Key with the PKP's Ethereum address
3. The SDK returns a [StoreEncryptedKeyResult](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/wrapped_keys_src.StoreEncryptedKeyResult.html) object containing the generated Wrapped Key ID, and the PKP Ethereum address the Wrapped Key is associated with

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../user-wallets/pkps/overview.md)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)
- [Encrypting using the Lit SDK](../../sdk/access-control/quick-start#performing-encryption)

## `storeEncryptedKey`'s Interface

[Source code](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/api/store-encrypted-key.ts)

```ts
/** Stores an encrypted private key and its metadata to the wrapped keys backend service
 */
export async function storeEncryptedKey(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    ciphertext: string;
    dataToEncryptHash: string;
    publicKey: string;
    keyType: string;
    memo: string;
  }
): Promise<{
    id: string;
    pkpAddress: string;
}>
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
    litNetwork: LitNetwork.DatilDev,
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
    litNetwork: LitNetwork.DatilDev,
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

#### `memo`

This parameter is an arbitrary string that can be used as an additional identifier or descriptor of the encrypted private key.

### Return Value

`storeEncryptedKey` will return a [StoreEncryptedKeyResult](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/types.ts#L92-L102) object after it successfully stores the private key as a Wrapped Key.

```ts
/** Result of storing a private key in the wrapped keys backend service
 * Includes the unique identifier which is necessary to get the encrypted ciphertext and dataToEncryptHash in the future
 *
 * @typedef StoreEncryptedKeyResult
 * @property { string } pkpAddress The LIT PKP Address that the key was linked to; this is derived from the provided pkpSessionSigs
 * @property { string } id The unique identifier (UUID V4) of the encrypted private key
 */
export interface StoreEncryptedKeyResult {
  id: string;
  pkpAddress: string;
}
```

#### `id`

This is a unique identifier (UUID v4) generated by Lit for the Wrapped Key.

Because a PKP can have multiple Wrapped Keys attached to it, this ID is used to identify which Wrapped Key to use when calling other Wrapped Key methods such as [signMessageWithEncryptedKey](./sign-message.md) and [signTransactionWithEncryptedKey](./sign-transaction.md).

#### `pkpAddress`

This address, derived from the `pkpSessionSigs`, is what was used for the Access Control Conditions when encrypting the private key.

## Example Implementation

Now that we know what the `storeEncryptedKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/storeWrappedKey.ts).

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
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Instantiating a `LitNodeClient`

Here we are instantiating an instance of `LitNodeClient` and connecting it to the `datil-dev` Lit network.

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
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

### Encrypting the Private Key

In order to initialize a Wrapped Key, we need to store the encrypted underlying private key. This is done using the Lit SDK's [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method.

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { encryptString } from '@lit-protocol/lit-node-client';
import { api } from "@lit-protocol/wrapped-keys";

const { storeEncryptedKey } = api;

const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
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

### Storing the Encrypted Key

Now that we have the private key encryption data, we can use the `storeEncryptedKey` method to initialize a Wrapped Key.

<Tabs
defaultValue="eth"
values={[
{label: 'Importing an Ethereum Key', value: 'eth'},
{label: 'Importing a Solana Key', value: 'sol'},
]}>
<TabItem value="eth">

```ts
const successfullyStoredMetadata = await storeEncryptedKey({
    pkpSessionSigs,
    litNodeClient,
    ciphertext,
    dataToEncryptHash,
    publicKey: process.env.ETHEREUM_PUBLIC_KEY,
    keyType: 'K256',
    memo: "This is an arbitrary string you can replace with whatever you'd like",
});
```

</TabItem>

<TabItem value="sol">

```ts
const successfullyStoredMetadata = await storeEncryptedKey({
    pkpSessionSigs,
    litNodeClient,
    ciphertext,
    dataToEncryptHash,
    publicKey: process.env.SOLANA_PUBLIC_KEY,
    keyType: 'ed25519',
    memo: "This is an arbitrary string you can replace with whatever you'd like",
});
```

</TabItem>
</Tabs>

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/storeWrappedKey.ts).

After executing the example implementation above, you will have stored the metadata for a Wrapped Key and associated with the PKP that produced the provided `pkpSessionSigs`. The Wrapped Key backend will also have generated a unique ID for the Wrapped Key.

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)
