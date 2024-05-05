import FeedbackComponent from "@site/src/pages/feedback.md";

# Combine Signatures Within an Action

## Overview 

Within a lit action, you may choose to combine a signature from a `pkp` from within the context of an action. Meaning signature shares from each node will be combined and given to every node which recieved a request to execute the given action. Combining within an action may be useful if you wish to take advantage of the `secure compute enviorment` offered by the Lit network. Actions which take combine signatures from within their own execution context will no provide the shares of the signatures to the client. So all information will stay in the trusted execution enviorment (TEE).

# Signing a message

```js
const code = `(async () => {
  // sign "hello world" and allow all the nodes to combine the signature and return it to the action.
  let utf8Encode = new TextEncoder();
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
const res = client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
      publicKey: "<your pkp public key>",
      sigName: 'fooSig',
    }
});

console.log("response from singing in a transaction: ", res);
```

# Signing a Transaction
With the built in `EthersJS` we are able to take advantage of the `serializeTxnForSigning` implementations and serialize a transaction, which is then signed, combined and then sent back to the client.

```js
const code = `(async () => {
  const sigName = "sig1";
  let txn = {
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      value: 1000000000000000,
      gasPrice: 20000000000,
      nonce: 0,
  };

  // using ether's serializeTransaction
  // https://docs.ethers.org/v5/api/utils/transactions/#transactions--functions
  let toSign = ethers.utils.serializeTransaction(txn);
  toSign = await new TextEncoder().encode(toSign);
  const signature = await Lit.Actions.signAndCombineEcdsa({
      toSign,
      publicKey,
      sigName,
  });
  const signature = await Lit.Actions.signAndCombineEcdsa({
    toSign,
    publicKey,
    sigName,
  });
})();
`;

const client = new LitNodeClient({
    litNetwork: 'cayenne',
});

await client.connect();
const res = client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
      publicKey: "<your pkp public key>",
      sigName: 'fooSig',
    }
});
console.log("result from singing in a lit action", res);
```