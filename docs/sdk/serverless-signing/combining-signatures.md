import FeedbackComponent from "@site/src/pages/feedback.md";

# Combine Signatures Within an Action

:::info
Only available on the `test` network
:::

## Overview

When you sign a message with using [Lit's PKPs](https://developer.litprotocol.com/v3/sdk/serverless-signing/quick-start), signature shares are typically combined client-side to form the complete signature. The `signAndCombineEcdsa` function allows you to combine these shares within a Lit Action, meaning they will remain within the confines of each Lit node's Trusted Execution Environment (TEE) and not exposed to the end client.

When you call `signAndCombineEcdsa`, the signature shares are collected from each Lit node before they are combined on a single node.

## Signing a message

```js
const code = `(async () => {
  // sign "hello world" and allow all the nodes to combine the signature and return it to the action.
  const utf8Encode = new TextEncoder();
  const toSign = utf8Encode.encode('Hello World');

  // Will use the authentication provided to the `executeJs` call from the sdk on the client.
  const signature = await Lit.Actions.signAndCombineEcdsa({
    toSign,
    publicKey,
    sigName,
  });
  
  // Set the response from the action as the signature share which will not need combination on the client
  Lit.Actions.setResponse({ response: JSON.stringify(signature) });
})()`;

const client = new LitNodeClient({
    litNetwork: 'cayenne',
});
await client.connect();
const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
      publicKey: "<your pkp public key>",
      sigName: 'fooSig',
    }
});

console.log("response from singing in a transaction: ", res);
```

## Signing a Transaction
With the built in `EthersJS` we are able to take advantage of the `serializeTxnForSigning` implementations and serialize a transaction, which is then signed, combined and then sent back to the client.

```js
const code = `(async () => {
  const sigName = "sig1";
  // example transaction
  let txn = {
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      value: 1000000000000000,
      gasPrice: 20000000000,
      nonce: 0,
  };

  // using ether's serializeTransaction
  // https://docs.ethers.org/v5/api/utils/transactions/#transactions--functions
  const serializedTx = ethers.utils.serializeTransaction(txn);
  let hash = utils.keccak256(ethers.utils.toUtf8Bytes(serializedTx));
  // encode the message into an uint8array for signing
  const toSign = await new TextEncoder().encode(hash);
  const signature = await Lit.Actions.signAndCombineEcdsa({
      toSign,
      publicKey,
      sigName,
  });

  // here we're setting the response to the signature output, but there's no need to do this
  // if your use case requires the signature to not be seen by the client
  Lit.Actions.setResponse({
    response: signature
  });
})();
`;

const client = new LitNodeClient({
    litNetwork: 'cayenne',
});

await client.connect();
const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
      publicKey: "<your pkp public key>",
    }
});
console.log("result from singing in a lit action", res);
```

## Using Signatures from Within A Lit Action

For an example of how you may use the signature from `signAndCombineEcdsa` from within the Lit Action see [here](./run-once.md).