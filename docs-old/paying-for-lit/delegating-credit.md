import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Delegating a Credit

To use a Capacity Credit to pay for usage of the Lit network, you need to create a *Capacity Delegation Auth Sig*. This Auth Sig is used as proof you have authorization to use a specific Capacity Credit to pay for requests to the Lit network like: signing using a PKP, decrypting data, and executing a Lit Action.

:::info
To learn more about what a Capacity Credit is, and how they're used, please go [here](./capacity-credits).

For an overview of what requests to the Lit network require payment, go [here](./overview.md#overview-of-what-requires-payment).
:::

As we'll see later in the guide, these Auth Sigs are scoped to specific addresses and will be used to delegate usage of the credit to both yourself and your users to pay for network usage.

The guide will demonstrate how to produce the Capacity Delegation Auth Sig. To learn how to use the Auth Sig, go [here](./using-delegated-auth-sig.md).

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/paying-for-lit/nodejs/src/delegateCapacityCredit.ts).
:::

## Prerequisites

Before continuing, you'll need to have minted a Capacity Credit. This can be done by following these guides:

:::note
In order to delegate usage of the Capacity Credit, you'll need to be able to generate a signature from the Ethereum account that minted the credit.
:::

- [Minting via the NFT contract](./minting-capacity-credit/via-contract.md)
- [Minting via the Lit Explorer](./minting-capacity-credit/via-explorer.md)

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
The address corresponding to `process.env.ETHEREUM_PRIVATE_KEY` **needs** to be the owner of the Capacity Credit. This wallet will be used to produce a [ERC-5573 SIWE](https://eips.ethereum.org/EIPS/eip-5573) message that authorizes usage of the credit later in the guide.
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

## Generating the Capacity Delegation Auth Sig

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

#### `dAppOwnerWallet`

This parameter is a [SignerLike](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.SignerLike.html) object (for this guide it's an instance of `ethers.Wallet`) that will be used to sign the ERC-5573 SIWE message that authorizes `delegateeAddresses` to use the Capacity Credit. The Ethereum address of the signer **must** own the Capacity Credit to delegate usage of it.

#### `capacityTokenId`

This parameter is the token ID of the Capacity Credit you're delegating usage of.

#### `delegateeAddresses`

This is an array of Ethereum address that you're authorizing usage of the Capacity Credit to. If you're trying to use the Capacity Credit to pay for your own network usage, you would add your address in this array.

#### `uses`

This parameter sets the total number of times the Auth Sig can be used to pay for network usage across all addresses listed in `delegateeAddresses`. Once the total `uses` is exhausted, the Auth Sig becomes invalid for payment by any delegated address. For example, if `uses` is set to `10` and one delegated address consumes all `10` uses, the Auth Sig can no longer be used for payment by any other delegated addresses.

#### `expiration`

This parameter sets a time limit, represented as a UTC timestamp in seconds, for the Auth Sig. It specifies when the Auth Sig will become invalid and can no longer be used.

In the above code, this Auth Sig is being set to expire `10 minutes` after it's created.

### Return Value

Calling `litNodeClient.createCapacityDelegationAuthSig` will create a ERC-5573 SIWE message and sign it using `dAppOwnerWallet`. The object returned by this function contains the Capacity Delegation Auth Sig that can be used to pay for requests to the Lit network.

## Summary

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/paying-for-lit/nodejs/src/delegateCapacityCredit.ts).
:::

After running the above code, you will have created a Capacity Delegation Auth Sig that authorizes use of a specific Capacity Credit to a specific set of addresses with restrictions. For an example of using the Auth Sig, go [here](./using-delegated-auth-sig.md).
