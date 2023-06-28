---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Fetch

Unlike traditional smart contract ecosystems, Lit Actions can natively talk to the external world. This is useful for things like fetching data from the web, or sending API requests to other services. 

The Lit Action below will get the current temperature from the [National Weather Service](https://www.weather.gov/) API, and ONLY sign a txn if the temperature is forecast to be **above 60 degrees F**. Since you can put this HTTP request and logic that uses the response directly in your Lit Action, you don't have to worry about using a 3rd party oracle to pull data in. 

The HTTP request will be sent out by all the Lit Nodes in parallel, and consensus is based on at least 2/3 of the nodes getting the same response. If less than 2/3 nodes get the same response, then the user can not collect the signature shares above the threshold and therefore cannot produce the final signature. Note that your HTTP request will be sent N times where N is the number of nodes in the Lit Network, because it's sent from every Lit Node in parallel. You should be careful about how many requests you're making and note that this may trigger rate limiting issues on some servers. N is currently 10 on the Serrano testnet.

```js
import * as LitJsSdk from '@lit-protocol/lit-node-client';

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

## Using fetch() to write data

You can also use fetch() inside a Lit Action to write data, but you **must be careful** (because the HTTP request will be run N times where N is the number of Lit Nodes). On Serrano, N is 10, so any fetch() request will be sent to the server 10 times. 

**This is safe**, however, if the place you're writing the data to is *idempotent*. Idempotent means that applying the same operation over and over will not change the result. So for example, a SQL Insert is not idempotent, becuase if you run it 10 times, it will create 10 rows. On the other hand, a SQL Update is idempotent, because if you run it 10 times, it will only update the row once. So if you're using fetch() to write data, make sure the server you're writing to is idempotent.


## Example Project

Below is an example Replit project that demonstrates how to get a signed API response using Lit Actions:

<iframe frameborder="100px" width="100%" height="500px" className="repls" style={{display: "full"}} src="https://replit.com/@lit/Lit-Actions-Return-signed-API-reponse/#lit-actions_sign_api_response/src/App.js"></iframe>