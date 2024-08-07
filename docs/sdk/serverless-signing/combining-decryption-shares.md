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

## Using IPFS ID as an Access Control Parameter
When defining your Access Control Conditions rules you may wish to use `currentActionIpfsId` which may be added to your condition as shown below. This is useful for restricting decryption to only permit a single Lit Action to decrypt your data.

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

The ID will be included in the access control check when you use `decryptAndCombine` in an action. It's best to use the `currentActionIpfsId` when you want to share encrypted content that only a specific implementation can decrypt. This is useful for situations where you want to restrict access to sensitive information, like an API key, so that it can only be decrypted by a specific Lit Action. This way, the content will only be decrypted when `decryptAndCombine` is called within that action, keeping your credentials secure within the TEE (Trusted Execution Environment) of the Lit Network.

## Using decryptAndCombine

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


## Decrypting an API Key From Within an Action
For a guide on decrypting an api for secure usage from within a lit action [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/decrypt-api-key-in-action)