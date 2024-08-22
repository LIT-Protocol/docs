import FeedbackComponent from "@site/src/pages/feedback.md";

# Decrypting within a Lit Action

## Overview

Decryption with Lit is typically performed client-side by an authorized user at the time of access. This process is documented [here](../access-control/quick-start.md). However, an alternative method of decryption is supported using Lit Actions. Specifically, the `decryptAndCombine` function can be used to decrypt data within a Lit Action. This is useful for performing operations over sensitive data, where the data itself remains private within the confines of each Lit node's Trusted Execution Environment (TEE). You can learn more about Lit's architecture [here](../../resources/how-it-works#sealed-and-confidential-hardware.md).

When you call `decryptAndCombine`, each Lit node's decryption shares are collected and combined on a single node and used to decrypt the given content.

The following doc will provide a complete walkthrough of using `decryptAndCombine`. We'll start by encrypting a string client-side before using a Lit Action to decrypt it. At the bottom of the page you'll find a complete example that demonstrates how you can use this functionality to decrypt an API key and perform a remote API call from within an Action. 

# Encrypting content
The first step is to encrypt your data. The encryption operation will be performed client-side *outside* of your Lit Action using the `LitNodeClient`:

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
    litNetwork: "datil-dev"
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
Let's break this down. The first step was creating your Access Control Condition (ACC), which is used to specify who or under what conditions your data should be able to be decrypted.

The second step was actually encrypting the static content (string, file, zip, etc...) using the `encryptString` function. This returns a `ciphertext` and `dataToEncryptHash`. The `ciphertext`, `dataToEncryptHash`, chain data, and any other metadata (such as your `accessControlConditions`) should be stored on your storage provider of choice. A solid choice is IPFS. 

## Using IPFS CID as an Access Control Parameter
For this example, you can set your Access Control parameter as `currentActionIpfsId` which can be accomplished using the snippet below. This will mean that only a specific Lit Action (based on the IPFS CID where it has been deployed) will be able to decrypt your data. No other party will ever have access. This is useful for situations where you want to restrict access to sensitive information, like an API key, so that it can only be decrypted by a specific Lit Action.

```js
{
  contractAddress: '',
  standardContractType: '',
  chain: 'ethereum',
  method: '',
  parameters: [':currentActionIpfsId'],
  returnValueTest: {
    comparator: '=',
    value: '<YOUR_LIT_ACTION_IPFS_CID>',
  },
}
```

## Using decryptAndCombine

We can now use the `ciphertext` and `dataToEncryptHash` that we got earlier during the encryption step and pass it into our Lit Action. 

In the below example we set the `authSig` to `null` as a way to tell the Lit Action runtime to use the `authSig` which was provided to the node when you call `executeJs` which returns `sessionSigs`. If you wish you may provide a different Auth Signature if the one provided from the session is not relevant to your use case. You can learn more about authentication and creating session signatures using these [docs](../authentication/session-sigs/intro.md).

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

## Complete Example: Decrypting an API Key From Within an Action
The following example demonstrates how you can decrypt an API key within a Lit Action. Once decrypted, the API key can be used to perform a remote API call. Check out the complete code example [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/decrypt-api-key-in-action).