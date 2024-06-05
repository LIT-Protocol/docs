import FeedbackComponent from "@site/src/pages/feedback.md";

# Processing & Validation

## Generating Signed Transactions

How to generate a [signed Ethereum transaction](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/signTxn.js) with PKPs and Lit Actions.

This example relies on the following packages: 

```jsx
@lit-protocol/lit-node-client
@ethersproject/transactions
@ethersproject/signing-key
@ethersproject/bytes 
```

The packages to import will look like: 

```jsx
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import fs from "fs";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import {
  hexlify,
  splitSignature,
  hexZeroPad,
  joinSignature,
} from "@ethersproject/bytes";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
```

Create the Lit Action code

```jsx
const litActionCode = fs.readFileSync("./build/signTxnTest.js");
```

Where we will refer to the `signTxnTest.js` file here: https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/build/signTxnTest.js.

Set up a SessionSig, you can read more about that [here](../../sdk/authentication/session-sigs/get-session-sigs).

Call the Lit Actions code with the Lit nodes

```jsx
const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    jsParams: {},
  });
  const { signatures, response } = results;
  console.log("response", response);

  const sig = signatures.sig1;
  const { dataSigned } = sig;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

  const { txParams } = response;

  console.log("encodedSig", encodedSig);
  console.log("sig length in bytes: ", encodedSig.substring(2).length / 2);
  console.log("dataSigned", dataSigned);
  const splitSig = splitSignature(encodedSig);
  console.log("splitSig", splitSig);

  const recoveredPubkey = recoverPublicKey(dataSigned, encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);
  const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
  console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
  const recoveredAddress = recoverAddress(dataSigned, encodedSig);
  console.log("recoveredAddress", recoveredAddress);

  const txn = serialize(txParams, encodedSig);

  console.log("txn", txn);
};

go();
```

## Generating a Session Key

```jsx
@lit-protocol/lit-node-client
@ethersproject/wallet
@ethersproject/transactions
siwe
```

With a simple Lit Action code

This requests a signature share from the Lit Node. The signature share will be automatically returned in the response from the node and combined into a full signature by the LitJsSdk for use on the client.

All the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  

```jsx
const litActionCode = `
	const go = async () => {
		const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
	};
	
	go();
`;
```

## Logging

Log using `console.log()` or `console.error()` and the results will be returned under the "logs" key. 

Note that your Lit Action is being run on multiple nodes that may provide different logs. Therefore, the most common log message will be the one that is returned. Pass the `debug: true` flag to executeJs to see all logs from all nodes.

```jsx
const results = await litNodeClient.executeJs({
  code: "console.log('hello')",
  sessionSigs,
});
console.log("logs: ", results.logs);
```

Returning Responses

You can return a JSON response from your Lit Action and results will be returned under the "response" key. 

Note that your Lit Action is being run on multiple nodes that may provide different responses. Therefore, the most common response will be the one that is returned. Pass the `debug: true` flag to executeJs to see all logs from all nodes.

```jsx
const results = await litNodeClient.executeJs({
  code: "LitActions.setResponse({response: JSON.stringify({hello: 'world'})})",
  sessionSigs,
});
console.log("response: ", results.response);
```

## Composability

You can call Lit Actions from inside Lit Actions and any signatures or decryptions will be appended to the parent Lit Action response. 

You do this by passing an IPFS ID to the Lit.Actions.call() function like so: 

```jsx
Lit.Actions.call({ ipfsId: "Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT", params: {}) 
```

which would call the Lit Action at the given IPFS ID with the params you pass in to the `params` key. 

Check out that action code here to see how it works: https://ipfs.io/ipfs/Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT

Below is an action that takes a function name to run, and runs a "child" Lit Action accordingly. This example only has 1 function ("signEcdsa") but it could have many.

All child Lit Actions run inside a new JS runtime / sandbox so none of the parent variables, functions, or state are available to the child action.

Lit Action code

```jsx
const litActionCode = `
const signEcdsa = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const message = new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode('Hello world'))
  );
  const resp = await Lit.Actions.call({
    ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
    params: {
      // this is the string "Hello World" for testing
      toSign: message,
      publicKey:
        "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
      sigName: "childSig",
    },
  });

  console.log("results: ", resp);
};

if (functionToRun === "signEcdsa") {
  signEcdsa();
}
`;
```

Running the Lit Action on the Lit nodes:

```jsx
import * as LitJsSdk from '@lit-protocol/lit-node-client';

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "serrano",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      functionToRun: "signEcdsa",
    },
  });
};

runLitAction();
```
<FeedbackComponent/>
