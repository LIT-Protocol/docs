---
description: Learn how to use a delegated credit to make requests to a Lit network
sidebar_label: Use a Delegated Credit
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using a Delegated Credit to Make Requests

:::info
Capacity Credits are the form of payment for usage of the Lit network. They are required when making decryption requests, PKP signing requests, and when executing Lit Actions.

To learn more about what a Capacity Credit is, and how they're used, please go [here](../../../learn/paying-for-lit/capacity-credits).

To learn more about how to delegate a Capacity Credit to an ETH address, go [here](./delegate-a-credit).
:::

When making requests to the Lit network, you must provide [Session Signatures](../../../learn/authentication/session-sigs). When making requests to the network that require payment, you must also attach a _Capacity Delegation Auth Signature_ to your Session Signatures. This Auth Sig tells the Lit network which Capacity Credit to use for paying for your network usage, and also acts as proof that you have permission to use the Capacity Credit for payment.

This guide will demonstrate how to attach a Capacity Delegation Auth Signature to Session Signatures when making a request to a Lit network.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/capacity-credits/delegating/use-delegated-credit).
:::

## Prerequisites

- An understanding of [Session Signatures](../../../learn/authentication/session-sigs)
- An understanding of [Capacity Credits](../../../learn/paying-for-lit/capacity-credits) and what type of Lit network requests require payment
- A Capacity Delegation Auth Sig
    - If you don't have a Capacity Delegation Auth Sig, you can create one by following the instructions [here](./delegate-a-credit).

### Required Packages

- `@lit-protocol/constants`
- `@lit-protocol/lit-node-client`
- `@lit-protocol/auth-helpers`
- `ethers@v5`

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

## The Code Example

### Instantiating an Ethers Signer

This `ethersSigner` will be used to sign the Auth Sig as apart of generating the Session Signatures that the Capacity Delegation Auth Sig will be attached to.

The address corresponding to `process.env.ETHEREUM_PRIVATE_KEY` **needs** to be one of the addresses that the Capacity Delegation Auth Sig authorizes (i.e. the address was included in the `delegateeAddresses` array when the Capacity Delegation Auth Sig was created).

```ts
import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Instantiating a `LitNodeClient` Client

Next we'll instantiate and connect a `LitNodeClient` client specifying the Lit network the Capacity Credit Delegation Auth Sig was created for. In this case we'll be making a request to the [DatilTest](../../../learn/overview/how-it-works/lit-networks/testnets#the-datil-test-network) network.

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";

litNodeClient = new LitNodeClient({
    litNetwork: LIT_NETWORK.DatilTest,
    debug: false,
});
await litNodeClient.connect();
```

:::note
You can learn more about the `@lit-protocol/lit-node-client` package and what it offers using the [API reference docs](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html).
:::

### Generating Session Sigs with the Delegation Auth Sig

Using the [getSessionSigs](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html#getSessionSigs) method, we can generate Session Signatures that contain the Capacity Delegation Auth Sig:

```ts
const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    capabilityAuthSigs: [capacityDelegationAuthSig], // <--- Here is where we
    // attach the Capacity Delegation Auth Sig to the Session Signatures
    resourceAbilityRequests: [
    {
        resource: new LitActionResource("*"),
        ability: LIT_ABILITY.LitActionExecution,
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

This line from the above code is how we're specifying the Capacity Delegation Auth Sig (that's delegating credit usage to `ethersSigner.address`) to pay for our request later in this guide:

```ts
capabilityAuthSigs: [capacityDelegationAuthSig]
```

:::note
This guide assumes that you've already created a Capacity Delegation Auth Sig and assigned it to a variable with the name: `capacityDelegationAuthSig`.

If you don't have a Capacity Delegation Auth Sig, you can create one by following the instructions [here](./delegate-a-credit).
:::

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
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/capacity-credits/delegating/use-delegated-credit).
:::

This guide has demonstrated how to attach a Capacity Delegation Auth Signature to Session Signatures, and use those Session Signatures to make a request to the Lit network that requires payment.

## Next Steps
