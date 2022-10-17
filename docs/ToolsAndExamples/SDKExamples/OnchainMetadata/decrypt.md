---
sidebar_position: 4
---

# Decrypt Input

Make sure we have `accessControlConditions`, `encryptedSymmetricKey` & `encryptedString` variables we created when encrypting content. An exception is `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There are 2 steps for decrypting a string:

* Obtain the decrypted `symmetricKey` from Lit SDK using `authSig`, `accessControlConditions`, `encryptedSymmetricKey` & `chain`.
* Decrypt the content using the `symmetricKey` & `encryptedString`.

1. Just as before, let's connect to the Lit nodes if not already connected & get the `authSig` which will be used to decrypt the encrypted string:
```
  async decryptText(encryptedString, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
```

2. As described before, we have to get the `symmetricKey` using the `getEncryptionKey` function. More info in the API docs: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#litnodeclient
```
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });
```

3. Finally, we can get the decrypted string. For more info see the API docs: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#decryptstring.
```
    return await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
```

## Putting it all together

```
  async decryptText(encryptedString, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });

    return await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
  }
```

## Where to store encryptedString & encryptedSymmetricKey?

We're going to store these as on-chain NFT metadata. Let's see how next.