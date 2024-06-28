import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Wrapped Key Metadata

This guide covers the `getEncryptedKeyMetadata` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

The `getEncryptedKeyMetadata` function allows you to request a Wrapped Key's metadata stored within Lit's private DynamoDB instance. Covered in detail [further in this guide](#return-value), the metadata includes properties such as the encrypted private key's `ciphertext` and `dataToEncryptHash` that could be used to decrypt the key outside of the Wrapped Key Lit Actions.

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
Below we will walk through an implementation of `getEncryptedKeyMetadata`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/getWrappedKeyMetadata.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `getEncryptedKeyMetadata`'s Interface

<!-- TODO Update URL once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/ac8f17372a2c0a204286515e35b6abeb26e1effc/packages/wrapped-keys/src/lib/api/get-encrypted-key-metadata.ts)

```ts
/** Get a previously encrypted and persisted private key and its metadata.
 * Note that this method does _not_ decrypt the private key; only the _encrypted_ key and its metadata will be returned to the caller.
 */
export async function getEncryptedKeyMetadata(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
  }
): Promise<{
  ciphertext: string;
  dataToEncryptHash: string;
  publicKey: string;
  pkpAddress: string;
  keyType: string;
  litNetwork: LIT_NETWORKS_KEYS;
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

### Return Value

#### `ciphertext`

This return value is the encrypted form of the underlying private key for the Wrapped Key associated with the PKP that produced `pkpSessionSigs`.

Used with the `dataToEncryptHash`, Access Control Conditions, and `pkpSessionSigs`, [you can decrypt](../../sdk/access-control/quick-start#performing-decryption) the `ciphertext` to get the clear text private key.

#### `dataToEncryptHash`

This is the `SHA-256` hash of the `ciphertext`.

Used with the `ciphertext`, Access Control Conditions, and `pkpSessionSigs`, [you can decrypt](../../sdk/access-control/quick-start#performing-decryption) the `ciphertext` to get the clear text private key.

#### `publicKey`

This is the corresponding public key for the underlying private key for the Wrapped Key.

#### `pkpAddress`

This is the Ethereum address for the PKP that is associated with the Wrapped Key i.e. the PKP that created the Session Signatures when the Wrapped Key was imported/generated, and used for encrypting the private key. The address is derived from the provided `pkpSessionSigs`.

#### `keyType`

This is the algorithm used to generate the underlying private key for the Wrapped Key.

#### `litNetwork`

This is the Lit network that the `LitNodeClient` was connected to when the Wrapped Key was created.

## Example Implementation

Now that we know what the `getEncryptedKeyMetadata` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/getWrappedKeyMetadata.ts).

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

### Getting a Wrapped Key's Metadata

Now that we know what the `getEncryptedKeyMetadata` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/getWrappedKeyMetadata.ts).

```ts
import { api } from "@lit-protocol/wrapped-keys";

const { getEncryptedKeyMetadata } = api;

const wrappedKeyMetadata = await getEncryptedKeyMetadata({
    pkpSessionSigs,
    litNodeClient,
});
```

### Summary

<!-- TODO The dev guide code example doesn't currently exist. Currently blocked by the publishing of the updated Wrapped Keys SDK (https://github.com/LIT-Protocol/js-sdk/pull/513) -->
The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/getWrappedKeyMetadata.ts).

After executing the example implementation above, you will have exported the metadata for the Wrapped Key associated with the PKP that produced the provided `pkpSessionSigs`.
