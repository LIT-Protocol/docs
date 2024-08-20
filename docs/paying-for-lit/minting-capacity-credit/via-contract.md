import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Via the Lit Contracts SDK

Capacity Credits can be minted by making requests to the NFT contract that is deployed on the [Chronicle Yellowstone](../../connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone.md) rollup blockchain. The following code will demonstrate how to connect to Chronicle Yellowstone via the Lit RPC URL, and send a transaction to the blockchain to mint a new Capacity Credit.

:::info
To learn more about what a Capacity Credit is, and how they're used, please go [here](../capacity-credits).

The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/paying-for-lit/nodejs/src/mintCapacityCredit.ts).
:::

## Prerequisites

Before continuing, you'll need access to an Ethereum wallet that has [Lit test tokens](../../connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone.md#tstlpx-test-token) on the Chronicle Yellowstone blockchain. If you don't already have tokens, you can request some using [the faucet](https://chronicle-yellowstone-faucet.getlit.dev/). The `tstLPX` test token will be sent to your wallet address, allowing you to perform transactions on the rollup.

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

### Instantiating an Ethers Signer

```ts
import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Instantiating a `LitContracts` Client

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNetwork } from "@lit-protocol/constants";

const litContractClient = new LitContracts({
    signer: ethersSigner,
    network: LitNetwork.DatilTest,
});
await litContractClient.connect();
```

You can learn more about the `@lit-protocol/contracts-sdk` package and what is offers using the [API reference docs](https://v6-api-doc-lit-js-sdk.vercel.app/modules/contracts_sdk_src.html).

## Minting a Capacity Credit

```ts
const capacityCreditInfo = await litContractClient.mintCapacityCreditsNFT({
    requestsPerKilosecond: 80,
    // requestsPerDay: 14400,
    // requestsPerSecond: 10,
    daysUntilUTCMidnightExpiration: 1,
});
```

### Parameters

When minting a credit, the following parameters are required:

#### `requestsPerX`

This parameter is the capacity you're reserving on the Lit network. This value is the maximum number of requests your Capacity Credit can be used for in a given day. Once your credit has been used for this number of requests, you will receive a Rate Limit error if it's used again before midnight UTC time.

For convenience, any one of the following properties can be used: 
  - `requestsPerKilosecond`
  - `requestsPerDay`
  - `requestsPerSecond`

#### `daysUntilUTCMidnightExpiration`

This parameter sets the date the Capacity Credit will expire. The credit expires at 12:00 AM (midnight) Coordinated Universal Time (UTC) on the specified date.

:::note
The actual expiration time in your local timezone may be different due to the UTC conversion. For example, if you're in New York (ET), a credit set to expire on June 1st will actually expire on May 31st at 8:00 PM ET.
:::

### Return Value

Calling `litContractClient.mintCapacityCreditsNFT` will create and sign a transaction to the Chronicle Yellowstone blockchain, paying for both the Capacity Credit and transaction gas in the Lit test token.

After the transaction is processed and included in a block, you will be returned the following Capacity Credit info:

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
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/paying-for-lit/nodejs/src/mintCapacityCredit.ts).
:::

After running the above code, you will have minted a new Capacity Credit that can be used to pay for usage of the Lit network. To learn more about how to use this credit for payment, please go [here](../delegating-credit.md).
