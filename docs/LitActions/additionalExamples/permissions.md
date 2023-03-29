---
sidebar_position: 3
---

# Checking PKP Permissions

Verifying [PKP permissions](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/pkpPermissions.js) using a Lit Action.

``` js
import * as LitJsSdk from '@lit-protocol/lit-node-client';

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const results = {}
  const tokenId = Lit.Actions.pubkeyToTokenId({publicKey})
  results.tokenId = tokenId

  // let's lookup some permissions
  const isPermittedAction = await Lit.Actions.isPermittedAction({tokenId, ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm"})
  results.isPermittedAction = isPermittedAction

  const isPermittedAddress = await Lit.Actions.isPermittedAddress({tokenId, address: Lit.Auth.authSigAddress})
  results.isPermittedAddress = isPermittedAddress

  const userId = uint8arrayFromString("testing", "utf8")
  const isPermittedAuthMethod = await Lit.Actions.isPermittedAuthMethod({tokenId, authMethodType: "2", userId })
  results.isPermittedAuthMethod = isPermittedAuthMethod

  const permittedActions = await Lit.Actions.getPermittedActions({tokenId})
  results.permittedActions = permittedActions

  const permittedAddresses = await Lit.Actions.getPermittedAddresses({tokenId})
  results.permittedAddresses = permittedAddresses

  const permittedAuthMethods = await Lit.Actions.getPermittedAuthMethods({tokenId})
  results.permittedAuthMethods = JSON.stringify(permittedAuthMethods)

  const permittedAuthMethodScopes = await Lit.Actions.getPermittedAuthMethodScopes({
    tokenId,
    authMethodType: "2",
    userId,
    maxScopeId: 10
  })

  results.permittedAuthMethodScopes = JSON.stringify(permittedAuthMethodScopes)

  Lit.Actions.setResponse({response: JSON.stringify(results)})
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
    litNetwork: "custom",
    debug: true,
    minNodeCount: 2,
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
    ],
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      publicKey:
        "0x042f48db7024106148948a64a142656d0c0513ff60ebb614fc61c7451001dabd10f7cc52879b9a8feb0b00dad12cbd51df545ca2c30135f77b0c79775e426e562c",
    },
  });
  console.log("results: ", results);
};

runLitAction();

```