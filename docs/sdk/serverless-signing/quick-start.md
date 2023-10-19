import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Started

:::note
💡 Lit Actions and PKPs are still heavily in development and things may change.

**API DOCUMENTATION** For the most up to date API documentation, check out the [Lit JS SDK V3 docs](https://lit-js-sdk-v3-api-docs.vercel.app/).

For references to the Lit Actions functions which can be accessed inside a Lit Action via the `Lit.Actions` object, check out the [Lit Actions](http://actions-docs.litprotocol.com/) API docs.

Need some `LIT` test tokens to mint a PKP? Get some from the [faucet](https://faucet.litprotocol.com/)!

:::

## Prerequisites

- Familiarity with JavaScript
- Read the Overview section about [serverless signing](../serverless-signing/overview.md)

## What are Lit Actions

Lit Actions are JavaScript programs used to define signing conditions for [PKPs](../pkp/intro). In other words, they are the immutable "rules" that dictate what or who has permission to sign using a particular PKP.

To create a Lit Action write some JavaScript code that will accomplish your goals. The Lit Protocol provides JS function bindings to do things like request a signature or check an arbitrary condition. If you need to include dependencies like NPM packages, use a bundler like Webpack or ESBuild to create a single JS file and provide that bundle as your Lit Action.

In order to collect the responses from the Lit nodes, you'll also need to write some client side JS. This will allow you to combine the collected key shares [above the threshold](../../resources/how-it-works.md) to form the complete signature.

In the example below, we will write a simple Lit Action that requests a signature from the Lit nodes and signs a message that says "Hello World".

## 1. Install the Lit JS SDK V3

On the client side

```jsx
yarn add @lit-protocol/lit-node-client@cayenne
```

For server side

```jsx
yarn add @lit-protocol/lit-node-client-nodejs@cayenne
```

## 2. Obtain a PKP

Go to https://explorer.litprotocol.com/ and mint a PKP. 

:::tip

Save the public key which will be used in the steps below.

:::

## 3. Request a Signature

The Lit Action below will sign the string "Hello World" with the shared testnet ECDSA key and return the signature.

The JS below will be run by every node in the network in parallel.

```jsx
const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await Lit.Actions.signEcdsa({
    toSign,
    publicKey:
      "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
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

```jsx
import * as LitJsSdk from '@lit-protocol/lit-node-client';

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
  // this will get it from MetaMask or any browser wallet
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
        "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
```

</TabItem>

<TabItem value="nodejs">

```jsx
import * as LitJsSdk from '@lit-protocol/lit-node-client-nodejs';

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
  const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({ litNetwork: "serrano" });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
```

</TabItem>
</Tabs>

Passing JS to be run by the Lit Nodes

There are 2 ways to pass JS run by the Lit Nodes. You may pass the raw JS in the `code` param, or you may pass the IPFS ID of a file that contains the JS in the `ipfsId` param. The following two examples are equivalent:

**Using the code param**

```jsx
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
      "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
    sigName: "sig1",
  },
});
```

**Using the ipfsId param**

The ipfs ID: `QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm` contains the same code as the "litActionCode" variable above.

You can check out the code here: https://ipfs.litgateway.com/ipfs/QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm .

```jsx
const signatures = await litNodeClient.executeJs({
  ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
  authSig,
  // all jsParams can be used anywhere in your Lit Action Code
  jsParams: {
    // this is the string "Hello World" for testing
    toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
    publicKey:
      "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
    sigName: "sig1",
  },
});
```

## Conclusion and More Examples

And that's it, you have now successfully written your first Lit Action! 

Continue on to the modules ahead to learn more about the types of use cases and functionality that can be supported, as well as example implementations associated with each.

Reach out to us on [Discord](https://litgateway.com/discord) if you need help or have questions!
