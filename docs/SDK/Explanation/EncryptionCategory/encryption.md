---
sidebar_position: 2
---

# Encrypting

API docs with detailed info on functions are here: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/

## Access Control

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

## AuthSig

First, obtain an authSig. This will ask metamask to sign a message proving the holder owns the crypto address.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

## Encryption

### **Encrypting Content**

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

### **Saving the Encrypted Content to the Lit Nodes**

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

## Putting it all together

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
