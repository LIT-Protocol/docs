---
description: Learn how to delegate a capacity credit to an ETH address
sidebar_label: Delegate a Credit
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Delegating a Capacity Credit to an ETH Address

:::info
Capacity Credits are the form of payment for usage of the Lit network. They are required when making decryption requests, PKP signing requests, and when executing Lit Actions.

To learn more about what a Capacity Credit is, and how they're used, please go [here](../../../learn/paying-for-lit/capacity-credits).
:::

While credits are initially restricted to the account that minted them, you can delegate them to allow other Ethereum addresses to utilize your credits. This is particularly useful when building dApps where you want to cover the usage costs for your users.

To delegate a credit, you'll need to create a _Capacity Delegation Auth Sig_. This Auth Sig is used as proof that an address has authorization to use a specific Capacity Credit to pay for their requests to a Lit network.

This guide will demonstrate how to create a Capacity Delegation Auth Sig using the Lit Contracts SDK.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/capacity-credits/delegating/use-delegated-credit).
:::

## Prerequisites

- An Ethereum wallet with [Lit test tokens](../../../learn/overview/how-it-works/overview#the-lit-protocol-token) on the Chronicle Yellowstone blockchain
    - Test tokens can be obtained using the [faucet](https://chronicle-yellowstone-faucet.getlit.dev/)
- A Lit Capacity Credit
    - If you don't have a credit, you can mint one using the [Lit Explorer](./minting/via-lit-explorer.md) or the [Lit Contracts SDK](./minting/via-lit-contracts-sdk.md)

### Required Packages

- `@lit-protocol/constants`
- `@lit-protocol/lit-node-client`
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
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
ethers@v5
```

</TabItem>
</Tabs>

## The Code Example

### Instantiating an Ethers Signer

To delegate a Capacity Credit to another Ethereum address, you'll need to create a Capacity Delegation Auth Sig. The following code uses Ethers.js to create a signer from an Ethereum private key, but any other Ethereum wallet library can be used.

The address corresponding to `process.env.ETHEREUM_PRIVATE_KEY` **needs** to be the owner of the Capacity Credit. This wallet will be used to produce a [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) message that authorizes usage of the credit later in the guide.

```ts
import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Instantiating a `LitNodeClient` Client

Next we'll instantiate and connect a `LitNodeClient` client specifying the Lit network the Capacity Credit has been minted for. In this case we'll be delegating a credit that was minted for the [DatilTest](../../../learn/overview/how-it-works/lit-networks/testnets#the-datil-test-network) network.

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

## Generating the Capacity Delegation Auth Sig

On the instance of the `LitNodeClient` client, we can call the `createCapacityDelegationAuthSig` method to generate the Auth Sig. This method will create the ERC-5573 message based on the parameters you provide, sign it with the `dAppOwnerWallet`, and return an object containing the `capacityDelegationAuthSig`.

```ts
const { capacityDelegationAuthSig } =
    await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersSigner,
        capacityTokenId,
        delegateeAddresses: [delegateeAddress],
        uses: "1",
        expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    });
```

### Parameters

When calling `createCapacityDelegationAuthSig`, the following parameters are required:

#### `dAppOwnerWallet`

This is the Ethereum wallet that will be used to sign the ERC-5573 message. This wallet must be the owner of the Capacity Credit you're delegating.

#### `capacityTokenId`

This is the ID of the Capacity Credit you're delegating. This is returned to you as `capacityTokenId` when you minted the Capacity Credit.

:::note
You can find a list of Capacity Credits owned by your address by connecting your wallet to the Lit Explorer and navigating to the [Profile page](https://explorer.litprotocol.com/profile).
:::

#### `delegateeAddresses`

This is an array of Ethereum addresses you're delegating the Capacity Credit to.

#### `uses`

Specifies the total number of requests allowed across all delegated addresses. When this limit is reached, the Auth Sig becomes invalid for all delegatees. For example, with `uses: "10"`, if one address uses all 10 requests, no other delegated addresses can use the Auth Sig.

#### `expiration`

This parameter sets a time limit, represented as a UTC timestamp in seconds, for the Auth Sig. It specifies when the Auth Sig will become invalid and can no longer be used.

In the above code, this Auth Sig is being set to expire `10 minutes` after it's created.

### Return Value

`createCapacityDelegationAuthSig` will return an object with the `capacityDelegationAuthSig` property. This Auth Sig object is what you'll attach to your/your users' Session Signatures when making requests to a Lit network.

### Summary

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/capacity-credits/delegating/use-delegated-credit).
:::

After running the above code, you will have created a Capacity Delegation Auth Sig that can be used to pay for a Lit network request on behalf of the delegatee addresses.

## Next Steps

- Learn how to [use the Capacity Delegation Auth Sig](./use-delegated-credit) to pay for requests to a Lit network.
