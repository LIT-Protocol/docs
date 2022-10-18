---
sidebar_position: 3
---

# Decrypting

API docs with detailed info on functions are here: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/

Make sure we have `accessControlConditions`, `encryptedSymmetricKey`, and the `encryptedString` variables we created when encrypting content.
An exception is when using `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There are 2 steps:

1. Obtain the decrypted symmetric key from Lit Protocol using the `authSig`, `accessControlConditions`, `encryptedSymmetricKey`, and `chain`.
2. Decrypt the content using the `symmetricKey` and `encryptedString`.

## AuthSig

First, obtain an authSig from the user. This will ask their metamask to sign a message proving they own their crypto address. The chain used here is ethereum.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

## Decryption

### **Obtaining the Decrypted Symmetric Key**

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

### **Obtaining the Decrypted Data**

Now, decrypt the content. In the example, we used `encryptString()` so we will use `decryptString()` to decrypt. Note that if you used something else to encrypt the content, you will need to use the appropriate decrypt method.

```js
const decryptedString = await LitJsSdk.decryptString(
  encryptedString,
  symmetricKey
);
```

## Putting it all together

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
