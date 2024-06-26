import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Exporting a Wrapped Key

This guide covers the `exportPrivateKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `exportPrivateKey` function, you can export existing Wrapped Keys to decrypt and obtain their underlying private keys. The Wrapped Keys SDK will look up the corresponding encryption metadata (`ciphertext` and `dataToEncryptHash`) for your PKP in Lit's private DynamoDB instance. If found, it well then use your provided PKP Session Signatures to authorize decryption of the private key, and will return it to you in clear text.

Below we will walk through an implementation of `exportPrivateKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/exportWrappedKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `exportPrivateKey`'s Interface

<!-- TODO Update once Wrapped Keys PR is merged -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/b80cee7035639ef4739c6190812eecbf2d2dab2e/packages/wrapped-keys/src/lib/wrapped-keys.ts#L129-L190)

```ts
/**
 *
 * Exports the imported Solana/EVM private key. First the stored encrypted private key is fetched from the database. Then it's decrypted and returned to the user
 *
 * @param pkpSessionSigs - The PKP sessionSigs used to associated the PKP with the generated private key
 * @param privateKey - The private key imported into the database
 * @param litNodeClient - The Lit Node Client used for executing the Lit Action
 *
 * @returns { Promise<string> } - The bare private key which was imported without any prefix
 */
export async function exportPrivateKey({
  pkpSessionSigs,
  litNodeClient,
}: ExportPrivateKeyParams): Promise<string>
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

:::warning
The return value from successfully calling `exportPrivateKey` is the private key in **clear text**.

Be mindful when and where you're calling this method as to not expose the private key to anyone who should not have direct access to it.
:::

`exportPrivateKey` will return `Promise<string>` after it successfully retrieves and decrypts the private key. The `string` returned is the **clear text** private key for the Wrapped Key.

## Example Implementation

Now that we know what the `exportPrivateKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/exportWrappedKey.ts).

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

### Exporting a Wrapped Key

:::warning
The return value from successfully calling `exportPrivateKey` is the private key in **clear text**.

Be mindful when and where you're calling this method as to not expose the private key to anyone who should not have direct access to it.
:::

Now that we have all that we need, we can call `exportPrivateKey` to export the underlying private key for the Wrapped Key:

```ts
import { exportPrivateKey } from "@lit-protocol/wrapped-keys";

const privateKey = exportPrivateKey({
    pkpSessionSigs,
    litNodeClient,
});
```

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/exportWrappedKey.ts).

After executing the example implementation above, you will have exported the underlying private key for the Wrapped Key associated with the PKP that produced the provided `pkpSessionSigs`.
