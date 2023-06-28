---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Logging and Returning Responses

The examples below will explore working with logs and composable Lit Actions. 

## Logging inside a Lit Action

You can log normally using console.log() or console.error() and the results will be returned to you as the "logs" key. Note that your Lit Action is being run on multiple nodes that may provide different logs. Therefore, the most common log message will be the one that is returned. Pass the `debug: true` flag to executeJs to see all logs from all nodes.

```js
const results = await litNodeClient.executeJs({
  code: "console.log('hello')",
  authSig,
});
console.log("logs: ", results.logs);
```

## Returning a response

You can return a JSON response from your Lit Action and it will be returned to you as the "response" key. Note that your Lit Action is being run on multiple nodes that may provide different responses. Therefore, the most common response will be the one that is returned. Pass the `debug: true` flag to executeJs to see all logs from all nodes.

```js
const results = await litNodeClient.executeJs({
  code: "LitActions.setResponse({response: JSON.stringify({hello: 'world'})})",
  authSig,
});
console.log("response: ", results.response);
```

## Composability

You can call Lit Actions from inside Lit Actions and any signatures or decryptions will be appended to the parent Lit Action response. You do this by passing an IPFS ID to the Lit.Actions.call() function like so: `Lit.Actions.call({ ipfsId: "Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT", params: {})` which would call the Lit Action at the given IPFS ID with the params you pass in to the `params` key. Check out that action code here to see how it works: https://ipfs.io/ipfs/Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT

Below is an action that takes a function name to run, and runs a "child" Lit Action accordingly. This example only has 1 function ("signEcdsa") but it could have many.

All child Lit Actions run inside a new JS runtime / sandbox so none of the parent variables, functions, or state are available to the child action.

```js
import * as LitJsSdk from '@lit-protocol/lit-node-client';

// this code will be run on the node
const litActionCode = `
const signEcdsa = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const resp = await Lit.Actions.call({
    ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
    params: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
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

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "serrano",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      functionToRun: "signEcdsa",
    },
  });
  console.log("results: ", results);
};

runLitAction();
```
