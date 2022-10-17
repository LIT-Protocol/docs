---
sidebar_position: 3
---

# Encrypt Input

Given an input string, we want to encrypt it using the Lit SDK so that only the users authorized by our `accessCondition` should be able to decrypt it. Let's continue developing our Lit class.

1. First, we need to define the `accessControlCondition` for a user to decrypt our encrytped string:
```
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

2. Define a function `encryptText` which encrypts the `text` argument
```
  async encryptText(text) {
    if (!this.litNodeClient) {
      await this.connect(); // Connect to Lit Network if not already
    }
```

3. Sign using our wallet before encrypting. This will show a Metamask pop-up which the user signs. For more info, please check out our API docs: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#checkandsignauthmessage
```
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
```

4. Finally, let's encrypt our string. This will return a promise containing the `encryptedString` as a **Blob** and the `symmetricKey` used to encrypt it, as a **Uint8Array**. For more info, please check out our API docs: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#encryptstring
```
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);
```

5. Now, we can save the encryption key with the access control condition, which tells Lit Protocol that users that meet this access control condition should be able to decrypt. For more info, please check out our API docs: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#litnodeclient
```
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

**Note:** `encryptedSymmetricKey` will be a Uint8Array.

We now need to save `accessControlConditions`, `encryptedSymmetricKey`, & `encryptedString`. `accessControlConditions` & `encryptedSymmetricKey` are needed to obtain the decrypted symmetric key, which we can then use to decrypt the `encryptedString`.

## Putting it all together

```
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