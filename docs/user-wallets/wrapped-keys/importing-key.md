import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Importing an Existing Private Key

This guide covers the `importPrivateKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `importPrivateKey` function, you can import an existing private key into the Lit network to be turned into a Wrapped Key. The private key will first be encrypted using Lit network's BLS key, and the resulting encryption metadata (`ciphertext` and `dataToEncryptHash`) will be returned to you and stored by Lit on your behalf in a private DynamoDB instance.

Afterwards, you will be able to make use of the SDK's signing methods (`signTransactionWithEncryptedKey` and `signMessageWithEncryptedKey`) to sign messages and transactions with the resulting Wrapped Key, all within a Lit node's trusted execution environment.

Below we will walk through an implementation of `importPrivateKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/generateWrappedKey.ts).

## Overview of How it Works

1. The Wrapped Keys SDK will derive the PKP's Ethereum address from the provided PKP Session Signatures
2. The SDK then generates the encryption Access Control Conditions using the derived Ethereum address
   - See the [Encrypting the Private Key](#encrypting-the-private-key) section for more info on this process
3. Using the generated Access Control Conditions, the SDK will encrypt the provided private key using the [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) Lit SDK method
   - This encrypts your provided plaintext private key using the Lit network's public BLS key
4. The SDK then stores the private key encryption metadata to the Wrapped Keys backend service, associating it with the PKP's Ethereum address
5. The SDK returns a [ImportPrivateKeyResult](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/wrapped_keys_src.ImportPrivateKeyResult.html) object containing the generated Wrapped Key ID, and the PKP Ethereum address the Wrapped Key is associated with

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../user-wallets/pkps/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `importPrivateKey`'s Interface

[Source code](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/api/import-private-key.ts)

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
    memo: string;
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

#### `memo`

This parameter is an arbitrary string that can be used as an additional identifier or descriptor of the encrypted private key.

### Return Value

`importPrivateKey` will return a [ImportPrivateKeyResult](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/types.ts#L173-L180) object after it successfully encrypts and imports the private key.

```ts
/** @typedef ImportPrivateKeyResult
 * @property { string } pkpAddress The LIT PKP Address that the key was linked to; this is derived from the provided pkpSessionSigs
 * @property { string } id The unique identifier (UUID V4) of the encrypted private key
 */
interface ImportPrivateKeyResult {
  pkpAddress: string;
  id: string;
}
```

#### `pkpAddress`

This address, derived from the `pkpSessionSigs`, is what was used for the Access Control Conditions when encrypting the private key.

#### `id`

This is a unique identifier (UUID v4) generated by Lit for the Wrapped Key.

Because a PKP can have multiple Wrapped Keys attached to it, this ID is used to identify which Wrapped Key to use when calling other Wrapped Key methods such as [signMessageWithEncryptedKey](./sign-message.md) and [signTransactionWithEncryptedKey](./sign-transaction.md).

## Example Implementation

Now that we know what the `importPrivateKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/importKey.ts).

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

### Importing a Private Key

Now that we have all that we need, we can call `importPrivateKey` to import our key as a Wrapped Key.

<Tabs
defaultValue="eth"
values={[
{label: 'Importing an Ethereum Key', value: 'eth'},
{label: 'Importing a Solana Key', value: 'sol'},
]}>
<TabItem value="eth">

```ts
import { importPrivateKey } from "@lit-protocol/wrapped-keys";

const { pkpAddress, id } = await importPrivateKey({
    pkpSessionSigs,
    litNodeClient,
    privateKey: process.env.ETHEREUM_PRIVATE_KEY,
    publicKey: process.env.ETHEREUM_PUBLIC_KEY,
    keyType: 'K256',
    memo: "This is an arbitrary string you can replace with whatever you'd like",
});
```

</TabItem>

<TabItem value="sol">

```ts
import { importPrivateKey } from "@lit-protocol/wrapped-keys";

const { pkpAddress, id } = await importPrivateKey({
    pkpSessionSigs,
    litNodeClient,
    privateKey: process.env.SOLANA_PRIVATE_KEY,
    publicKey: process.env.SOLANA_PUBLIC_KEY,
    keyType: 'ed25519',
    memo: "This is an arbitrary string you can replace with whatever you'd like",
});
```

</TabItem>
</Tabs>

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/wrapped-keys/nodejs/src/importKey.ts).

After executing the example implementation above, you will have imported your private key as a Wrapped Key into the Lit network. The `pkpAddress` returned from `importPrivateKey` is confirmation of what PKP has authorization to decrypt and use the Wrapped Key, and the `id` returned is the unique identifier for the resulting Wrapped Key.

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)
