---
sidebar_position: 3
---

# Encryption

You can use Lit to encrypt and store any static content. This could be a file, a string, or anything that won't change. You need to store the ciphertext and metadata yourself (on IPFS, Arweave, or even a centralized storage solution), and the Lit network will enforce who is allowed to decrypt it.

If you want to use IPFS as a storage solution, Lit has an `encryptToIpfs` function that will help streamline the process of encryption and storing the encrypted data. You will need to provide an Infura ID and API secret key. [Jump to encryptToIPFS](../explanation/encryption#encrypttoipfs).

Check out [this example](https://github.com/LIT-Protocol/js-sdk/blob/master/apps/demo-encrypt-decrypt-react/README.md) for a full-fledged **React** application that encrypts and decrypts a **string** using Lit SDK.

In the example below we will show you the step-by-step process of how to encrypt and decrypt static data using the Lit JS SDK on the client side.

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

Get more info on functions in the [API docs](https://js-sdk.litprotocol.com/index.html).

Steps to Encrypt
1. Obtain an `authSig` and create an access control condition.
2. Encrypt the static content (string, file, etc.) using `LitJsSdk.encryptString` to get the `ciphertext`, for example. This ties the `accessControlConditions` with the static content.
3. Finally, we have to store the `ciphertext`, `dataToEncryptHash` and other metadata: `accessControlConditions` (or other conditions eg: `evmContractConditions`) and `chain`. IPFS is generally used to store these values.

### Access Control & AuthSig

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

First, obtain an authSig. This will ask MetaMask to sign a message proving the holder owns the crypto address.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

### Encrypting Content

- If you are encrypting a string, use `encryptString()`. You could also use `zipAndEncryptString()` if you wanted to zip the string before encrypting it (saves space, but takes time to zip)
- If you are encrypting a large file (more than 20mb) then you should use `encryptFile()` because it is fast (a 1gb file only takes 2 seconds to encrypt).
- If you are encrypting a small file (less than 20mb) then you can use `encryptFileAndZipWithMetadata()` which will zip the file, and include all metadata in the zip, so you don't have to store anything else. If you want to store the metadata yourself, manually, you can use `zipAndEncryptFiles()` instead.

In the example, we are using `encryptString()`. All encryption methods will output the ciphertext and a hash of the plaintext data, which are used during decryption.

```js
const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
  {
    accessControlConditions,
    authSig,
    chain: 'ethereum',
    dataToEncrypt: 'this is a secret message',
  },
  litNodeClient,
);
```

**Note**: Both `ciphertext` and `dataToEncryptHash` will be base64 encoded strings.

### Putting it all together

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
    window.litNodeClient,
  );

  return {
    ciphertext,
    dataToEncryptHash,
  };
}
```

## Decrypting

Make sure we have `accessControlConditions`, `ciphertext`, and the `dataToEncryptHash` variables we created when encrypting content.
An exception is when using `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There is just one step:

1. Obtain the decrypted data in plaintext using the `authSig`, `accessControlConditions`, `ciphertext`, and `dataToEncryptHash` by calling `LitJsSdk.decryptToString`.

### AuthSig

First, obtain an authSig from the user. This will ask their MetaMask to sign a message proving they own their crypto address. The chain used here is ethereum.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
```

### Obtaining the Decrypted Data

In the example, we used `encryptString()` so we will use `decryptToString()` to decrypt. Note that if you used something else to encrypt the content, you will need to use the appropriate decrypt method.

```js
const decryptedString = await LitJsSdk.decryptToString(
  {
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig,
    chain: 'ethereum',
  },
  litNodeClient,
);
```

### Putting it all together

The full decryption process should look like:

```js
async decrypt(ciphertext: string, dataToEncryptHash: string, accessControlConditions: any) {
  if (!this.litNodeClient) {
    await this.connect()
  }

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
  const decryptedString = LitJsSdk.decryptToString(
    {
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig,
      chain: 'ethereum',
    },
    window.litNodeClient,
  );
  return { decryptedString }
}
```

# Encryption & Upload to IPFS

To simplify encrypting and uploading to IPFS, there is a method within the SDK to help encrypt and store data on IPFS.

## encryptToIPFS

Now, let's take a look at the simplified encryption-decryption & IPFS storing functionality.

:::note

The `encryptToIpfs` function internally uses the ipfs-http-client which requires the Infura Project Id & API Secret Key.

:::

### Encryption

1. For encrypting the static content (string, file) simply pass it to our function `encryptToIpfs` along with the other params: `accessControlConditions`, `chain`, `infuraId`, `infuraSecretKey` & the instance of the connected `LitNodeClient`. Note we're using the Infura client to add the strings/files to IPFS hence you have to provide your credentials.

That's all! All the steps will be taken care of for you & the `ipfsCid` for your encrypted metadata will be returned to you.

### Decryption

1. For decrypting the encrypted content (string, file) simply pass the returned `ipfsCid` to our function `decryptFromIpfs` & the instance of the connected `LitNodeClient`.

That's all! You will get the decrypted string or the file as an ArrayBuffer.

### Putting it all together

```js
async encrypt() {
    const ipfsCid = await LitJsSdk.encryptToIpfs({
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
    const decryptedString = await LitJsSdk.decryptFromIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: this.litNodeClient,
    });
}
```

### How to encrypt & decrypt a file instead?

For encryption use the same function params as above with the string param replaced with a file. For decryption nothing changes. The returned value in that case will be a `Uint8Array` instead of a string since it's a decrypted file.