---
description: Learn how to mint capacity credits via the Lit Explorer
sidebar_label: Via the Lit Contracts SDK
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Minting Capacity Credits via the Lit Contracts SDK

:::info
Capacity Credits are the form of payment for usage of the Lit network. They are required when making decryption requests, PKP signing requests, and when executing Lit Actions.

To learn more about what a Capacity Credit is, and how they're used, please go [here](../../../learn/paying-for-lit/capacity-credits).
:::

Capacity Credits can be minted by making requests to the NFT contract that is deployed on the [Chronicle Yellowstone](../../../learn/overview/how-it-works/lit-blockchains/chronicle-yellowstone) rollup blockchain. The following code will demonstrate how to connect to Chronicle Yellowstone via the Lit RPC URL, and send a transaction to the blockchain to mint a new Capacity Credit.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/capacity-credits/minting/via-contracts-sdk).
:::

## Prerequisites

- An Ethereum wallet with [Lit test tokens](../../../learn/overview/how-it-works/overview#the-lit-protocol-token) on the Chronicle Yellowstone blockchain
    - Test tokens can be obtained using the [faucet](https://chronicle-yellowstone-faucet.getlit.dev/)

### Required Packages

- `@lit-protocol/constants`
- `@lit-protocol/contracts-sdk`
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
@lit-protocol/contracts-sdk \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/constants \
@lit-protocol/contracts-sdk \
ethers@v5
```

</TabItem>
</Tabs>

## The Code Example

### Instantiating an Ethers Signer

To mint the Capacity Credit you'll need to sign a transaction with an Ethereum wallet that holds Lit test tokens. The following code uses Ethers.js to create a signer from an Ethereum private key, but any other Ethereum wallet library can be used.

Along with the private key, we'll also need to specify the RPC URL for the Chronicle Yellowstone network, so that the wallet knows which blockchain to send the transaction to.

```ts
import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Instantiating a `LitContracts` Client

Next we'll instantiate and connect a `LitContracts` client using the signer we created above, specifying the Lit network we'd like to mint the Capacity Credit for. In this case we'll be minting the credit to be used on the [DatilTest](../../../learn/overview/how-it-works/lit-networks/testnets#the-datil-test-network) network.

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LIT_NETWORK } from "@lit-protocol/constants";

const litContractClient = new LitContracts({
    signer: ethersSigner,
    network: LIT_NETWORK.DatilTest,
});
await litContractClient.connect();
```

:::note
You can learn more about the `@lit-protocol/contracts-sdk` package and what is offers using the [API reference docs](https://v7-api-doc-lit-js-sdk.vercel.app/classes/contracts_sdk_src.LitContracts.html).
:::

## Minting a Capacity Credit

On the instance of the `LitContracts` client, we can call the `mintCapacityCreditsNFT` method to mint a new Capacity Credit. Calling this method will create and sign a transaction to the Chronicle Yellowstone blockchain, paying for both the mint cost of the Capacity Credit and transaction gas in the Lit test token.

```ts
const capacityCreditInfo = await litContractClient.mintCapacityCreditsNFT({
    requestsPerKilosecond: 80,
    // requestsPerSecond: 10,
    // requestsPerDay: 14400,
    daysUntilUTCMidnightExpiration: 1,
});
```

### Parameters

When minting a credit, the following parameters are required:

#### `requestsPerX`

This parameter is the capacity you're reserving on the Lit network. This value is the maximum number of requests your Capacity Credit can be used for in a given day. Once your credit has been used for this number of requests, you will receive a Rate Limit error if it's used again before midnight UTC time.

For convenience, any one of the following properties can be used: 

- `requestsPerKilosecond`
- `requestsPerSecond`
- `requestsPerDay`

:::note
The Lit contracts SDK also contains several [helper methods](https://v7-api-doc-lit-js-sdk.vercel.app/modules/contracts_sdk_src.html) to convert between these different units.

For example, [requestsToDay](https://v7-api-doc-lit-js-sdk.vercel.app/functions/contracts_sdk_src.requestsToDay.html) will convert the number of requests per `second` or `kilosecond` to the equivalent number of requests per day.
:::

#### `daysUntilUTCMidnightExpiration`

This parameter sets the date the Capacity Credit will expire. The credit expires at `12:00 AM (midnight) Coordinated Universal Time (UTC)` on the specified date.

:::note
The actual expiration time in your local timezone may be different due to the UTC conversion.

For example, if you're in New York (ET), a credit set to expire on June 1st will actually expire on May 31st at 8:00 PM ET.
:::

### Return Value

After the transaction is processed and included in a block, you will be returned the following Capacity Credit object:

```
{
    rliTxHash: string;
    capacityTokenId: number;
    capacityTokenIdStr: string;
}
```

Where:

- `rliTxHash` Is the transaction hash of the transaction that minted the credit.
- `capacityTokenId` Is the generated ID for the new credit as a `number`.
- `capacityTokenIdStr` Is the generated ID for the new credit as a `string`.

You will use either `capacityTokenId` or `capacityTokenIdStr` to identify the Capacity Credit you would like use when paying for request to the Lit network.

## Summary

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/capacity-credits/minting/via-contracts-sdk).
:::

After running the above code, you will have minted a new Capacity Credit that can be used to pay for usage of the Lit network. The credit can be used `requestsPerX` numbers of times a day, and will expire `daysUntilUTCMidnightExpiration` days from now at `12:00 AM (midnight) Coordinated Universal Time (UTC)`.

## Next Steps

- If you want to allow others (such as your users) to use your minted capacity credits, you'll need to [delegate the credit](../delegating/to-an-eth-address) to them so that you can pay for their network usage on their behalf.
