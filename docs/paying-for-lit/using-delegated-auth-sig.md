import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using a Delegation Auth Sig to Make Requests

When making requests to the Lit network, you must provide [Session Signatures](../sdk/authentication/session-sigs/intro.md). When making requests to the network that require payment, you must also attach a *Capacity Delegation Auth Signature* to your Session Signatures. This Auth Sig tells the Lit network which Capacity Credit to use for paying for your network usage, and also acts as proof that you have permission to use the Capacity Credit for payment.

:::info
To learn more about what a Capacity Credit is, and how they're used, go [here](./capacity-credits).

To learn about how to obtain a Capacity Delegation Auth Signature, go [here](./delegating-credit.md).

For an overview of what requests to the Lit network require payment, go [here](./overview.md#overview-of-what-requires-payment).
:::

The following code will demonstrate executing a Lit Action, one of the types of requests that requires payment, using Session Signatures that contain a Capacity Delegation Auth Signature.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/paying-for-lit/nodejs/src/getSessionSigsWithCapacityCreditAuthSig.ts).
:::

## Prerequisites

Before continuing, you should have an understanding of:

:::note
The address we will be using to make a request to the Lit network **needs** to have been included in the `delegateeAddresses` for the Capacity Delegation Auth Signature used in this guide.
:::

- [How to obtain a Capacity Delegation Auth Signature](./delegating-credit.md)
- [How to generate Session Signatures](../sdk/authentication/session-sigs/get-session-sigs.md)
- How to execute a [Lit Action](../sdk/serverless-signing/overview)

## Setup

### Installing the Required Dependencies

This guide makes use of the following packages and are required to use the following code. You can install the dependencies from NPM using NPM or Yarn:

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>
</Tabs>

### Instantiating an Ethers Signer

```ts
import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

:::note
The address corresponding to `process.env.ETHEREUM_PRIVATE_KEY` **needs** to have been included in the `delegateeAddresses` for the Capacity Delegation Auth Signature used in this guide.
:::

### Instantiating a `LitNodeClient` Client

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilTest,
    debug: false,
});
await litNodeClient.connect();
```

You can learn more about the `@lit-protocol/lit-node-client` package and what is offers using the [API reference docs](https://v6-api-doc-lit-js-sdk.vercel.app/modules/lit_node_client_src.html).

### Generating Session Sigs with the Delegation Auth Sig

:::info
For more information on how the `getSessionSigs` works and it's parameters, please go [here](../sdk/authentication/session-sigs/get-session-sigs.md).
:::

```ts
const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    capabilityAuthSigs: [capacityDelegationAuthSig],
    resourceAbilityRequests: [
    {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
    },
    ],
    authNeededCallback: async ({
        resourceAbilityRequests,
        expiration,
        uri,
    }) => {
    const toSign = await createSiweMessageWithRecaps({
        uri: uri!,
        expiration: expiration!,
        resources: resourceAbilityRequests!,
        walletAddress: ethersSigner.address,
        nonce: await litNodeClient.getLatestBlockhash(),
        litNodeClient,
    });

    return await generateAuthSig({
        signer: ethersSigner,
        toSign,
    });
    },
});
```

This line from the above code is how we're specifying the Capacity Delegation Auth Signature (that's delegating credit usage to `ethersSigner.address`) to pay for our request later in this guide:

```ts
capabilityAuthSigs: [capacityDelegationAuthSig]
```

## Making a Request

After executing the above code, you will now have Session Signatures that contain a Capacity Delegation Auth Signature. These Session Signatures can be used to make any requests to the Lit network that require payment.

Here is an example of using the Session Signatures to execute a simple Lit Action:

```ts
await litNodeClient.executeJs({
    sessionSigs,
    code: `(() => console.log("It works!"))();`,
});
```

## Summary

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/paying-for-lit/nodejs/src/getSessionSigsWithCapacityCreditAuthSig.ts).
:::

This guide has demonstrated how to use a Capacity Delegation Auth Signature to generate Session Signatures, and use those Session Signature to make a request to the Lit network that requires payment.
