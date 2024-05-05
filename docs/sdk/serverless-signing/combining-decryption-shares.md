import FeedbackComponent from "@site/src/pages/feedback.md";

# Decrypting and Combining Within an Action

## Overview
Within a Lit action, you may choose to combine a `decryption shares` from within the context of an action. Meaning signature shares from each node will be combined and given to every node which recieved a request to execute the given action. Combining within an action may be useful if you wish to take advantage of the `Secure Compute Enviorment` offered by the Lit network. Actions which take combine signatures from within their own execution context will no provide the shares of the signatures to the client. So all information will stay in the trusted execution enviorment (TEE).


# Encrypting content
We will start by performing an `encrypt` operation as shown below using the `LitNodeClient` this operation is entirely done on the client, so no need for any lit action invovelment.
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
    network: 'cayenne'
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

Let's now take the `cipther text` and `hash of encrypted data` and use it from a Lit Action to decrypt within the `TEE`.
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

const res = client.executeJs({
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