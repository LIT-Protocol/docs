---
sidebar_position: 2
---

# Encryption & Upload to IPFS

If you always find yourself encrypting static content & then manually storing it on IPFS, we are happy to announce that our new functionality will substantially simplify your life.

## Current process

Let's first take a look at how we currently encrypt data & store the metadata required for decrypting.

![currentEncryptionAndStoring](/img/currentEncryptionAndStoring.png)

As in the above image, encrypting & storing static content using Lit requires multiple steps:

### Encryption

1. Encrypt the static content (string, file, etc.) to get the `encryptedString`, for example.
2. Use `litNodeClient.saveEncryptionKey` to tie the `accessControlConditions` with the `symmetricKey` we got above. This returns us the `encryptedSymmetricKey`.
3. But the `encryptedSymmetricKey` is a Uint8Array, so we convert it into a base16 string which is required for decryption.
4. Finally, we have to store the `encryptedString` & other metadata: `encryptedSymmetricKey`, `accessControlConditions` (or other conditions eg: `evmContractConditions`) and `chain`. IPFS is generally used to store these values.

### Decryption

1. Retreived the stored metadata required for decrypting from IPFS: `encryptedString`, `encryptedSymmetricKey`, `accessControlConditions` (or other conditions eg: `evmContractConditions`) and `chain`.
2. Get the `symmetricKey` from the `encryptedSymmetricKey` using the `litNodeClient.getEncryptionKey` function. Note we have to pass the `chain`, `accessControlConditions` & other conditions in this function.
3. Finally, decrypt the `encryptedString` stored on IPFS using the `decryptString` function.

## New process

Now, let's take a look at the simplified encryption-decryption & IPFS storing functionality.

![newEncryptionAndStoring](/img/newEncryptionAndStoring.png)

:::note

The `encryptAndUploadMetadataToIpfs` function internally uses the ipfs-http-client which requires the Infura Project Id & API Secret Key.

:::

### Encryption

1. For encrypting the static content (string, file) simply pass it to our function `encryptAndUploadMetadataToIpfs` along with the other params: `accessControlConditions`, `chain`, `infuraId`, `infuraSecretKey` & the instance of the connected `LitNodeClient`. Note we're using the Infura client to add the strings/files to IPFS hence you have to provide your credentials.

That's all! All the steps will be taken care of for you & the `ipfsCid` for your encrypted metadata will be returned to you.

### Decryption

1. For decrypting the encrypted content (string, file) simply pass the returned `ipfsCid` to our function `decryptWithIpfs` & the instance of the connected `LitNodeClient`.

That's all! You will get the decrypted string or the file as an ArrayBuffer.

## Putting it all together

```js
async encrypt() {
    const ipfsCid = await LitJsSdk.encryptAndUploadMetadataToIpfs({
      authSig,
      accessControlConditions,
      chain,
      string: "Encrypt & store on IPFS seamlessly with Lit 😎",
    //   file, // If you want to encrypt a file instead of a string
      litNodeClient: this.litNodeClient,
      infuraId: 'YOUR INFURA PROJECT ID',
      infuraSecretKey: 'YOUR INFURA API-SECRET-KEY',
    });
}

async decrypt(ipfsCid) {
    const decryptedString = await LitJsSdk.decryptWithIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: this.litNodeClient,
    });
}
```

### How to encrypt & decrypt a file instead?

For encryption just use the same function params as above, only instead of the string param pass a file. For decryption nothing changes. The returned value in that case will be a Uint8Array instead of a string since it's a decrypted file.