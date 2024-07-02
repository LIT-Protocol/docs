import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Signing a Transaction

This guide covers the `signTransactionWithEncryptedKey` function from the Wrapped Keys SDK. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Using the `signTransactionWithEncryptedKey` function, you can sign a transaction using a Wrapped Key. The Wrapped Keys SDK will look up the corresponding encryption metadata (`ciphertext` and `dataToEncryptHash`) for your PKP in Lit's private DynamoDB instance. If found, it well then use your provided PKP Session Signatures to authorize decryption of the private key, and will sign your provided message, returning the signed message. If the [broadcast](#broadcast) setting is enabled, then the signed transaction will also be broadcasted to the specified [chain](#chain).

Below we will walk through an implementation of `signTransactionWithEncryptedKey`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signTransactionWithWrappedKey.ts).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Programmable Key Pairs (PKPs)](../../sdk/wallets/quick-start)
- [Session Signatures](../../sdk/authentication/session-sigs/intro)

## `signTransactionWithEncryptedKey`'s Interface

<!-- TODO Update URL once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->
[Source code](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/api/sign-transaction-with-encrypted-key.ts)

<Tabs
defaultValue="evm"
values={[
{label: 'Signing a Transaction for EVM Based Networks', value: 'evm'},
{label: 'Signing a Transaction for Solana', value: 'solana'},
]}>
<TabItem value="evm">

```ts
/**
 * Signs a transaction inside the Lit Action using the previously persisted wrapped key associated with the current LIT PK.
 * This method fetches the encrypted key from the wrapped keys service, then executes a Lit Action that decrypts the key inside the LIT action and uses
 * the decrypted key to sign the provided transaction
 * Optionally, if you pass `broadcast: true`, the LIT action will also submit the signed transaction to the associated RPC endpoint on your behalf
 */
async function signTransactionWithEncryptedKey(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    network: 'evm';
    broadcast: boolean;
    unsignedTransaction: EthereumLitTransaction;
  }
): Promise<string>
```

`EthereumLitTransaction` has the following interface:

