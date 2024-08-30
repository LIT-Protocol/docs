import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generating a New Key

This guide covers the `generatePrivateKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `generatePrivateKey` function, you can request a Lit node to generate a new private key within it's trusted execution environment (TEE). Once generated, the private key will be encrypted using Lit network's BLS key, and the resulting encryption metadata (`ciphertext` and `dataToEncryptHash`) will be returned and stored by Lit on your behalf in a private DynamoDB instance.

Afterwards, you will be able to make use of the SDK's signing methods (`signTransactionWithEncryptedKey` and `signMessageWithEncryptedKey`) to sign messages and transaction with the generated private key, all within a Lit node's TEE.

Below we will walk through an implementation of `generatePrivateKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/generateWrappedKey.ts).

## Overview of How it Works

1. The Wrapped Keys SDK will derive the PKP's Ethereum address from the provided PKP Session Signatures
2. The SDK then generates the encryption Access Control Conditions using the derived Ethereum address
   - See the [Encrypting the Private Key](#encrypting-the-private-key) section for more info on this process
3. Using the PKP Session Signatures, the SDK will make a request to the Lit network to execute the Generate Private Key Lit Action
   - Depending on the provided `network`, one of the following Lit Actions will be executed:
     - If `network` is `ethereum`, then the [generateEncryptedEthereumPrivateKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/ethereum/src/generateEncryptedEthereumPrivateKey.js) Lit Action is executed
     - If `network` is `solana`, then the [generateEncryptedSolanaPrivateKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/solana/src/generateEncryptedSolanaPrivateKey.js) Lit Action is executed
4. The Lit Action uses a third-party library (either [ethers.js](https://docs.ethers.org/v5/) or [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)) to generate a private key withing a single Lit node's TEE
5. The generated private key is then encrypted using the previously generated Access Control Conditions
6. The encryption metadata is returned from the Lit Action
7. The Wrapped Keys SDK then stores the private key encryption metadata to the Wrapped Keys backend service, associating it with the PKP's Ethereum address
8. The SDK returns a [GeneratePrivateKeyResult](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/wrapped_keys_src.GeneratePrivateKeyResult.html) object containing the generated Wrapped Key ID, the PKP Ethereum address the Wrapped Key is associated with, and the public key of the generated private key

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../user-wallets/pkps/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `generatePrivateKey`'s Interface

[Source code](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/api/generate-private-key.ts)

```ts
/**
 * Generates a random private key inside a Lit Action, and persists the key and its metadata to the wrapped keys service.
 * Returns the public key of the random private key, and the PKP address that it was associated with.
 * We don't return the generated wallet address since it can be derived from the publicKey
 *
 * The key will be associated with the PKP address embedded in the `pkpSessionSigs` you provide. One and only one wrapped key can be associated with a given LIT PKP.
 */
async function generatePrivateKey(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    network: 'evm' | 'solana';
    memo: string;
  }
): Promise<{
    pkpAddress: string;
    generatedPublicKey: string;
    id: string;
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

#### `network`

This parameter dictates what elliptic curve is used to generate the private key. It must be one of the supported Wrapped Keys [Networks](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/types.ts#L10) which currently consists of:

  - `evm` This will generate a private key using the ECDSA curve.
  - `solana` This will generate a private key using the Ed25519 curve.

#### `memo`

This parameter is an arbitrary string that can be used as an additional identifier or descriptor of the encrypted private key.

### Return Value

`generatePrivateKey` will return a [GeneratePrivateKeyResult](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/types.ts#L147-L156) object after it successfully generates and encrypts the private key and stores the encryption metadata.

```ts
/** @typedef GeneratePrivateKeyResult
 * @property { string } pkpAddress The LIT PKP Address that the key was linked to; this is derived from the provided pkpSessionSigs
 * @property { string } generatedPublicKey The public key component of the newly generated keypair
 *
 */
interface GeneratePrivateKeyResult {
  pkpAddress: string;
  generatedPublicKey: string;
  id: string;
}
```

#### `pkpAddress`

This address, derived from the `pkpSessionSigs`, is what was used for the Access Control Conditions when encrypting the private key.

#### `generatedPublicKey`

This is the public key for the generated private key. The corresponding address, derived from the public key, can be obtained using the [getEncryptedKeyMetadata](./getting-wrapped-key-metadata) function from the Wrapped Keys SDK.

#### `id`

This is a unique identifier (UUID v4) generated by Lit for the Wrapped Key.

Because a PKP can have multiple Wrapped Keys attached to it, this ID is used to identify which Wrapped Key to use when calling other Wrapped Key methods such as [signMessageWithEncryptedKey](./sign-message.md) and [signTransactionWithEncryptedKey](./sign-transaction.md).

## Example Implementation

Now that we know what the `generatePrivateKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/generateWrappedKey.ts).

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

### Generating a Private Key

Now that we have all that we need, we can call `generatePrivateKey` to generate our Wrapped Key:

<Tabs
defaultValue="evm"
values={[
{label: 'EVM Private Key', value: 'evm'},
{label: 'Solana Private Key', value: 'sol'},
]}>
<TabItem value="evm">

```ts
import { api } from "@lit-protocol/wrapped-keys";

const { generatePrivateKey } = api;

const { pkpAddress, generatedPublicKey } = await generatePrivateKey({
    pkpSessionSigs,
    network: 'evm',
    memo: "This is an arbitrary string you can replace with whatever you'd like",
    litNodeClient,
});
```

</TabItem>

<TabItem value="sol">

```ts
import { api } from "@lit-protocol/wrapped-keys";

const { generatePrivateKey } = api;

const { pkpAddress, generatedPublicKey } = await generatePrivateKey({
    pkpSessionSigs,
    network: 'solana',
    memo: "This is an arbitrary string you can replace with whatever you'd like",
    litNodeClient,
});
```

</TabItem>
</Tabs>

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/generateWrappedKey.ts).

After executing the example implementation above, the `generatePrivateKey` function will return you an object containing the corresponding public key and ID for your generated Wrapped Key, and the PKP address that is associated with it (and used to encrypt the Wrapped Key).

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)
