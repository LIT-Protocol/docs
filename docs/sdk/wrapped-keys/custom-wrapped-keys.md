import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Custom Wrapped Keys

This guide provides an overview of how custom Lit Actions can be used to provide functionality, such as signing, with Wrapped Keys. For an overview of what a Wrapped Key is and what can be done with it, please go [here](./overview.md).

Typically, you would want to implement a custom Lit Action to support signing with a Wrapped Key that has an underlying private key derived from an curve other than what's currently supported by the Wrapped Keys SDK.

However, you are able to provide arbitrary Lit Action code, so you can adapt Wrapped Keys to support your use case.

<!-- TODO Update URLs once Wrapped Keys PR is merged: https://github.com/LIT-Protocol/js-sdk/pull/513 -->
## Provided Wrapped Keys Lit Actions

Currently the Wrapped Keys SDK includes Lit Action to support the following:

### Wrapped Keys Derived from `K256` Algorithm

For Wrapped Keys derived from the `K256` algorithm (commonly known as `ecdsa`):

- Generating `K256` (commonly known as `ecdsa`) private keys within a Lit Action
  - Uses the [generateEncryptedEthereumPrivateKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/ethereum/src/generateEncryptedEthereumPrivateKey.js) Lit Action
- Signing arbitrary messages using Ethers.js' [signMessage](https://docs.ethers.org/v5/api/signer/#Signer-signMessage)
  - Uses the [signMessageWithEthereumEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/ethereum/src/signMessageWithEthereumEncryptedKey.js) Lit Action