:::note
`chain` **must** be one of the [supported EVM networks](https://github.com/LIT-Protocol/js-sdk/blob/cc95304922d0e0b00300e0198de2455586b858a4/packages/constants/src/lib/constants/constants.ts#L29-L601).
:::

```ts
/**  EthereumLitTransaction must be provided to the `SignTransaction` endpoint when `network` is `evm`.
 *
 * @typedef EthereumLitTransaction
 *
 * @property { string } toAddress The address the transaction is 'to'
 * @property { string } value The value of the transaction to be sent
 * @property { number } chainId The chain ID of the target chain that the transaction will be executed on
 * @property { string } [gasPrice] The exact gas price that you are willing to pay to execute the transaction
 * @property { string } [gasLimit] The maximum gas price that you are willing to pay to execute the transaction
 * @property { string } [dataHex] Data in hex format to be included in the transaction
 *
 */
interface EthereumLitTransaction {
  chain: string;
  toAddress: string;
  value: string;
  chainId: number;
  gasPrice?: string;
  gasLimit?: number;
  dataHex?: string;
}
```

</TabItem>

<TabItem value="solana">

```ts
/**
 * Signs a transaction inside the Lit Action using the previously persisted wrapped key associated with the current LIT PK.
 * This method fetches the encrypted key from the wrapped keys service, then executes a Lit Action that decrypts the key inside the LIT action and uses
 * the decrypted key to sign the provided transaction
 * Optionally, if you pass `broadcast: true`, the LIT action will also submit the signed transaction to the associated RPC endpoint on your behalf
 */
async function signTransactionWithEncryptedKey(
  params: {
    pkpSessionSigs: SessionSigsMap;
    litNodeClient: ILitNodeClient;
    network: 'solana';
    broadcast: boolean;
    unsignedTransaction: SerializedTransaction;
  }
): Promise<string>
```

`SerializedTransaction` has the following interface:

:::note
`chain` **must** be one of the following:

- `mainnet-beta`
- `testnet`
- `devnet`
:::

```ts
interface SerializedTransaction {
  chain: string;
  serializedTransaction: string;
}
```

</TabItem>
</Tabs>

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

This parameter dictates what transaction signing Lit Action is used to sign `unsignedTransaction`. It must be one of the supported Wrapped Keys [Networks](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/types.ts#L9-L12) which currently consists of:

  - `evm` This will use the [signTransactionWithEthereumEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/ethereum/src/signTransactionWithEthereumEncryptedKey.js) Lit Action.
    - Use this network if your Wrapped Key is a private key derived from the ECDSA curve.
    - Uses Ethers.js' [signTransaction](https://docs.ethers.org/v5/api/signer/#Signer-signTransaction) function to sign `unsignedTransaction`.
  - `solana` This will use the [signTransactionWithSolanaEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/solana/src/signTransactionWithSolanaEncryptedKey.js) Lit Action.
    - Use this network if your Wrapped Key is a private key derived from the Ed25519 curve.
    - Uses the [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) package to create a signer using the decrypted Wrapped Key, and a [Transaction](https://solana-labs.github.io/solana-web3.js/classes/Transaction.html) instance to sign the serialized unsigned transaction.

#### `broadcast`

When this parameter is set to `true`, after signing the transaction, the Wrapped Key Lit Action will broadcast the signed transaction to a network.

Which network the transaction is broadcasted to is determined one of two ways:

1. If the `network` parameter is set to `evm`, then the `chain` property from the `EthereumLitTransaction` object will be used to lookup the corresponding RPC URL to use for broadcasting the signed transaction.
2. If the `network` parameter is set to `solana`, then the `chain` property from the `SerializedTransaction` object will be used to create a [Connection](https://solana-labs.github.io/solana-web3.js/classes/Connection.html) instance, connected to the specified network.

#### `unsignedTransaction`

This parameter is the unsigned transaction that the Wrapped Key will sign. Depending on the `network` parameter, this object will be one of two options:

<Tabs
defaultValue="evm"
values={[
{label: 'Network parameter is set to evm', value: 'evm'},
{label: 'Network parameter is set to solana', value: 'solana'},
]}>
<TabItem value="evm">

If the `network` parameter is set to `evm`, then `unsignedTransaction` will implement the `EthereumLitTransaction` interface:

```ts
/**  EthereumLitTransaction must be provided to the `SignTransaction` endpoint when `network` is `evm`.
 *
 * @typedef EthereumLitTransaction
 *
 * @property { string } toAddress The address the transaction is 'to'
 * @property { string } value The value of the transaction to be sent
 * @property { number } chainId The chain ID of the target chain that the transaction will be executed on
 * @property { string } [gasPrice] The exact gas price that you are willing to pay to execute the transaction
 * @property { string } [gasLimit] The maximum gas price that you are willing to pay to execute the transaction
 * @property { string } [dataHex] Data in hex format to be included in the transaction
 *
 */
interface EthereumLitTransaction {
  chain: string;
  toAddress: string;
  value: string;
  chainId: number;
  gasPrice?: string;
  gasLimit?: number;
  dataHex?: string;
}
```

#### Parameters

##### `chain`

:::note
`chain` **must** be one of the [supported EVM networks](https://github.com/LIT-Protocol/js-sdk/blob/cc95304922d0e0b00300e0198de2455586b858a4/packages/constants/src/lib/constants/constants.ts#L29-L601).
:::

This parameters determines what chain will be used to the following:

- Get the latest `nonce` for the address associated with the Wrapped Key.
- Get the current `gasPrice` for the `chain`.
- Get the estimated `gasLimit` for `unsignedTransaction` on the `chain`.
- When `broadcast` is set to `true`, it will be the `chain` that the signed transaction is broadcasted to.

##### `toAddress`

This parameter is the EVM based address used as the `to` property of the transaction, and will be the recipient of the transaction's `data` and `value`.


##### `value`

This parameter is the amount of the native token on the `chain` that will be transferred to `toAddress`. Within the Wrapped Keys Lit Action, `value` will be parsed using Ethers.js' [parseEther](https://docs.ethers.org/v5/api/utils/display-logic/#utils-parseEther), so this value should be given as the number of tokens expressed in full units, not in Wei (or whatever the smallest domination is for the `chain` the transaction is being signed for).

For example, `"1"` should be used to transfer a whole token, `".5"` for half a token, and `".01"` for a hundredth of a token.

##### `chainId`

This parameter is the [EIP-155](https://eips.ethereum.org/EIPS/eip-155) chain id that will be used in the transaction object that is signed by the Wrapped Key.

You can check [ChainList](https://chainlist.org/) for your `chain`'s `chainId`.

##### `gasPrice`

This parameter will set the `gasPrice` of the transaction in `wei`. If this parameter is omitted, the Wrapped Keys Lit Action will fetch the current `gasPrice` for `chain` for you.

##### `gasLimit`

This parameter will set the `gasLimit` for the transaction. If this parameter is omitted, the Wrapped Keys Lit Action will attempt to estimate the `gasLimit` on the specified `chain` for you. Gas estimation is done using Ethers.js' [estimateGas](https://docs.ethers.org/v5/api/providers/provider/#Provider-estimateGas) function.

There is the possibility that ethers fails to estimate the gas for your transaction, even when it's a valid transaction, and you will receive an error along the lines of `Error: When estimating gas-...`. In this case, you can try manually setting the `gasLimit` to circumvent ethers trying to estimate it.

##### `dataHex`

This parameter will set the `data` property for the transaction. Data should be UTF-8 bytes represented as a hexadecimal string. You can use ethers.js' [hexlify](https://docs.ethers.org/v5/api/utils/bytes/#utils-hexlify) and [toUtf8Bytes](https://docs.ethers.org/v5/api/utils/strings/#utils-toUtf8Bytes) (or similar) methods to convert a UTF-8 string.

For example:

```ts
import { ethers } from 'ethers';

const dataHex = ethers.utils.hexlify(
    ethers.utils.toUtf8Bytes('The answer to the Universe is 42.')
);
```

</TabItem>

<TabItem value="solana">

If the `network` parameter is set to `solana`, then the `unsignedTransaction` will implement the `SerializedTransaction` interface:

```ts
interface SerializedTransaction {
  chain: string;
  serializedTransaction: string;
}
```

#### Parameters

##### `chain`

This parameter will set the Solana network the transaction will be signed for and submitted to if `broadcast` is set to `true`. This parameter **needs** to be one of the following values:

- `mainnet-beta`
- `testnet`
- `devnet`

##### `serializedTransaction`

This parameter is the complete unsigned Solana transaction that has been serialized and is ready to be signed. Using the [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) SDK, the process of obtaining a serialized transaction might look like:

```ts
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';

const chain = 'devnet';
const fromPublicKey = new PublicKey(process.env.SOLANA_PUBLIC_KEY);
const toPublicKey = new PublicKey(process.env.SOLANA_TRANSACTION_RECIPIENT_PUBLIC_KEY);

const solanaTransaction = new Transaction();
    solanaTransaction.add(
    SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: LAMPORTS_PER_SOL / 100, // Transfer 0.01 SOL
    })
);
solanaTransaction.feePayer = fromPublicKey;

const solanaConnection = new Connection(clusterApiUrl(chain), 'confirmed');
const { blockhash } = await solanaConnection.getLatestBlockhash();
solanaTransaction.recentBlockhash = blockhash;

const serializedTransaction = solanaTransaction
    .serialize({
        requireAllSignatures: false, // should be false as the transaction is not yet being signed
        verifySignatures: false, // should be false as the transaction is not yet being signed
    })
    .toString('base64');

const unsignedTransaction: SerializedTransaction = {
    serializedTransaction,
    chain,
};
```
</TabItem>
</Tabs>

### Return Value

Depending on what `network` and `broadcast` is set to, what `signTransactionWithEncryptedKey` returns differs:

<Tabs
defaultValue="evm"
values={[
{label: 'Network parameter is set to evm', value: 'evm'},
{label: 'Network parameter is set to solana', value: 'solana'},
]}>
<TabItem value="evm">

If `network` is set to `evm` and `broadcast` is set to `false`, then the return value of `signTransactionWithEncryptedKey` will be `Promise<string>` where the `string` is the signed transaction.

If `broadcast` is set to `true`, then the signed transaction will be broadcasted to the `chain`, and the return value of `signTransactionWithEncryptedKey` will be `Promise<string>` where the `string` is the transaction hash.

</TabItem>

<TabItem value="solana">

If `network` is set to `solana`, then the return value of `signTransactionWithEncryptedKey` will be `Promise<string>` where the `string` is the signed transaction.

If `broadcast` is set to `true`, then the signed transaction will be submitted to `chain`, but `signTransactionWithEncryptedKey` will still return the signed transaction and **not** the transaction hash.

To get the transaction hash or receipt from the broadcasted signed transaction, you can do the following using the [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) SDK:

```ts
import {
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';

const chain = 'devnet';

const transactionSignature = await signTransactionWithEncryptedKey({
//   This parameter values are not included here for brevity,
//   but follow the other code examples in this guide.
//
//   pkpSessionSigs,
//   network: 'solana',
//   unsignedTransaction,
//   broadcast: true,
//   litNodeClient,
});

// Wait for confirmation and fetch the transaction details
const signatureBuffer = Buffer.from(transactionSignature, 'base64');
const solanaConnection = new Connection(clusterApiUrl(chain), 'confirmed');
const confirmation = await solanaConnection.confirmTransaction(signatureBuffer);
console.log('Transaction confirmation status:', confirmation.value);

const transactionReceipt = await solanaConnection.getTransaction(
    signatureBuffer.toString('base64'),
    { commitment: 'confirmed' },
);
```

</TabItem>
</Tabs>

## Example Implementation

Now that we know what the `signTransactionWithEncryptedKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signTransactionWithWrappedKey.ts).

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

### Signing a Transaction With A Wrapped Key

Now that we know what the `signTransactionWithEncryptedKey` function does, it's parameters, and it's return values, let's now dig into a complete implementation.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signTransactionWithWrappedKey.ts).

<Tabs
defaultValue="evm"
values={[
{label: 'Signing for an EVM Based Network', value: 'evm'},
{label: 'Signing for Solana', value: 'solana'},
]}>
<TabItem value="evm">

```ts
import { api } from "@lit-protocol/wrapped-keys";

const { signTransactionWithEncryptedKey } = api;

const transactionHash = await signTransactionWithEncryptedKey({
  pkpSessionSigs,
  network: 'evm',
  unsignedTransaction: {
    chain: "ethereum",
    toAddress: process.env.ETHEREUM_TRANSACTION_RECIPIENT
    value: "4.2" // This will be 4.2 ether
    chainId: 1,
    dataHex: ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes('The answer to the Universe is 42.')
    )
  },
  broadcast: true,
  litNodeClient,
});
```

</TabItem>

<TabItem value="solana">

```ts
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import { api } from "@lit-protocol/wrapped-keys";

const { signTransactionWithEncryptedKey } = api;
const chain = 'devnet';
const fromPublicKey = new PublicKey(process.env.SOLANA_PUBLIC_KEY);
const toPublicKey = new PublicKey(process.env.SOLANA_TRANSACTION_RECIPIENT_PUBLIC_KEY);

const solanaTransaction = new Transaction();
    solanaTransaction.add(
    SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: LAMPORTS_PER_SOL / 100, // Transfer 0.01 SOL
    })
);
solanaTransaction.feePayer = fromPublicKey;

const solanaConnection = new Connection(clusterApiUrl(chain), 'confirmed');
const { blockhash } = await solanaConnection.getLatestBlockhash();
solanaTransaction.recentBlockhash = blockhash;

const serializedTransaction = solanaTransaction
    .serialize({
        requireAllSignatures: false, // should be false as the transaction is not yet being signed
        verifySignatures: false, // should be false as the transaction is not yet being signed
    })
    .toString('base64');

const unsignedTransaction: SerializedTransaction = {
    serializedTransaction,
    chain,
};

const transactionSignature = await signTransactionWithEncryptedKey({
  pkpSessionSigs,
  network: 'solana',
  unsignedTransaction,
  broadcast: true,
  litNodeClient,
});

// Wait for confirmation and fetch the transaction details
const signatureBuffer = Buffer.from(transactionSignature, 'base64');
const confirmation = await solanaConnection.confirmTransaction(signatureBuffer);
console.log('Transaction confirmation status:', confirmation.value);

const transactionReceipt = await solanaConnection.getTransaction(
    signatureBuffer.toString('base64'),
    { commitment: 'confirmed' },
);
```

</TabItem>
</Tabs>

### Summary

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/wrapped-keys/wrapped-keys/nodejs/src/signTransactionWithWrappedKey.ts).

After executing the example implementation above, you will have a signed transaction using the Wrapped Key that's associated with PKP derived from the provided `pkpSessionSigs`. If `broadcast` was set to `true`, then the signed transaction was also broadcasted to the `chain`.
