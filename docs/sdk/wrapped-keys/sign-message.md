import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Signing a Message

This guide covers the `signMessageWithEncryptedKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `signMessageWithEncryptedKey` function, you can sign an arbitrary message using a Wrapped Key. The Wrapped Keys SDK will look up the corresponding encryption metadata (`ciphertext` and `dataToEncryptHash`) for your PKP in Lit's private DynamoDB instance. If found, it well then use your provided PKP Session Signatures to authorize decryption of the private key, and will then sign your provided message, returning the signed message.

Below we will walk through an implementation of `signMessageWithEncryptedKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signMessageWithWrappedKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `signMessageWithEncryptedKey`'s Interface

<!-- TODO Update once Wrapped Keys PR is merged -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/wrapped-keys.ts#L242-L287)

```ts
/**
 *
 * Signs a message inside the Lit Action using the Solana/EVM key. First it fetches the encrypted key from database and then executes a Lit Action that signed the tx
 *
 * @param pkpSessionSigs - The PKP sessionSigs used to associated the PKP with the generated private key
 * @param network - The network for which the private key needs to be generated. This is used to call different Lit Actions since the keys will be of different types
 * @param messageToSign - The unsigned message which will be signed inside the Lit Action
 * @param litNodeClient - The Lit Node Client used for executing the Lit Action
 *
 * @returns { Promise<string> } - The signed Solana/EVM message
 */
export async function signMessageWithEncryptedKey({
  pkpSessionSigs,
  network,
  messageToSign,
  litNodeClient,
}: SignMessageWithEncryptedKeyParams): Promise<string>
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

#### `network`

This parameter dictates what message signing Lit Action is used to sign `messageToSign`. It must be one of the supported Wrapped Keys [Networks](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/constants.ts#L5) which currently consists of:

  - `evm` This will use the [signMessageWithEthereumEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/litActions/ethereum/src/signMessageWithEthereumEncryptedKey.js) Lit Action.
    - Use this network if your Wrapped Key is a private key derived from the ECDSA curve. 
    - Uses Ethers.js' [signMessage](https://docs.ethers.org/v5/api/signer/#Signer-signMessage) function to sign `messageToSign`.
  - `solana` This will use the [signMessageWithSolanaEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/litActions/solana/src/signMessageWithSolanaEncryptedKey.js) Lit Action.
    - Use this network if your Wrapped Key is a private key derived from the Ed25519 curve.
    - Uses the [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) package to create a signer using the decrypted Wrapped Key, and the [tweetnacl](https://github.com/dchest/tweetnacl-js) package to sign `messageToSign`.

#### `messageToSign`

Foo

#### `litNodeClient`

This is an instance of the [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) that is connected to a Lit network.