- Signing Ethers.js transaction objects using [signTransaction](https://docs.ethers.org/v5/api/signer/#Signer-signTransaction)
  - Uses the [signTransactionWithEthereumEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/ethereum/src/signTransactionWithEthereumEncryptedKey.js) Lit Action

### Wrapped Keys Derived `ed25519` Algorithm

For Wrapped Keys derived from the `ed25519` algorithm (used for Solana private key):

- Generating `ed25519` private keys within a Lit Action using the [@solana/web3.js](https://github.com/solana-labs/solana-web3.js) SDK
  - Uses the [generateEncryptedSolanaPrivateKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/solana/src/generateEncryptedSolanaPrivateKey.js) Lit Action
- Signing arbitrary messages using the `@solana/web3.js` SDK
  - Uses the [signMessageWithSolanaEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/solana/src/signMessageWithSolanaEncryptedKey.js) Lit Action
- Signing Solana transaction objects using the `@solana/web3.js` SDK
  - uses the [signTransactionWithSolanaEncryptedKey](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/litActions/solana/src/signTransactionWithSolanaEncryptedKey.js) Lit Action

## Implementing a Custom Lit Action

Implementing your own Lit Action allows you to do something different than what the provided Wrapped Key Lit Actions do. For example, supporting new functionality such as signing with a private key derived from an alternative curve to `K256` or `ed25519`.

You can use the [Provided Wrapped Keys Lit Actions](#provided-wrapped-keys-lit-actions) as guides on how to implement your custom Lit Action. Below we will be covering common functionality for Wrapped Key Lit Actions.

### `accessControlConditions`

Access Control Conditions are provided to the Lit SDK when the underlying private key for the Wrapped Key is encrypted. If you [imported](./importing-key.md) or [generated](./generating-wrapped-key.md) a Wrapped Key, then the default Access Control Conditions used to encrypt the private key are:

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

If you manually encrypt your private key with custom Access Control Conditions, then you'll need to supply them yourself when calling your custom Lit Action.

### Using A Third-party SDK Within Your Lit Action

The [Ethers.js v5](https://docs.ethers.org/v5/) SDK is already made available within a Lit Action. For any other SDK, you'll need to bundle the code with your Lit Action. Lit Actions execute within a [Deno](https://deno.com/) environment, so any APIs that aren't supported by Deno will need to be accounted for via polyfills and/or shims.

As a reference implementation, the Wrapped Keys SDK uses [esbuild](https://esbuild.github.io/) to bundle the `@solana/web3.js` SDK with the Lit Action code, and provide the required shim. [This](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/esbuild.config.js) is the `esbuild.config.js` used and [this](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/buffer.shim.js) is the shim used to include [buffer](https://www.npmjs.com/package/buffer) within the bundled Lit Action code.

Then, as you can see in the [Solana Wrapped Keys Lit Actions](#wrapped-keys-derived-ed25519-algorithm), various `@solana/web3.js` exports are `import`ed into the Lit Action code as usual.

### Generating and Encrypting a Private Key

If you want to implementing generation and encryption of a private key using an alternative private key algorithm, then you should make use of the following Lit Actions SDK methods:

[runOnce](https://actions-docs.litprotocol.com/#runonce) allows you to specify code that should only be ran by a single Lit node instead of having all Lit nodes run the same code. This is useful for executing the code that generates and encrypts the private key.

In addition to generating the private key within `runOnce`, you'll use the [encrypt](https://actions-docs.litprotocol.com/#encrypt) method to encrypt the private key.

Running both the key generation and encryption code within `runOnce` results in only a single Lit node having access to the clear text private key, as only what you return from `runOnce` will be shared with the other Lit nodes.

To work with the Wrapped Keys SDK, your Lit Action should return the `ciphertext`, `dataToEncryptHash`, and the corresponding public key to the generated private key as a `JSON.stringify`ed object. This can be done using the [setResponse](https://actions-docs.litprotocol.com/#setresponse) method like so:

```ts
(async () => {
    const LIT_PREFIX = 'lit_';

    const result = await Lit.Actions.runOnce(
        { waitForResponse: true, name: 'encryptedPrivateKey' },
        async () => {
            // Your private key generation logic...

            const generatedPrivateKey = "your_private_key";
            const utf8Encode = new TextEncoder();
            const encodedPrivateKey = utf8Encode.encode(
                `${LIT_PREFIX}${generatedPrivateKey}` // For enhanced security, you should prepend all generated private keys with "lit_"
            );

            const { ciphertext, dataToEncryptHash } = await Lit.Actions.encrypt({
                accessControlConditions, // This should be passed into the Lit Action
                to_encrypt: encodedPrivateKey,
            });
            return JSON.stringify({
                ciphertext,
                dataToEncryptHash,
                // The following is pseudo code, but you need to return
                // the public key for the generated private key as a string.
                publicKey: generatedPrivateKey.publicKey.toString(),
            });
        }
    );

    // Any other code you'd like to run...

    Lit.Actions.setResponse({
        response: result,
    });
})
```

#### Storing the Encryption Metadata

After generating and encrypting the private key, the resulting encryption metadata (`ciphertext`, `dataToEncryptHash`, and the `publicKey`) should be stored in Lit's private instance of DynamoDB using the [storeEncryptedKeyMetadata](./storing-wrapped-key-metadata.md) method included in the Wrapped Keys SDK.

### Decrypting a Wrapped Key

Decrypting a Wrapped Key, typically to be used for signing, can be done using the Lit Action SDK's[decryptToSingleNode](https://actions-docs.litprotocol.com/#decrypttosinglenode) method.

In order to call `decryptToSingleNode`, you will need to provide the following arguments:

##### `accessControlConditions`

This value is the Access Control Conditions provided to the Lit SDK when the underlying private key for the Wrapped Key was encrypted. If you [imported](./importing-key.md) or [generated](./generating-wrapped-key.md) a Wrapped Key, then the default Access Control Conditions used to encrypt the private key are:

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

If you manually encrypted your private key with custom Access Control Conditions, then you'll need to supply them yourself when calling your custom Lit Action.

##### `ciphertext`

This is the encrypted form of the underlying private key for the Wrapped Key (encrypted using the Lit network's BLS public key). This value is returned by the encryption functions from the Lit SDK e.g. [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html).

##### `dataToEncryptHash`

This is the `SHA-256` hash of the underlying private key for the Wrapped Key that was encrypted using the Lit network's BLS public key. This value is returned by the encryption functions from the Lit SDK e.g. [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html).

##### `authSig`

This value should be hardcoded as `null`.

##### `chain`

This value should be hardcoded as `ethereum`.

#### Fetching a Wrapped Key's Metadata

If you stored the encryption metadata in Lit's private instance of DynamoDB using the [storeEncryptedKeyMetadata](./storing-wrapped-key-metadata.md) method, then you can retrieve the metadata using the [getEncryptedKeyMetadata](./getting-wrapped-key-metadata.md) method included in the Wrapped Keys SDK.

#### Example Implementation

Once you have the required arguments, you can call `decryptToSingleNode` like so:

```ts
(async () => {
    const LIT_PREFIX = 'lit_';

    let decryptedPrivateKey;
    try {
        decryptedPrivateKey = await Lit.Actions.decryptToSingleNode({
        accessControlConditions,
        chain: 'ethereum',
        ciphertext,
        dataToEncryptHash,
        authSig: null,
        });
    } catch (error) {
        Lit.Actions.setResponse({
            response: `Error: When decrypting data to private key: ${error.message}`,
        });
        return;
    }

    if (!decryptedPrivateKey) {
        // Exit the nodes which don't have the decryptedData
        return;
    }

    // Here we're checking if LIT_PREFIX was prepended to the private key,
    // and removing it if it exists before using the key.
    const privateKey = decryptedPrivateKey.startsWith(LIT_PREFIX)
        ? decryptedPrivateKey.slice(LIT_PREFIX.length)
        : decryptedPrivateKey;

    // The rest of your Lit Action code...
})
```

After decrypting the private key, you'll have access to it's clear text form to be used for signing message, transaction, or for any other use case.

## Executing Your Custom Lit Action

After implementing your custom Lit Action, you'll want to make use of Lit SDK's [executeJs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#executeJs) method to execute the Lit Action with any required arguments.

As a reference implementation, you can take a look at the following methods used by the Wrapped Keys SDK to call the [Provided Wrapped Keys Lit Actions](#provided-wrapped-keys-lit-actions):

- [generateKeyWithLitAction](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/lit-actions-client/generate-key.ts)
- [signMessageWithLitAction](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/lit-actions-client/sign-message.ts)
- [signTransactionWithLitAction](https://github.com/LIT-Protocol/js-sdk/blob/master/packages/wrapped-keys/src/lib/lit-actions-client/sign-transaction.ts)

To call `executeJs`, you'll need to pass the following arguments:

##### `sessionSigs`

If your Wrapped Key was encrypted using the default Access Control Conditions, this would be the case if your private key was [imported](./importing-key.md) or [generated](./generating-wrapped-key.md), then these Session Signatures will need to be generated by the same PKP used when import or generating the Wrapped Keys. This is because the Wrapped Key was encrypted with Access Control Conditions to only authorize decryption if the provided `sessionSigs` were generated by the PKP that created the Wrapped Key.

If you implemented your own private key encryption logic, then `sessionSigs` may not be relevant for decryption, but are still required to authenticate and authorize yourself with the Lit network to allow for usage of the network.

##### `ipfsId`

The Wrapped Keys SDK methods make use of this property so that the Lit Action code doesn't have to be bundled into the `@lit-protocol/wrapped-keys` package. Additionally, because the Solana Wrapped Key Lit Actions code includes the `@solana/web3.js` SDK, the resulting code is too large to pass as a string when calling `executeJs`.

If you're bundling a third-party SDK with your Lit Action code, or just prefer this method, you should upload your code to [IPFS](https://www.ipfs.com/) and provide the generated Content Identifier (CID) as the value for this property.

:::note
[IPFS Pinata](https://www.pinata.cloud/) is an easy to use service to upload and pin files to IPFS.
:::

##### `code`

Alternatively, instead of using `ipfsId`, if your Lit Action code is simple enough, you can directly provide your Lit Action code as a `string` using this property.

##### `jsParams`

This is an object containing any parameters required by your Lit Action. The key for each property in this object will be the name of the variable within your Lit Action code.

## Summary

This overview covers the basis of implementing custom Lit Actions to be used with Wrapped Keys. If you have any questions, or need help implementing custom Lit Actions for your Wrapped Keys use case, feel free to reach out to us on our [Discord](https://litgateway.com/discord) or [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.
