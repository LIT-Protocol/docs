import FeedbackComponent from "@site/src/pages/feedback.md";

import AddRollupButton from "@site/src/components/AddRollupButtonYellowstone";

# Chronicle Yellowstone

Chronicle Yellowstone is Lit Protocol's custom EVM rollup which is superseding the [Chronicle](./chronicle.md) blockchain, allowing for a more performant and stable backend for Lit's infrastructure.

<AddRollupButton />

## About Chronicle Yellowstone

Chronicle Yellowstone is a custom EVM rollup using [Arbitrum Orbit](https://arbitrum.io/orbit), designed specifically for Lit Protocol. This rollup is the primary platform for coordination, minting PKPs (programmable key pairs), and managing PKP Permissions. Note that PKPs minted on Chronicle Yellowstone can still sign transactions on any chain supported by Lit, including EVM, Cosmos, and Bitcoin.

## `tstLPX` Test Token

The `tstLPX` test token serves as the gas for transactions on Chronicle Yellowstone. Please note that this is a test token with no real-world value. Its purpose is exclusively for testing and development on the Lit Protocol platform.

To obtain the `tstLPX` test token, please use [the faucet](https://chronicle-yellowstone-faucet.getlit.dev/). The `tstLPX` test token will be sent to your wallet address, allowing you to perform transactions on the rollup.

Keep in mind that the official Lit Protocol token is scheduled to launch sometime in the future. This will be the actual token with real-world utility within the ecosystem.

## Connecting to Chronicle Yellowstone

To connect to Chronicle Yellowstone, you can click <AddRollupButton /> or manually add the network parameters below:

:::note
The below and additional chain facts are available [here](https://app.conduit.xyz/published/view/chronicle-yellowstone-testnet-9qgmzfcohk).
:::

| Parameter Name     | Value                                              |
|--------------------|----------------------------------------------------|
| Chain ID           | 175188                                             |
| Name               | Chronicle Yellowstone - Lit Protocol Testnet       |
| RPC URL            | https://yellowstone-rpc.litprotocol.com/           |
| Block Explorer URL | https://yellowstone-explorer.litprotocol.com/      |
| Currency Symbol    | tstLPX                                             |
| Currency Decimals  | 18                                                 |

**Note** You must have the `tstLPX` test token in your wallet when minting a pkp, as it is used to pay the gas cost.

## Block Explorer

A block explorer is available for Chronicle Yellowstone, providing valuable insights into the network. You can access it [here](https://yellowstone-explorer.litprotocol.com/). The explorer allows you to track transactions, addresses, and other essential data on the rollup.

## Special Features

Chronicle Yellowstone includes BLS 12-381 precompiles, which means you can verify BLS signatures on-chain. This feature is not part of Ethereum yet and is only available on Chronicle Yellowstone.

## Next Steps

Now that you've learned about Chronicle Yellowstone, you can write your first Lit Action that uses a PKP to sign! Learn how to do that [here](../../sdk/serverless-signing/conditional-signing).

<FeedbackComponent/>
