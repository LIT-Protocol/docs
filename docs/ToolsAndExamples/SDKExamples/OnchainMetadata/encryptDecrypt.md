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
Sign using our wallet before encrypting. This will show a Metamask pop-up which the user signs. For more info, please check out our [API docs](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#checkandsignauthmessage).
```js
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
```

### 4. Encrypt the string
Finally, let's encrypt our string. This will return a promise containing the `encryptedString` as a **Blob** and the `symmetricKey` used to encrypt it, as a **Uint8Array**.

For more info, please check out our [API docs](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#encryptstring).
```js
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);
```

### 5. Save encryption key & access control condition
Now, we save the encryption key with the access control condition. Both are needed for Lit to know who should be able to decrypt.

For more info, please check out our [API docs](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#litnodeclient).
```js
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }
```

:::note `encryptedSymmetricKey` is a Uint8Array.
:::

We now need to save `accessControlConditions`, `encryptedSymmetricKey` & `encryptedString`. The `accessControlConditions` & `encryptedSymmetricKey` values are needed to obtain the decrypted symmetric key. The decrypted symmetric key is needed to decrypt the `encryptedString`.

### Full encryption code

```js
  async encryptText(text) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
        encryptedString,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
    };
  }
```

## Decrypt the Input
Make sure we have `accessControlConditions`, `encryptedSymmetricKey` & `encryptedString` variables we created when encrypting content. An exception is `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There are 2 steps for decrypting a string:

* Obtain the decrypted `symmetricKey` from Lit SDK using `authSig`, `accessControlConditions`, `encryptedSymmetricKey` & `chain`.
* Decrypt the content using the `symmetricKey` & `encryptedString`.

### 1. Connect to Lit nodes and obtain an auth signature
Just as before, let's connect to the Lit nodes if not already connected & get the `authSig` which will be used to decrypt the encrypted string:
```js
  async decryptText(encryptedString, encryptedSymmetricKey) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
```

### 2. Obtain the symmetric key
As described before, we have to get the `symmetricKey` using the `getEncryptionKey` function. More info in the [API docs](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#litnodeclient).
```js
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
        accessControlConditions: accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig
    });
```

### 3. Decrypt String
Finally, we can get the decrypted string. For more info see the [API docs](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#decryptstring).
```js
    return await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
    );
```

### Full decryption code

```js
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
