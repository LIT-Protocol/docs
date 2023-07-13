# JWT Auth

The Lit Network can be used to specify access control conditions for signing JWTs that are used to load dynamic content from a server.

Check out [this example](https://github.com/LIT-Protocol/js-sdk/blob/master/apps/demo-locked-express-app/README.md) for a simple Express application that gates a server-provided web page with an access control condition.

## Provisioning access to a resource

You can use dynamic content provisioning to put some dynamic content behind an on-chain / off-chain condition. As a dapp developer, it is your responsibility to declare the conditions per each of your dapp's web pages either statically / explicitly or programmatically.

## Verifying a JWT that was signed by the Lit network

Verifying a JWT would typically be done on the server side (Node.js), but should work in the browser too.

First, import the Lit JS SDK Node.js package:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
```

Now, you must have a JWT to verify. Usually this comes from the user who is trying to access the resource. You can try the JWT harcoded in the example below, which may be expired but should at least return a proper header and payload. In the real world, you should use a JWT presented by the user.

In addition to using `LitJsSdk.verifyJwt` to verify that the signature was produced by the BLS network, you must to check that the access control conditions within the JWT claims match those that you have either statically or programmatically declared in your application. If they do not match, you sohuld reject the request.
  - In the example below, we will demonstrate verification against a statically declared set of access control conditions.

```js
const jwt =
  "eyJhbGciOiJCTFMxMi0zODEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJMSVQiLCJzdWIiOiIweGRiZDM2MGYzMDA5N2ZiNmQ5MzhkY2M4YjdiNjI4NTRiMzYxNjBiNDUiLCJjaGFpbiI6ImZhbnRvbSIsImlhdCI6MTYyODAzMTM1OCwiZXhwIjoxNjI4MDc0NTU4LCJiYXNlVXJsIjoiaHR0cHM6Ly9teS1keW5hbWljLWNvbnRlbnQtc2VydmVyLmNvbSIsInBhdGgiOiIvYV9wYXRoLmh0bWwiLCJvcmdJZCI6IiJ9.lX_aBSgGVYWd2FL6elRHoPJ2nab0IkmmX600cwZPCyK_SazZ-pzBUGDDQ0clthPVAtoS7roHg14xpEJlcSJUZBA7VTlPiDCOrkie_Hmulj765qS44t3kxAYduLhNQ-VN";
const { verified, header, payload } = LitJsSdk.verifyJwt({
    jwt, 
    publicKey: litNodeClient.networkPubKey,
});

// Statically declare the access control conditions that gate this web page.
const accessControlCondtionsForProtectedPath1: MultipleAccessControlConditions = {
  accessControlConditions: [{
    chain: 'polygon',
    contractAddress: '',
    method: '',
    parameters: [':userAddress'],
    returnValueTest: {
      comparator: '=',
      value: MY_OWN_WALLET_ADDRESS,
    },
    standardContractType: '',
  }]
};

// Verify the access control conditions in the JWT claims are as expected.
const expectedAccessControlConditionsHash = (await litNodeClient.getHashedAccessControlConditions(accessControlCondtionsForProtectedPath1))!.toString();
const actualAccessControlConditionsHash = (await litNodeClient.getHashedAccessControlConditions(payload))!.toString();
if (expectedAccessControlConditionsHash !== actualAccessControlConditionsHash) {
  // Reject this request!
  return false;
}
```

The `verified` variable is a boolean that indicates whether or not the signature verified properly to be signed by the BLS network key.

## Accessing a resource via a JWT

Obtaining a signed JWT from the Lit network can be done via the `getSignedToken` function of the [`LitNodeClient`](https://js-sdk.litprotocol.com/classes/lit_node_client_src.LitNodeClientNodeJs.html#getSignedToken). The BLS network effectively attests to the user satisfying certain access control conditions by producing signature shares over a JWT with claims containing these access control conditions.

:::note
An active connection to the Lit Protocol nodes is needed to use this function.
:::

This connection can be made with the following code:

```js
const litNodeClient = new LitJsSdk.LitNodeClient();
await litNodeClient.connect();
```

First, obtain an `authSig` from the user. This will ask their metamask to sign a message proving they own the crypto address in their wallet. Remember to pass the chain you're using!

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "polygon" });
```

Now, using the `accessControlConditions` you can use the `getSignedToken` function to get the token:

```js
const jwt = await litNodeClient.getSignedToken({
  accessControlConditions,
  chain,
  authSig,
});
```

You can then present this JWT to a server, which can verify it using the [`verifyJwt` function](https://js-sdk.litprotocol.com/functions/encryption_src.verifyJwt.html).
