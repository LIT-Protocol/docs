import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Importing an Existing Private Key

This guide covers the `importPrivateKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `importPrivateKey` function, you can import an existing private key into the Lit network to be turned into a Wrapped Key. The private key will first be encrypted using Lit network's BLS key, and the resulting encryption metadata (`ciphertext` and `dataToEncryptHash`) will be returned to you and stored by Lit on your behalf in a private DynamoDB instance.

Afterwards, you will be able to make use of the SDK's signing methods (`signTransactionWithEncryptedKey` and `signMessageWithEncryptedKey`) to sign messages and transaction with the imported private key, all within a Lit node's trusted execution environment.

Below we will walk through an implementation of `importPrivateKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/importKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `importPrivateKey`'s Interface

<!-- TODO Update once Wrapped Keys PR is merged -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/wrapped-keys.ts#L88-L127)

```ts
/**
 *
 * Import a provided Solana/EVM private key into our DynamoDB instance. First the key is pre-pended with LIT_PREFIX for security reasons. Then the updated key is encrypted and stored in the database
 *
 * @param pkpSessionSigs - The PKP sessionSigs used to associated the PKP with the generated private key
 * @param privateKey - The private key imported into the database
 * @param litNodeClient - The Lit Node Client used for executing the Lit Action
 *
 * @returns { Promise<string> } - The PKP EthAddres associated with the Wrapped Key
 */
export async function importPrivateKey({
  pkpSessionSigs,
  privateKey,
  litNodeClient,
}: ImportPrivateKeyParams): Promise<string>
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

### `privateKey`

This parameter is the private key (as a `string`) you're importing into the Lit network to be made into a Wrapped Key. It's encrypted using the [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method from the Lit SDK, using the following [Access Control Conditions](../../sdk/access-control/evm/basic-examples):

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

#### `litNodeClient`

This is an instance of the [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) that is connected to a Lit network.

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

When `getPkpSessionSigs` is called, the following happens:

1. Session Keys are generated locally
2. A request to the Lit network is submitted to authorize our Session Keys to perform the requested resource abilities (`resourceAbilityRequests`)
3. The Lit network executes our `authMethods` to authenticate us
   - In our case we're using `EthWalletProvider.authenticate` to generate an Authentication Signature (a Sign in With Ethereum message) that verifies we have access to the private key of a corresponding Ethereum address.
4. The Lit network checks whether or not the authenticated Ethereum address is authorized to use the PKP
5. If authorized, the Lit network produces signature shares for our PKP, signing a message that grants our Session Keys with the requested resource abilities
6. The PKP signature shares are returned to us to use for our `generatePrivateKey` request

### Importing a Private Key

Now that we have all that we need, we can call `importPrivateKey` to import our key as a Wrapped Key.

Currently the Wrapped Keys SDK supports signing with the private keys using the following curves, so you should only import keys derived from these curves:

- `ECDSA` Commonly used in EVM based blockchains
  - When importing an `ECDSA` private key, provide it as a `0x` prefixed hexadecimal string
- `Ed25519` Used by Solana
  - When importing an `Ed25519` private key, provide it as a `base58` encoded string

```ts
import { importPrivateKey } from "@lit-protocol/wrapped-keys";

const pkpAddress = await importPrivateKey({
    pkpSessionSigs,
    privateKey,
    litNodeClient,
});
```

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/importKey.ts).

After executing the example implementation above, you will have imported your private key as a Wrapped Key into the Lit network. The `pkpAddress` returned from `importPrivateKey` is confirmation of what PKP has authorization to decrypt and use the Wrapped Key.

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)
