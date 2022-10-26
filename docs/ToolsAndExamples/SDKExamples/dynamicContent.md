---
sidebar_position: 2
---

# Authing Dynamic Content via JWT (content loaded from a server)

## Verifying a JWT that was signed by the Lit network

Verifying a JWT would typically be done on the server side (nodejs), but should work in the browser too.

First, import the SDK:

```js
import LitJsSdk from "@lit-protocol/sdk-nodejs";
```

Now, you must have a JWT to verify. Usually this comes from the user who is trying to access the resource. You can try the JWT harcoded in the example below, which may be expired but should at least return a proper header and payload. In the real world, you should use a JWT presented by the user.

```js
const jwt =
  "eyJhbGciOiJCTFMxMi0zODEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJMSVQiLCJzdWIiOiIweGRiZDM2MGYzMDA5N2ZiNmQ5MzhkY2M4YjdiNjI4NTRiMzYxNjBiNDUiLCJjaGFpbiI6ImZhbnRvbSIsImlhdCI6MTYyODAzMTM1OCwiZXhwIjoxNjI4MDc0NTU4LCJiYXNlVXJsIjoiaHR0cHM6Ly9teS1keW5hbWljLWNvbnRlbnQtc2VydmVyLmNvbSIsInBhdGgiOiIvYV9wYXRoLmh0bWwiLCJvcmdJZCI6IiJ9.lX_aBSgGVYWd2FL6elRHoPJ2nab0IkmmX600cwZPCyK_SazZ-pzBUGDDQ0clthPVAtoS7roHg14xpEJlcSJUZBA7VTlPiDCOrkie_Hmulj765qS44t3kxAYduLhNQ-VN";
const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt });
if (
  payload.baseUrl !== "this-website.com" ||
  payload.path !== "/path-you-expected" ||
  payload.orgId !== "" ||
  payload.role !== "" ||
  payload.extraData !== ""
) {
  // Reject this request!
  return false;
}
```

The "verified" variable is a boolean that indicates whether or not the signature verified properly.

:::note

YOU MUST CHECK THE PAYLOAD AGAINST THE CONTENT YOU ARE PROTECTING. This means you need to look at "payload.baseUrl" which should match the hostname of the server, and you must also look at "payload.path" which should match the path being accessed. If these do not match what you're expecting, you should reject the request.

:::

## Provisioning access to a resource

You can use dynamic content provisioning to put some dynamic content behind an on chain condition. You can do this by calling the [`saveSigningCondition`](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/index.html#litnodeclient) function of the LitNodeClient. It will essentially store that condition and the resource that users who meet that condition should be authorized to access. The resource could be a URL, for example. The dynamic content server should then verify the JWT provided by the network on every request, which proves that the user meets the on chain condition.

:::note

An active connection to the Lit Protocol nodes is needed to use this function.
:::

This connection can be made with the following code:

```js
const litNodeClient = new LitJsSdk.LitNodeClient();
litNodeClient.connect();
```

Now, you should define you access control conditions. In the example below, we define a condition that requires the user holds at least 1 ERC1155 token with Token ID 9541 from the `0x3110c39b428221012934A7F617913b095BC1078C` contract.

```js
const accessControlConditions = [
  {
    contractAddress: "0x3110c39b428221012934A7F617913b095BC1078C",
    standardContractType: "ERC1155",
    chain,
    method: "balanceOf",
    parameters: [":userAddress", "9541"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];
```

Next, obtain an authSig from the user. This will ask their metamask to sign a message proving they own the crypto address in their wallet. Remember to pass the chain you're using.

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "polygon" });
```

Next, define the Resource ID of the resource you are granting access to. This is typically a URL.

```js
const resourceId = {
  baseUrl: "my-dynamic-content-server.com",
  path: "/a_path.html",
  orgId: "",
  role: "",
  extraData: "",
};
```

Finally, you can save all this to the Lit nodes, and then users will be able to request a JWT that grants access to the resource.

```js
await litNodeClient.saveSigningCondition({
  accessControlConditions,
  chain,
  authSig,
  resourceId,
});
```

Make sure that you save the `accessControlConditions` and `resourceId`, because the user will have to present them when requesting a JWT that would grant them access. You will typically want to store them wherever you authorize the user, typically where the "log in" or "authorize" button lives.

## Accessing a resource via a JWT

Obtaining a signed JWT from the Lit network can be done via the getSignedToken function of the [LitNodeClient](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/index.html#litnodeclient).

:::note

You must call `litNodeClient.saveSigningCondition` to save a signing condition before you can request a signature and access a resource via a JWT. See the docs above for "Dynamic Content - Provisoning access to a resource" to learn how to do this.
:::

:::note
An active connection to the Lit Protocol nodes is needed to use this function.
:::

This connection can be made with the following code:

```js
const litNodeClient = new LitJsSdk.LitNodeClient();
litNodeClient.connect();
```

First, obtain an authSig from the user. This will ask their metamask to sign a message proving they own the crypto address in their wallet. Remember to pass the chain you're using!

```js
const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "polygon" });
```

Now, using the accessControlConditions and resourceId you defined when provisoning access to the resource, you can use the getSignedToken function to get the token:

```js
const jwt = await litNodeClient.getSignedToken({
  accessControlConditions,
  chain,
  authSig,
  resourceId,
});
```

You can then present this JWT to a server, which can verify it using the [verifyJwt function](https://lit-protocol.github.io/lit-js-sdk/api_docs_html/index.html#verifyjwt).

## Dynamic Content Examples

### Gating dynamic and interactive content inside a React app

This example code shows how to lock an entire React app behind a Lit JWT.

https://github.com/LIT-Protocol/lit-locked-react-app-minimal-example

### Minimal JWT verification example to gate dynamic content on a server

This repo is a minimal example to:

- Mint an NFT (client side)
- Provision access to a resource (a web url) behind ownership of that NFT (client side)
- Request a signed JWT from the Lit network to access that resource (client side)
- Verify the signature on that JWT (server side)

https://github.com/LIT-Protocol/lit-minimal-jwt-example

### NextJS: Token Gate a URL Page

This is a minimal example of how to token-gate a Next.js page within the `getServerSideProps`. This example was created by [Nader Dabit](https://twitter.com/dabit3).

https://github.com/dabit3/nextjs-lit-token-gating
