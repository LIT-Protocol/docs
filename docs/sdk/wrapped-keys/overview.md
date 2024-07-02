import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Overview

Wrapped Keys are private keys that are either imported into the Lit network, or generated within the trusted execution environment (TEE) of a Lit node via a Lit Action.

The private keys are first encrypted using Lit network's BLS key, then the resulting encryption metadata (`ciphertext` and `dataToEncryptHash`) is stored by Lit, in a private instance of DynamoDB, for retrieval when you request a Lit node to sign with your Wrapped Key.

Using the Wrapped Keys SDK, you can request a Lit node to sign arbitrary messages and transactions, optionally sending signed transaction to a network. The Lit node will combine decryption shares of your Wrapped Key from other Lit nodes within it's TEE. This results in the complete unencrypted key used for signing only existing temporarily within the secure execution context of a Lit node's TEE.

Lastly, the exporting of imported or generated private keys from Lit's network is also supported.

## How it Works

Whether you import an existing private key, of generate a new one inside of the Wrapped Key Lit Action, the clear text private key are encrypted using the [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method. The Access Control Conditions are set to:

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

where `pkpAddress` is the Ethereum address that's derived from your provided PKP's public key. This restricts the decryption of the Wrapped Key to only those whom can generate valid Authentication Signatures from the PKP which generated the Wrapped Key.

## The SDK

The Wrapped Keys SDK streamlines the process of interacting with this new primitive and is available to install from NPM:

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm i @lit-protocol/wrapped-keys
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/wrapped-keys
```

</TabItem>
</Tabs>

With the SDK, you have the following functions available to you:

- `generatePrivateKey` - Generates a random private key within a Lit Action and returns the public key.
- `importPrivateKey` - Import an existing private key into Lit's network.
- `exportPrivateKey` - Export a previously imported or generated private key from Lit's network.
- `signMessageWithEncryptedKey` - Use a Wrapped Key to sign an arbitrary message.
- `signTransactionWithEncryptedKey` - Use a Wrapped Key to sign a transaction, with the option to submit it to a chosen network.

Within this section of the docs, we have several guides covering the usage of the above SDK methods. Please refer to them to learn how to use these methods, but feel free to reach out to us on our [Discord](https://litgateway.com/discord) or [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.
