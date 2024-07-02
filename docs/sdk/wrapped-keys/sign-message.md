import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Signing a Message

This guide covers the `signMessageWithEncryptedKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `signMessageWithEncryptedKey` function, you can sign an arbitrary message using a Wrapped Key. The Wrapped Keys SDK will look up the corresponding encryption metadata (`ciphertext` and `dataToEncryptHash`) for your PKP in Lit's private DynamoDB instance. If found, it well then use your provided PKP Session Signatures to authorize decryption of the private key, and will sign your provided message, returning the signed message.

Below we will walk through an implementation of `signMessageWithEncryptedKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signMessageWithWrappedKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `signMessageWithEncryptedKey`'s Interface

<!-- TODO Update URL once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/api/sign-message-with-encrypted-key.ts)

```ts
/**
 * Signs a message inside the Lit Action using the previously persisted wrapped key associated with the current LIT PK.
 * This method fetches the encrypted key from the wrapped keys service, then executes a Lit Action that decrypts the key inside the LIT action and uses
 * the decrypted key to sign the provided transaction
 */
async function signMessageWithEncryptedKey(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    network: 'evm' | 'solana';
    messageToSign: string | Uint8Array;
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

where `pkpAddress` is the addressed derived from the `pkpSessionSigs`. This restricts the decryption of the Wrapped Key to only those whom can generate valid Authentication Signatures from the PKP which generated the Wrapped Key.

A valid `pkpSessionSigs` object can be obtained using the [getPkpSessionSigs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getPkpSessionSigs) helper method available on an instance of [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html). We dive deeper into obtaining a `pkpSessionSigs` using `getPkpSessionSigs` in the [Generating PKP Session Signatures](#generating-pkp-session-signatures) section of this guide.

#### `litNodeClient`

This is an instance of the [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) that is connected to a Lit network.

#### `network`

<!-- TODO Update URLs once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->

This parameter dictates what message signing Lit Action is used to sign `messageToSign`. It must be one of the supported Wrapped Keys [Networks](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/types.ts#L9-L12) which currently consists of:

  - `evm` This will use the [signMessageWithEthereumEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/ethereum/src/signMessageWithEthereumEncryptedKey.js) Lit Action.
    - Use this network if your Wrapped Key is a private key derived from the ECDSA curve. 
    - Uses Ethers.js' [signMessage](https://docs.ethers.org/v5/api/signer/#Signer-signMessage) function to sign `messageToSign`.
  - `solana` This will use the [signMessageWithSolanaEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/solana/src/signMessageWithSolanaEncryptedKey.js) Lit Action.
    - Use this network if your Wrapped Key is a private key derived from the Ed25519 curve.
    - Uses the [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) package to create a signer using the decrypted Wrapped Key, and the [tweetnacl](https://github.com/dchest/tweetnacl-js) package to sign `messageToSign`.

#### `messageToSign`

This parameter is the message, provided as either a `string` or a `Uint8Array`, that you would like the Wrapped Key to sign.

### Return Value

`signMessageWithEncryptedKey` will return the signature as `Promise<string>` after it successfully decrypts and signs the provided `messageToSign` using the Wrapped Key associated with the PKP derived from `pkpSessionSigs`.

## Example Implementation

Now that we know what the `signMessageWithEncryptedKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signMessageWithWrappedKey.ts).

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

### Signing a Message With A Wrapped Key

Now that we have all that we need, we can call `signMessageWithEncryptedKey` to sign a message with a Wrapped Key:

<Tabs
defaultValue="evm"
values={[
{label: 'Signing for an EVM Based Network', value: 'evm'},
{label: 'Signing for Solana', value: 'solana'},
]}>
<TabItem value="evm">

```ts
import { api } from "@lit-protocol/wrapped-keys";

const { importPrivateKey } = api;

const signature = await signMessageWithEncryptedKey({
  pkpSessionSigs,
  network: 'evm',
  messageToSign: "The answer to the Universe is 42.",
  litNodeClient,
});
```

</TabItem>

<TabItem value="solana">

```ts
import { api } from "@lit-protocol/wrapped-keys";

const { importPrivateKey } = api;

const signature = await signMessageWithEncryptedKey({
  pkpSessionSigs,
  network: 'solana',
  messageToSign: "The answer to the Universe is 42.",
  litNodeClient,
});
```

</TabItem>
</Tabs>

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signMessageWithWrappedKey.ts).

After executing the example implementation above, you will have a signed message using the Wrapped Key that's associated with PKP derived from the provided `pkpSessionSigs`.
