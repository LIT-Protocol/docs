---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

:::note

Lit Actions and PKPs are still heavily in development and things may change. The correct Lit JS SDK to use is on the lit-js-sdk `@serrano` branch.

**SDK DOCUMENTATION**
For the most up to date SDK documentation, check out the [Serrano branch SDK docs](https://serrano-sdk-docs.litprotocol.com/#welcome). For references to the Lit Actions functions which can be accessed inside a Lit Action via the `Lit.Actions` object, check out the [Lit Actions](http://actions-docs.litprotocol.com/) API docs.

Need some Polygon Mumbai Tokens to mint a PKP? Fill out this [form](https://forms.gle/hcvh7VbS83DokBSE9).

:::

Lit Actions are JavaScript programs used to define arbitrary signing conditions for [PKPs](/coreConcepts/LitActionsAndPKPs/PKPs.md). In other words, they are the immutable "rules" that dictate *what* or *who* has permission to sign using a particular PKP. 

To create a Lit Action, all you need to do is write some JavaScript code that will accomplish your goals. The Lit Protocol provides JS function bindings to do things like request a signature or check an arbitrary condition.

In order to collect the responses from the Lit nodes, you'll also need to write some client side JS. This will allow you to combine the collected key shares [above the threshold](/Introduction/howItWorks.md) to form the complete signature.

In the example below, we will write a simple Lit Action that requests a signature from the Lit nodes on the string "Hello World".

## 1. Install the SDK

First, install the Lit JS SDK `serrano` tag:

```
yarn add lit-js-sdk@serrano
```

## 2. Requesting a Signature
The Lit Action below  will sign the string "Hello World" with the shared testnet ECDSA key and return the signature.

The JS below will be run by every node in the network in parallel.

```js
const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await Lit.Actions.signEcdsa({
    toSign,
    publicKey:
      "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
    sigName: "sig1",
  });
};

go();
```

You also need some client side JS to send the above JS to the nodes, collect the signature shares, combine them, and print the complete signature. In the following code, we store the above code into a variable called `litActionCode`. We execute it, obtain the signature, and print it:

<Tabs
defaultValue="browser"
values={[
{label: 'Browser', value: 'browser'},
{label: 'NodeJS', value: 'nodejs'},
]}>
<TabItem value="browser">

```js
import LitJsSdk from "lit-js-sdk";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey , sigName });
};

go();
`;

const runLitAction = async () => {
  // you need an AuthSig to auth with the nodes
  // this will get it from metamask or any browser wallet
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });

  const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
```

</TabItem>
<TabItem value="nodejs">

```js
import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey , sigName });
};

go();
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
  const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
```
</TabItem>
</Tabs>

## NOTE: Passing JS to be run by the Lit Nodes

There are 2 ways to pass JS run by the Lit Nodes. You may pass the raw JS in the `code` param, or you may pass the IPFS ID of a file that contains the JS in the `ipfsId` param. The following two examples are equivalent:

### Using the code param

```js
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
};

go();
`;

const signatures = await litNodeClient.executeJs({
  code: litActionCode,
  authSig,
  // all jsParams can be used anywhere in your litActionCode
  jsParams: {
    // this is the string "Hello World" for testing
    toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
    publicKey:
      "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
    sigName: "sig1",
  },
});
```

### Using the ipfsId param

```js
// note that ipfs ID QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm contains the same code as the "litActionCode" variable above.
// You can see this at https://ipfs.litgateway.com/ipfs/QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm
const signatures = await litNodeClient.executeJs({
  ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
  authSig,
  // all jsParams can be used anywhere in your Lit Action Code
  jsParams: {
    // this is the string "Hello World" for testing
    toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
    publicKey:
      "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
    sigName: "sig1",
  },
});
```

## Conclusion and More Examples

And that's it, you have now successfully written your first Lit Action! Continue on to the modules ahead to learn more about the types of use cases and functionality that can be supported, as well as example implementations associated with each.

We also have a library of additional examples here: https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/js-sdkTests

Reach out to us on [Discord](https://litgateway.com/discord) if you need help or have questions!