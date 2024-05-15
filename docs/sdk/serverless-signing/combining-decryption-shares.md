import FeedbackComponent from "@site/src/pages/feedback.md";

# Decrypting and Combining Within an Action

:::info
Only available on the `test` network
:::

## Overview

Decryption with Lit is typically done client-side by an authorized party at the time of access. The decryptAndCombine function allows you to decrypt data within a Lit Action. This function is useful for performing operations over sensitive data, where the data itself remains private within the confines of each Lit node's Trusted Execution Environment (TEE).

When you call `decryptAndCombine`, the decryption shares are collected from each Lit node before they are combined on a single node.


# Encrypting content
We will start by performing an `encrypt` operation as shown below using the `LitNodeClient`. This operation is entirely done on the client, so no need for any Lit Action involvement.

```js
 const chain = 'ethereum';
 const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain,
      method: 'eth_getBalance',
      parameters: [':userAddress', 'latest'],
      returnValueTest: {
        comparator: '>=',
        value: '0',
      },
    },
  ];
  const message = 'Hello world';
  const client = new LitNodeClient({
    litNetwork: 'cayenne'
  });
  await client.connect();
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions,
      sessionSigs: {}, // your session
      chain,
      dataToEncrypt: message,
    },
    client
  );

  console.log("cipher text:", ciphertext, "hash:", dataToEncryptHash);
```

Let's now take the `ciphertext` and `dataToEncryptHash` and use it from a Lit Action to decrypt within the TEE.
In the below example we set the `authSig` to `null` as a way to tell the Lit Action runtime to use the `authSig` which was provided to the node through the `executeJs` call's `sessionSigs`.
If you wish you may provide a different Auth Signature if the one provided from the session is not relevant to your use case. 
```js
const code = `(async () => {
  const resp = await Lit.Actions.decryptAndCombine({
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig: null,
    chain: 'ethereum',
  });

  Lit.Actions.setResponse({ response: resp });
})();`

const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash
    }
});

console.log("decrypted content sent from lit action:", res);
```