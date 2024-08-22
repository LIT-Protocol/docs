import FeedbackComponent from "@site/src/pages/feedback.md";

# Signing within a Lit Action

## Overview

When you [sign a message with Lit](../serverless-signing/quick-start#sign-a-transaction.md), signature shares are typically combined client-side. However, the `signAndCombineEcdsa` function allows you to combine signature shares directly within a Lit Action, which is useful for when you want to make use of the signed data within your Lit Action e.g. submitting a signed transaction. The signature shares will remain within the confines of each Lit node's [Trusted Execution Environment (TEE)](../../resources/how-it-works#1-lit-nodes.md) without ever being exposed to the outside world. 

When you call the `signAndCombineEcdsa` function, signature shares are collected from each Lit node before being combined on a *single* node. The following code example will show how you can use this functionality for arbitrary message signing, as well as how to sign a blockchain transaction using ethers.js. A complete code example is linked at the bottom of this page. 

## Signing a message

The following Lit Action uses `signAndCombineEcdsa` to sign the message 'hello world'. 

```js
const code = `(async () => {
  // sign "hello world" and allow all the nodes to combine the signature and return it to the action.
  const utf8Encode = new TextEncoder();
  const toSign = utf8Encode.encode('Hello World');
  ethers.utils.arrayify(
    ethers.utils.keccak256(toSign)
  );
  // Will use the authentication provided to the "executeJs" call from the sdk on the client.
  const signature = await Lit.Actions.signAndCombineEcdsa({
    toSign,
    publicKey,
    sigName,
  });
  
  // Set the response from the action as the signature share which will not need to be combined on the client
  Lit.Actions.setResponse({ response: JSON.stringify(signature) });
})();`

const client = new LitNodeClient({
    litNetwork: "datil-dev",
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

console.log("response from signing in a transaction: ", res);
```

## Signing a Transaction

The following Lit Action uses `ethers.js` to serialize and sign a transaction (combining signature shares from the Lit nodes) before sending it back to the client where it can be broadcasted to chain. 

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
  let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(serializedTx));
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
    litNetwork: "datil-dev",
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

## Complete Example: Signing Blockchain Transactions

You can find a full example using the `signAndCombineEcdsa` function to sign and send a blockchain transaction on Lit's Yellowstone rollup [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/sign-and-combine-ecdsa/nodejs).
