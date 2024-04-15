# Encryption

The Lit network uses an identity (ID) based encryption scheme to encrypt data, which means that decryption is only permitted to those who satisfy a certain identity.

:::info
Habanero Mainnet and Manzano Testnet are now live. Check out the [docs on migration](../../network/migration-guide) to learn how you can start building on Habanero and Manzano today. 
:::

### How Does ID Encrypt Work

The [BLS](../../resources/glossary.md#boneh-lynn-shacham-bls-signatures) network signature is used as the decryption key for a particular set of access control conditions and private data, and the BLS network will only produce signature shares to the client if the user can prove that they satisfy the corresponding access control conditions.

This scheme is highly efficient, as encrypting private data is entirely a client-side operation, and only 1 round of network interactivity with the nodes is required upon decryption (in order to request signature shares to assemble into a decryption key).

The identity-based encryption scheme necessitates the construction of an identity parameter, and it is this parameter that the BLS network is producing signature shares over. In order to prevent the same network signature (decryption key) to be used for multiple distinct ciphertexts, we choose this identity parameter to be a combination of the hash of the access control conditions and the hash of the private data itself.

## High-Level Overview

Here is a high-level, step-by-step breakdown of encryption and decryption:

### Encryption

1. Alice chooses an access control condition, some private data and then constructs the identity parameter
2. Alice encrypts the private data using the BLS network public key and the identity parameter to get a ciphertext
3. Alice stores the encryption metadata - set of access control conditions, hash of the private data etc. - and the ciphertext wherever she wants

### Decryption

1. Bob fetches the ciphertext and corresponding encryption metadata from the public data store
2. Bob presents the encryption metadata to the BLS network and requests for signature shares over the identity parameter
3. The BLS network nodes checks whether the user satisfies the access control conditions before signing the constructed identity parameter
4. Bob assembles the signature shares into a decryption key and successfully decrypts the ciphertext

## Technical Walkthrough

You can use Lit to encrypt and store any static content. Examples of static content are files or strings. You need to store the ciphertext and metadata yourself (on IPFS, Arweave, or even a centralized storage solution), and the Lit network will enforce who is allowed to decrypt it.

Check out [this example](https://github.com/LIT-Protocol/js-sdk/tree/feat/SDK-V3/apps/demo-encrypt-decrypt-react) for a full-fledged **React** application that encrypts and decrypts a **string** using the Lit JS SDK V3.

Keep reading to see a step-by-step process of how to encrypt and decrypt static data client side.

### Setup

At the top of your file, create your Lit Node client like so:

```js
const client = new LitJsSdk.LitNodeClient({
  litNetwork: "cayenne",
});
const chain = "ethereum";
```

Create a Lit class and set the litNodeClient.

```js
class Lit {
  private litNodeClient

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }
}

export default new Lit()
```

### Encrypting

Get more info on functions in the [API docs](https://js-sdk.litprotocol.com/index.html).

Encrypting data requires the following steps:

1. Obtain an [`authSig`](../../resources/glossary.md#auth-sig).
2. Create access control conditions.
3. Encrypt the static content (string, file, zip, etc...) using `LitJsSdk.encryptString` to get the `ciphertext` and `dataToEncryptHash`.
4. Finally, store the `ciphertext`, `dataToEncryptHash` and other metadata: `accessControlConditions` (or other conditions eg: `evmContractConditions`) and `chain`.

#### Obtaining an AuthSig

The following code will prompt the user to sign a message, proving they own the corresponding crypto address. The chain we are using in this example is `ethereum`, you can check out additional supported chains [here](../../resources/supported-chains.md).

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

#### Create Access Control Conditions

In this example, our access control conditions will check if a wallet (`:userAddress`) has at least `0.000001 ETH` on `ethereum` at the `latest` block:

```js
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];
```

#### Encrypting Content

To encrypt a string, use one of the following functions:

- [`encryptString()`](https://v3.api-docs.getlit.dev/functions/encryption_src.encryptString.html) - Used to encrypt the raw string.
- [`zipAndEncryptString()`](https://v3.api-docs.getlit.dev/functions/encryption_src.zipAndEncryptString.html) - Compresses the string (using [JSZip](https://www.npmjs.com/package/jszip)) before encrypting it.
  -  Useful for saving space, but takes additional time to perform the zip.

To encrypt a file, use:

- [`encryptFile()`](https://v3.api-docs.getlit.dev/functions/encryption_src.encryptFile.html) - Used to encrypt a file without doing any zipping or packing.
  - Because zipping larger files takes time, this function is useful when encrypting large files ( > 20mb).
  - Requires you to store the file metadata.
- [`encryptFileAndZipWithMetadata()`](https://v3.api-docs.getlit.dev/functions/encryption_src.encryptFileAndZipWithMetadata.html) - Used to encrypt a file and then zip it up with the metadata (using [JSZip](https://www.npmjs.com/package/jszip)).
  - Useful when you don't want to store the file metadata separately.
- [`zipAndEncryptFiles()`](https://v3.api-docs.getlit.dev/functions/encryption_src.zipAndEncryptFiles.html) - Used to zip and encrypt multiple files.
  - Does **not** include the file metadatas in the zip, so you must store those yourself.

In this example, we are using `encryptString()`:

**Note**: All encryption functions will output the `ciphertext` and a hash of the plaintext data (`dataToEncryptHash`) as base64 encoded strings, both of which are used during decryption.

```js
const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
  {
    accessControlConditions,
    authSig,
    chain: "ethereum",
    dataToEncrypt: "this is a secret message",
  },
  litNodeClient
);
```

#### Putting it all together

The full code, including an encryption function, should look like:

```ts
const client = new LitJsSdk.LitNodeClient({
  litNetwork: "cayenne",
});
const chain = "ethereum";

class Lit {
  private litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encrypt(message: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        authSig,
        chain: "ethereum",
        dataToEncrypt: "this is a secret message",
      },
      litNodeClient
    );

    return {
      ciphertext,
      dataToEncryptHash,
    };
  }
}

export default new Lit();
```

### Decrypting

Make sure we have `accessControlConditions`, `ciphertext`, and the `dataToEncryptHash` data we created during the encryption step.
An exception is when using `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There is just one step:

1. Obtain the decrypted data in plaintext using the `authSig`, `accessControlConditions`, `ciphertext`, and `dataToEncryptHash` by calling `LitJsSdk.decryptToString`.

#### AuthSig

Obtain an authSig from the user. This will ask their MetaMask to sign a message proving they own their crypto address. The chain we are using in this example is `ethereum`.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

#### Obtaining the Decrypted Data

In the example, we used `encryptString()` to encrypt so we will use `decryptToString()` to decrypt. Pass in the data `accessControlConditions`, `ciphertext`, `dataToEncryptHash`, `authSig`.

:::note
If you want to use another LitJsSDK encryption method to encrypt content, you will need to use the appropriate decrypt method.
:::

```js
const decryptedString = await LitJsSdk.decryptToString(
  {
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig,
    chain: "ethereum",
  },
  litNodeClient
);
```

#### Putting it all together

The full decryption process should look like:

```js
async decrypt(ciphertext: string, dataToEncryptHash: string, accessControlConditions: any) {
  if (!this.litNodeClient) {
    await this.connect()
  }

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'ethereum' })
  const decryptedString = LitJsSdk.decryptToString(
    {
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig,
      chain: 'ethereum',
    },
    litNodeClient,
  );
  return { decryptedString }
}
```

Check out [this example](https://github.com/LIT-Protocol/js-sdk/tree/feat/SDK-V3/apps/demo-encrypt-decrypt-react) for a full-fledged **React** application that encrypts and decrypts a **string** using the Lit JS SDK V3.
