# Encryption

The Lit network uses an identity (ID) based encryption scheme to encrypt data, which means that decryption is only permitted to those who satisfy a certain identity.

:::note
The Lit Habanero Mainnet Beta is now live. Check out the [docs on migration](../../network/migration-guide) to learn how you can start building on Habanero today. 
:::

### How Does ID Encrypt Work

This is made possible because the BLS network signature is the decryption key for a particular set of access control conditions and private data, and the BLS network will only produce signature shares to the client if the user can prove that they satisfy the corresponding access control conditions.

This scheme is highly efficient, as encrypting private data is a entirely a client-side operation, and only 1 round of network interactivity with the nodes is required upon decryption (in order to request signature shares to assemble into a decryption key).

The identity-based encryption scheme necessitates the construction of an identity parameter, and it is this parameter that the BLS network is producing signature shares over. In order to prevent the same network signature (decryption key) to be used for multiple distinct ciphertexts, we choose this identity parameter to be a combination of the hash of the access control conditions and the hash of the private data itself.

## High-Level Overview

Here is a high-level, step-by-step breakdown of encryption and decryption:

### Encryption

1. Alice chooses some access control condition and private data and constructs the identity parameter
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

Steps to Encrypt

1. Obtain an `authSig` and create an access control condition.
2. Encrypt the static content (string, file, zip, etc...) using `LitJsSdk.encryptString` to get the `ciphertext` and `dataToEncryptHash`.
3. Finally, store the `ciphertext`, `dataToEncryptHash` and other metadata: `accessControlConditions` (or other conditions eg: `evmContractConditions`) and `chain`.

#### Setting Access Control Conditions

In this example, our access control condition will check if a wallet has at least 0.000001 ETH:

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

#### Passing an AuthSig

First, obtain an authSig. This will ask MetaMask to sign a message proving the holder owns the crypto address. The chain we are using in this example is `ethereum`, you can check out additional supported chains [here](../../resources/supported-chains.md).

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

#### Encrypting Content

- If you are encrypting a string, use `encryptString()`. You could also use `zipAndEncryptString()` if you wanted to zip the string before encrypting it (saves space, but takes time to zip)
- If you are encrypting a large file (more than 20mb) then you should use `encryptFile()` because it is fast (a 1gb file only takes 2 seconds to encrypt).
- If you are encrypting a small file (less than 20mb) then you can use `encryptFileAndZipWithMetadata()` which will zip the file, and include all metadata in the zip, so you don't have to store anything else. If you want to store the metadata yourself, manually, you can use `zipAndEncryptFiles()` instead.

In the example, we are using `encryptString()`. All encryption methods will output the ciphertext and a hash of the plaintext data, which are used during decryption.

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

**Note**: Both `ciphertext` and `dataToEncryptHash` will be base64 encoded strings.

#### Putting it all together

The encryption function should look like:

```js
async encrypt(message: string) {
  if (!this.litNodeClient) {
    await this.connect()
  }

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions,
      authSig,
      chain: 'ethereum',
      dataToEncrypt: 'this is a secret message',
    },
    litNodeClient,
  );

  return {
    ciphertext,
    dataToEncryptHash,
  };
}
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
