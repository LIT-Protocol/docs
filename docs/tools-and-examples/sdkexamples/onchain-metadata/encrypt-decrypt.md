---
sidebar_position: 3
---

# Encrypt & Decrypt

## Encrypt the Input

Given an input string, we want to encrypt it using the Lit SDK so that only the users authorized by our `accessControlCondition` should be able to decrypt it.

Let's continue developing our Lit class.

### 1. Define access control conditions
First, we need to define the `accessControlCondition` for a user to decrypt our encrypted string:
```js
// Checks if the user has at least 0.1 MATIC
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "100000000000000000", // 0.1 MATIC
    },
  },
];
```

### 2. Define an encryption function
Define a function `encryptText` which encrypts the `text` argument
```js
  async encryptText(text) {
    if (!this.litNodeClient) {
      await this.connect(); // Connect to Lit Network if not already
    }
```

### 3. Obtain an authsig
Sign using our wallet before encrypting. This will show a MetaMask pop-up which the user signs. For more info, please check out our [API docs](https://js-sdk.litprotocol.com/functions/auth_browser_src.checkAndSignAuthMessage.html).
```js
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
```

### 4. Encrypt the string
Finally, let's encrypt our string. This will return a promise containing the `ciphertext` and `dataToEncryptHash`, each as a base64-encoded **string**.

For more info, please check out our [API docs](https://js-sdk.litprotocol.com/functions/encryption_src.encryptString.html).
```js
    const { ciphertext, dataToEncryptHash } = awaitLitJsSdk.encryptString(
      {
        accessControlConditions,
        authSig,
        chain,
        dataToEncrypt: text,
      },
      this.litNodeClient,
    );

    return {
      ciphertext,
      dataToEncryptHash,
    };
```

We now need to save `accessControlConditions`, `ciphertext` & `dataToEncryptHash`. All of these values are needed to obtain the decrypted plaintext.

### Full encryption code

```js
  async encryptText(text) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        authSig,
        chain,
        dataToEncrypt: text,
      },
      this.litNodeClient,
    );
    return {
      ciphertext,
      dataToEncryptHash,
    };
  }
```

## Decrypt the Input
Make sure we have `accessControlConditions`, `ciphertext`, and the `dataToEncryptHash` variables we created when encrypting content. An exception is `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There is just one step:

1. Obtain the decrypted data in plaintext using the `authSig`, `accessControlConditions`, `ciphertext`, and `dataToEncryptHash` by calling `LitJsSdk.decryptToString`.

### 1. Connect to Lit nodes and obtain an auth signature
Just as before, let's connect to the Lit nodes if not already connected & get the `authSig` which will be used to decrypt the encrypted string:
```js
  async decryptText(ciphertext, dataToEncryptHash, accessControlConditions) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
  }
```

### 2. Decrypt String

Finally, we can get the decrypted string. For more info see the [API docs](https://js-sdk.litprotocol.com/functions/encryption_src.decryptString.html).
```js
    return LitJsSdk.decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain,
      },
      this.litNodeClient,
    );
```

### Full decryption code

```js
  async decryptText(ciphertext, dataToEncryptHash, accessControlConditions) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    return LitJsSdk.decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain,
      },
      this.litNodeClient,
    );
  }
```

## Where to store encryptedString & encryptedSymmetricKey?

We're going to store these as on-chain NFT metadata. Let's see how next.
