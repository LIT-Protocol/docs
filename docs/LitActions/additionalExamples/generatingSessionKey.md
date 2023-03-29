---
sidebar_position: 1
---

# Generating a Session Key

This [example](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/sessionKeys.js) demonstrates how to generate a signed [session key](/SDK/Explanation/WalletSigs/sessionSigs) using Lit Actions.

``` js
// this example will generate and sign a session key and use it for a request

import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { Wallet } from "@ethersproject/wallet";
import { computeAddress } from "@ethersproject/transactions";
import { SiweMessage } from "siwe";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
};

go();
`;

const runLitAction = async () => {
  // mock a wallet
  const wallet = new Wallet(process.env.LIT_MUMBAI_DEPLOYER_PRIVATE_KEY);

  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();

  // when the getSessionSigs function is called, it will generate a session key and sign it
  // using this function. the session key will be used for all requests until the session expires
  let authNeededCallback = async ({ chain, resources, expiration, uri }) => {
    const domain = "localhost:3000";
    const message = new SiweMessage({
      domain,
      address: wallet.address,
      statement: "Sign a session key to use with Lit Protocol",
      uri,
      version: "1",
      chainId: "1",
      expirationTime: expiration,
      resources,
    });
    const toSign = message.prepareMessage();
    const signature = await wallet.signMessage(toSign);

    const authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: toSign,
      address: wallet.address,
    };

    return authSig;
  };

  let sessionSigs = await litNodeClient.getSessionSigs({
    resources: ["litAction://*"],
    chain: "ethereum",
    authNeededCallback,
  });

  // console.log("got sessionSigs: ", sessionSigs);

  const results = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x040f6ab2fff4d845e1e4bd4af84cb5fe61266593500058dbd3df3075624e97823ab44e552f82075c583634f1b9d40c91d4eb666cdfca74b1bd7a63b6b26b27be16",
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();

```
