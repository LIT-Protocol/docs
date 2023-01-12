---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Signing with EIP191

You can also use EIP191 eth_personal_sign to sign a message, instead of a transaction or raw signature.

This can be done with `LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });` when signing. It will prepend "\\x19Ethereum Signed Message:\\n" to the message and then hash and sign it according to https://eips.ethereum.org/EIPS/eip-191

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