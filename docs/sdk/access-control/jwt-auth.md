import FeedbackComponent from "@site/src/pages/feedback.md";

# JWT Auth

Access control conditions can be used to "gate" the signing of JWTs that are used to load dynamic content from a server.

Dapp developers can declare which URLs require certain access control conditions before proceeding to serve content when developing their application, and this can either be done statically (explicitly declared) or programmatically (declared on-the-fly).

The BLS network attest to a user meeting certain access control conditions by checking that they satisfy these conditions before signing a JWT with claims containing these access control conditions.

## High-Level Overview

Here is a high-level, step-by-step breakdown of generating a signed JWT:

1. Client requests BLS network to produce signature shares for a JWT with the claims containing the matching access control conditions for a particular dapp URL.
2. The BLS network nodes checks whether the user satisfies the access control conditions before constructing the JWT payload and signing it.
3. Client recombines the signature shares to assemble the fully formed JWT using the signature and presents the JWT to the dapp URL.
4. The dapp web page would verify that the JWT was signed by the BLS network and check that the access control conditions in the JWT claims matches that which is required for that dapp web page.

## Technical Walkthrough

The Lit Network can be used to specify access control conditions for signing JWTs that are used to load dynamic content from a server.

Check out [this example](https://replit.com/@lit/NextJS-x-Lit-Token-Gating) for a simple NextJS application that gates a web page with an access control condition.

### Provisioning access to a resource

You can use dynamic content provisioning to put some dynamic content behind an on-chain / off-chain condition. As a dapp developer, it is your responsibility to declare the conditions per each of your dapp's web pages either statically / explicitly or programmatically.

### Verifying a JWT that was signed by the Lit network

Verifying a JWT would typically be done on the server side (Node.js), but should work in the browser too.

First, import the Lit JS SDK Node.js package:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
```

Now, you must have a JWT to verify. Usually this comes from the user who is trying to access the resource. You can try the JWT hardcoded in the example below, which may be expired but should at least return a proper header and payload. In the real world, you should use a JWT presented by the user.

In addition to using `LitJsSdk.verifyJwt` to verify that the signature was produced by the BLS network, you must to check that the access control conditions within the JWT claims match those that you have either statically or programmatically declared in your application. If they do not match, you should reject the request.
  - In the example below, we will demonstrate verification against a statically declared set of access control conditions.

```js
const jwt =
  "eyJhbGciOiJCTFMxMi0zODEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJMSVQiLCJzdWIiOiIweGRiZDM2MGYzMDA5N2ZiNmQ5MzhkY2M4YjdiNjI4NTRiMzYxNjBiNDUiLCJjaGFpbiI6ImZhbnRvbSIsImlhdCI6MTYyODAzMTM1OCwiZXhwIjoxNjI4MDc0NTU4LCJiYXNlVXJsIjoiaHR0cHM6Ly9teS1keW5hbWljLWNvbnRlbnQtc2VydmVyLmNvbSIsInBhdGgiOiIvYV9wYXRoLmh0bWwiLCJvcmdJZCI6IiJ9.lX_aBSgGVYWd2FL6elRHoPJ2nab0IkmmX600cwZPCyK_SazZ-pzBUGDDQ0clthPVAtoS7roHg14xpEJlcSJUZBA7VTlPiDCOrkie_Hmulj765qS44t3kxAYduLhNQ-VN";
const { verified, header, payload } = LitJsSdk.verifyJwt({
    jwt, 
    publicKey: litNodeClient.networkPubKey,
});

// Statically declare the access control conditions that gate this web page.
const accessControlConditionsForProtectedPath1: MultipleAccessControlConditions = {
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
const expectedAccessControlConditionsHash = (await litNodeClient.getHashedAccessControlConditions(accessControlConditionsForProtectedPath1))!.toString();
const actualAccessControlConditionsHash = (await litNodeClient.getHashedAccessControlConditions(payload))!.toString();
if (expectedAccessControlConditionsHash !== actualAccessControlConditionsHash) {
  // Reject this request!
  return false;
}
```

The `verified` variable is a boolean that indicates whether or not the signature verified properly to be signed by the BLS network key.

### Accessing a resource via a JWT

Obtaining a signed JWT from the Lit network can be done via the `getSignedToken` function of the [`LitNodeClient`](https://js-sdk.litprotocol.com/classes/lit_node_client_src.LitNodeClientNodeJs.html#getSignedToken). The BLS network effectively attests to the user satisfying certain access control conditions by producing signature shares over a JWT with claims containing these access control conditions.

:::note
An active connection to the Lit Protocol nodes is needed to use this function.
:::

This connection can be made with the following code:

```js
const litNodeClient = new LitJsSdk.LitNodeClient();
await litNodeClient.connect();
```

First, obtain `sessionSigs` from the user to authenticate with Lit network as stated [here](./quick-start#obtain-a-session-sigs).

Now, using the `accessControlConditions` you can use the `getSignedToken` function to get the token:

```js
const jwt = await litNodeClient.getSignedToken({
  accessControlConditions,
  chain,
  sessionSigs,
});
```

You can then present this JWT to a server, which can verify it using the [`verifyJwt` function](https://js-sdk.litprotocol.com/functions/encryption_src.verifyJwt.html).

<FeedbackComponent/>
