---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lit Actions

:::note

Lit Actions and PKPs are still heavily in development and things may change.

Need some Celo to mint a PKP? Fill out this form: https://forms.gle/hcvh7VbS83DokBSE9

:::

**PKP Minting is live!**
Mint one here: https://explorer.litprotocol.com/mint-pkp

To create a Lit Action, you need to write some Javascript code that will accomplish your goals. The Lit Protocol provides JS function bindings to do things like request a signature or a decryption.

You'll also need some client side JS to collect the responses from the Lit Nodes and combine them above the threshold into a signature or decrypted data.

## Hello World

First, install the Lit JS SDK `serrano` tag:

```
yarn add lit-js-sdk@serrano
```

Then, write some Javascript code that will request a signature from the Lit Nodes. This Lit Action will sign the string "Hello World" with the shared testnet ECDSA key and return the signature.

The JS below will be run by every node in the network in parallel.

```js
const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitNodeClient.signEcdsa({
    toSign,
    publicKey:
      "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
    sigName: "sig1",
  });
};

go();
```

You also need some client side JS to send the above JS to the nodes, collect the signature shares, combine them, and print the signature. In the following code, we store the above code into a variable called `litActionCode`. We execute it, obtain the signature, and print it:

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
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName });
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
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName });
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

## Conditional Signing

Lit Actions inherit the powerful condition checking that Lit Protocol utilizes for Access Control. You can easily check any on-chain condition inside a Lit Action. For example, the below Lit Action will check if the user has at least 1 Wei on Ethereum, and only sign if they do.

```js
import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // test an access control condition
  const testResult = await LitActions.checkConditions({conditions, authSig, chain})

  console.log('testResult', testResult)

  // only sign if the access condition is true
  if (!testResult){
    return;
  }

  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey: "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64", sigName: "sig1" });
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
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      conditions: [
        {
          conditionType: "evmBasic",
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "eth_getBalance",
          parameters: [":userAddress", "latest"],
          returnValueTest: {
            comparator: ">=",
            value: "1",
          },
        },
      ],
      authSig: {
        sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
        derivedVia: "web3.eth.personal.sign",
        signedMessage:
          "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
        address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
      },
      chain: "ethereum",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
```

## Using fetch()

Unlike traditional smart contract ecosystems, Lit Actions can natively talk to the external world. This is useful for things like fetching data from the web, or sending API requests to other services. The example below will get the current temperature from a weather API, and only sign a txn if the temperature is forecast to be above 60 degrees F. Since you can put this HTTP request and logic that uses the response directly in your Lit Action, you don't have to worry about using an oracle to pull data in. The HTTP request will be sent out by all the Lit Nodes, and consensus is based on at least 2/3 of the nodes getting the same response. If less than 2/3 nodes get the same response, then the user can not collect the signature shares above the threshold and therefore cannot produce the final signature.

```js
import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
  const resp = await fetch(url).then((response) => response.json());
  const temp = resp.properties.periods[0].temperature;

  // only sign if the temperature is above 60.  if it's below 60, exit.
  if (temp < 60) {
    return;
  }
  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName });
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
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "serrano",
    debug: true,
  });
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

## Using EIP191 eth_personal_sign to sign a message (instead of a transaction or raw signature)

You can use `LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });` to sign a message. It will prepend "\\x19Ethereum Signed Message:\\n" to the message and then hash and sign it according to https://eips.ethereum.org/EIPS/eip-191

```js
import LitJsSdk from "lit-js-sdk/build/index.node.js";
import fs from "fs";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import {
  hexlify,
  splitSignature,
  hexZeroPad,
  joinSignature,
} from "@ethersproject/bytes";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { verifyMessage } from "@ethersproject/wallet";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });
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

const go = async () => {
  const message = "Hello World";
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "custom",
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
      "http://localhost:7473",
      "http://localhost:7474",
      "http://localhost:7475",
      "http://localhost:7476",
      "http://localhost:7477",
      "http://localhost:7478",
      "http://localhost:7479",
    ],
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    jsParams: {
      // this is the string "Hello World" for testing
      message,
      publicKey:
        "0x02e5896d70c1bc4b4844458748fe0f936c7919d7968341e391fb6d82c258192e64",
      sigName: "sig1",
    },
    authSig,
  });
  console.log("signatures: ", signatures);
  const sig = signatures.sig1;
  const dataSigned = "0x" + sig.dataSigned;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

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

  const recoveredAddressViaMessage = verifyMessage(message, encodedSig);
  console.log("recoveredAddressViaMessage", recoveredAddressViaMessage);
};

go();
```

## Encrypting and decrypting messages

The Lit Access control product supports encrypting and decrypting content, files, and messages, and so does the Lit Actions product. This works by generating a symmetric encryption key on the client side, encrypting the content with that key, and then encrypting the key with a PKP Public Key to produce an encrypted symmetric key. Then, you can ask the Lit Nodes to use the Private Key Share to decrypt the encrypted symmetric key. The nodes provide their decryption shares to the client, and the client uses the decryption shares to decrypt the encrypted symmetric key. The client then decrypts the content with the symmetric key. This is probably most useful if you put conditions, like an `if` statement, in your litActionCode to determine whether to permit decryption.

```js
import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  // this requests a decryption share from the Lit Node
  // the decryption share will be automatically returned in the HTTP response from the node
  const decryptionShare = await LitActions.decryptBls({ toDecrypt, publicKey, decryptionName });
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
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();

  // let's encrypt something
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );
  console.log(
    "symmetric key: ",
    LitJsSdk.uint8arrayToString(symmetricKey, "base16")
  );
  const encryptedSymmetricKey = LitJsSdk.encryptWithBlsPubkey({
    pubkey: litNodeClient.subnetPubKey,
    data: symmetricKey,
  });
  console.log(
    "encryptedSymmetricKey: ",
    LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
  );

  const result = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      toDecrypt: Array.from(encryptedSymmetricKey),
      publicKey: "1",
      decryptionName: "decryption1",
    },
  });
  console.log("result: ", result);

  const decryptedSymmetricKey = LitJsSdk.uint8arrayFromString(
    result.decryptions.decryption1.decrypted,
    "base16"
  );
  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    decryptedSymmetricKey
  );
  console.log("decryptedString: ", decryptedString);
};

runLitAction();
```

## Passing JS to be run by the Lit Nodes

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

You can call Lit Actions from inside Lit Actions and any signatures or decryptions will be appended to the parent Lit Action response. You do this by passing an IPFS ID to the LitActions.call() function like so: `LitActions.call({ ipfsId: "Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT", params: {})` which would call the Lit Action at the given IPFS ID with the params you pass in to the `params` key. Check out that action code here to see how it works: https://ipfs.io/ipfs/Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT

Below is an action that takes a function name to run, and runs a "child" Lit Action accordingly. This example only has 1 function ("signEcdsa") but it could have many.

All child Lit Actions run inside a new JS runtime / sandbox so none of the parent variables, functions, or state are available to the child action.

```js
import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const signEcdsa = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const resp = await LitActions.call({
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

## More Examples

We have a library of examples here: https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/js-sdkTests

Reach out to us on [Discord](https://litgateway.com/discord) if you need help or have questions!
