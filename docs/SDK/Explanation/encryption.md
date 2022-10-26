---
sidebar_position: 2
---

# Encryption

You can use Lit to encrypt and store any static content. This could be a file, a string, or anything that won't change. You have to store the content and metadata yourself (on IPFS, Arweave, or even somewhere centralized), but Lit will store who is allowed to decrypt it and enforce this (aka key management).

The below Replit is a full-fledged **React** application that encrypts & decrypt a **file** using Lit SDK. For best experience please open the web app in a new tab.

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@lit/Encrypt-and-Decrypt-a-File/#encrypt_and_decrypt_file/src/App.js"></iframe>

This example will show you how to encrypt and decrypt static data using Lit Protocol's JS SDK on the client side.

## Setup

At the top of your file, instantiate your Lit Node client like so:

```js
const client = new LitJsSdk.LitNodeClient();
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


## Encrypting

API docs with detailed info on functions are here: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/

### Access Control

In this example, we will set the accessControlConditions on if a wallet has at least 0.000001 ETH:

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

### AuthSig

First, obtain an authSig. This will ask metamask to sign a message proving the holder owns the crypto address.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

### Encrypting Content

- If you are encrypting a string, use `encryptString()`. You could also use `zipAndEncryptString()` if you wanted to zip the string before encrypting it (saves space, but takes time to zip)
- If you are encrypting a large file (more than 20mb) then you should use `encryptFile()` because it is fast (a 1gb file only takes 2 seconds to encrypt).
- If you are encrypting a small file (less than 20mb) then you can use `encryptFileAndZipWithMetadata()` which will zip the file, and include all metadata in the zip, so you don't have to store anything else. If you want to store the metadata yourself, manually, you can use `zipAndEncryptFiles()` instead.

In the example, we are using `encryptString()`. All encryption methods will output the encrypted data and a symmetric key, which can be used to decrypt the data.

```js
const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
  "this is a secret message"
);
```

**Note**: `encryptedString` will be a Blob and `symmetricKey` will be a Uint8Array.

### Saving the Encrypted Content to the Lit Nodes

Now, we can save the encryption key with the access control condition, which tells Lit Protocol that users that meet this access control condition should be able to decrypt.

```js
const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
  accessControlConditions,
  symmetricKey,
  authSig,
  chain,
});
```

**Note**: `encryptedSymmetricKey` will be a Uint8Array.

We now need to save the `accessControlConditions`, `encryptedSymmetricKey`, and the `encryptedString`. `accessControlConditions` and `encryptedSymmetricKey` are needed to obtain the decrypted symmetric key, which we can then use to decrypt the `encryptedString`.

### Putting it all together

The encryption function should look like:

```js
async encrypt(message: string) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(message)

    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    })

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    }
  }
```

## Decrypting

Make sure we have `accessControlConditions`, `encryptedSymmetricKey`, and the `encryptedString` variables we created when encrypting content.
An exception is when using `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There are 2 steps:

1. Obtain the decrypted symmetric key from Lit Protocol using the `authSig`, `accessControlConditions`, `encryptedSymmetricKey`, and `chain`.
2. Decrypt the content using the `symmetricKey` and `encryptedString`.

### AuthSig

First, obtain an authSig from the user. This will ask their metamask to sign a message proving they own their crypto address. The chain used here is ethereum.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

### Obtaining the Decrypted Symmetric Key

In order to obtain the decrypted symmetric key we need to pass in `authSig`, `accessControlConditions`, `encryptedSymmetricKey`, and `chain`.

```js
const symmetricKey = await window.litNodeClient.getEncryptionKey({
  accessControlConditions,
  toDecrypt: encryptedSymmetricKey,
  chain,
  authSig,
});
```

**Note**: `symmetricKey` will be a Uint8Array.

### Obtaining the Decrypted Data

Now, decrypt the content. In the example, we used `encryptString()` so we will use `decryptString()` to decrypt. Note that if you used something else to encrypt the content, you will need to use the appropriate decrypt method.

```js
const decryptedString = await LitJsSdk.decryptString(
  encryptedString,
  symmetricKey
);
```

### Putting it all together

The full decryption process should look like:

```js
  async decrypt(encryptedString: string, encryptedSymmetricKey: string) {
    if (!this.litNodeClient) {
      await this.connect()
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig
    })

    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    );

  return { decryptedString }
  }
```
