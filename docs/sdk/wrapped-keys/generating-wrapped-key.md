import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generating a New Key

This guide covers the `generatePrivateKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `generatePrivateKey` function, you can request a Lit node to generate a new private key within it's trusted execution environment (TEE). Once generated, the private key will be encrypted using Lit network's BLS key, and the resulting encryption metadata (`ciphertext` and `dataToEncryptHash`) will be returned and stored by Lit on your behalf.

Afterwards, you will be able to make use of the SDK's signing methods (`signTransactionWithEncryptedKey` and `signMessageWithEncryptedKey`) to sign messages and transaction with the generated private key, all within a Lit node's TEE.

Below we will walk through an implementation of `generatePrivateKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/generateWrappedKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `generatePrivateKey`'s Interface

<!-- TODO Update once Wrapped Keys PR is merged -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/wrapped-keys.ts#L29-L86)

```ts
/**
 *
 * Generates a random Solana/EVM private key inside the corresponding Lit Action and returns the publicKey of the random private key. We don't return the generated wallet address since it can be derived from the publicKey
 *
 * @param pkpSessionSigs - The PKP sessionSigs used to associated the PKP with the generated private key
 * @param network - The network for which the private key needs to be generated. This is used to call different Lit Actions since the keys will be of different types
 * @param litNodeClient - The Lit Node Client used for executing the Lit Action
 *
 * @returns { Promise<GeneratePrivateKeyResponse> } - The publicKey of the generated random private key along with the PKP EthAddres associated with the Wrapped Key
 */
export async function generatePrivateKey({
  pkpSessionSigs,
  network,
  litNodeClient,
}: GeneratePrivateKeyParams): Promise<GeneratePrivateKeyResponse>
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

This parameter dictates what elliptic curve is used to generate the private key. It must be one of the supported Wrapped Keys [Networks](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/constants.ts#L5) which currently consists of:

  - `evm` This will generate a private key using the ECDSA curve.
  - `solana` This will generate a private key using the Ed25519 curve.

#### `litNodeClient`

This is an instance of the [LitNodeClient](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) that is connected to a Lit network.

### Return Value

`generatePrivateKey` will return a [GeneratePrivateKeyResponse](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/interfaces.ts#L15-L18) object after it successfully generates and encrypts the private key and stores the encryption metadata.

```ts
interface GeneratePrivateKeyResponse {
  pkpAddress: string;
  generatedPublicKey: string;
}
```

#### `pkpAddress`

This address, derived from the `pkpSessionSigs`, is what was used for the Access Control Conditions when encrypting the private key.

#### `generatedPublicKey`

This is the corresponding public key for the generated private key, and can be used to resolve the corresponding address like so:

<Tabs
defaultValue="eth"
values={[
{label: 'Ethereum Address', value: 'eth'},
{label: 'Solana Address', value: 'sol'},
]}>
<TabItem value="eth">

```js
import * as ethers from 'ethers';

// generatePrivateKeyResponse is the return value from generatePrivateKey.
// It's being omitted in this code example for brevity.
const { generatedPublicKey } = generateWrappedKeyResponse;

// Remove the prefix if it's '0x04' (uncompressed key) or just '0x'
const prefixLength = generatedPublicKey.startsWith('0x04') ? 4 : 2;
const sanitizedPublicKey = generatedPublicKey.slice(prefixLength);

// Compute the keccak256 hash of the public key and extract the address
const addressHash = ethers.utils.keccak256(`0x${sanitizedPublicKey}`);
const ethAddress = ethers.utils.getAddress(`0x${addressHash.slice(-40)}`);
```

</TabItem>

<TabItem value="sol">

```js
import { PublicKey } from '@solana/web3.js';

// generatePrivateKeyResponse is the return value from generatePrivateKey.
// It's being omitted in this code example for brevity.
const generatedPublicKey = new PublicKey(generateWrappedKeyResponse.generatedPublicKey);
const solanaAddress = generatedPublicKey.toBase58();
```

</TabItem>
</Tabs>

## Example Implementation

Now that we know what the `generatePrivateKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/generateWrappedKey.ts).

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
@lit-protocol/auth-browser \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/contracts-sdk \
@lit-protocol/lit-auth-client \
@lit-protocol/lit-node-client \
@lit-protocol/wrapped-keys \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/auth-browser \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/contracts-sdk \
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
import {
  generatePrivateKey,
  NETWORK_EVM,
} from "@lit-protocol/wrapped-keys";

const { pkpAddress, generatedPublicKey } = await generatePrivateKey({
    pkpSessionSigs,
    network: NETWORK_EVM,
    litNodeClient,
});
```

</TabItem>

<TabItem value="sol">

```ts
import {
  generatePrivateKey,
  NETWORK_SOLANA,
} from "@lit-protocol/wrapped-keys";

const { pkpAddress, generatedPublicKey } = await generatePrivateKey({
    pkpSessionSigs,
    network: NETWORK_SOLANA,
    litNodeClient,
});
```

</TabItem>
</Tabs>

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/generateWrappedKey.ts).

After executing the example implementation above, you will have a `generatedPublicKey` returned from the `generatePrivateKey` function. This will be the public key associated with the generated Wrapped Key.

With you new Wrapped Key, you can explore the additional guides in this section to sign messages and transactions:

- [Signing a Message](./sign-message.md)
- [Signing a Transaction](./sign-transaction.md)

