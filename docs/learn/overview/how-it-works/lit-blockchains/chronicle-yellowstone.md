
import FeedbackComponent from "@site/src/pages/feedback.md";

import AddRollupButton from "@site/src/components/AddRollupButtonYellowstone";

# Chronicle Yellowstone

Chronicle Yellowstone is Lit Protocol's custom EVM rollup, superseding the [Chronicle](./chronicle.md) blockchain. It provides a more performant and stable backend for Lit's infrastructure.

<AddRollupButton />

## About Chronicle Yellowstone

Chronicle Yellowstone is a custom EVM rollup built using [Arbitrum Orbit](https://arbitrum.io/orbit), designed specifically for Lit Protocol. This rollup is the primary platform for:

- Coordination
- Minting and Managing [PKPs (Programmable Key Pairs)](../../../signing-data/pkps)
- Minting and Managing [Payment for usage of the network](../../../paying-for-lit/overview)

:::note
PKPs minted on Chronicle Yellowstone can still sign transactions on any chain supported by Lit, including EVM-compatible chains, Solana, and Bitcoin.
:::

## `tstLPX` Test Token

The `tstLPX` test token serves as the gas token for transactions on Chronicle Yellowstone. Please note that this is a test token with no real-world value, intended exclusively for testing and development on the Lit Protocol platform.

To obtain the `tstLPX` test token:

- **Use the [Faucet](https://chronicle-yellowstone-faucet.getlit.dev/):** The `tstLPX` test token will be sent to your wallet address, allowing you to perform transactions on the rollup.

**Note:** You must have the `tstLPX` test token in your wallet when minting a PKP or a [Capacity Credit](../../../paying-for-lit/capacity-credits), as it is used to pay the gas cost.

Keep in mind that the official Lit Protocol token is scheduled to launch in the future. This will be the actual token with real-world utility within the ecosystem.

## Connecting to Chronicle Yellowstone

To connect to Chronicle Yellowstone, you can:

- Click the Button: <AddRollupButton />
- Manually Add the Network Parameters:

| Parameter Name     | Value                                             |
|--------------------|---------------------------------------------------|
| **Chain ID**       | `175188`                                          |
| **Name**           | `Chronicle Yellowstone - Lit Protocol Testnet`    |
| **RPC URL**        | `https://yellowstone-rpc.litprotocol.com/`        |
| **Block Explorer** | `https://yellowstone-explorer.litprotocol.com/`   |
| **Currency Symbol**| `tstLPX`                                          |
| **Currency Decimals** | `18`                                           |

:::note
Additional chain information is available [here](https://app.conduit.xyz/published/view/chronicle-yellowstone-testnet-9qgmzfcohk).
:::

## Block Explorer

A block explorer is available for Chronicle Yellowstone, providing valuable insights into the network. You can access it [here](https://yellowstone-explorer.litprotocol.com/). The explorer allows you to track transactions, addresses, and other essential data on the rollup.

## Special Features

Chronicle Yellowstone includes BLS12-381 precompiles, allowing you to verify BLS signatures on-chain. This feature is not part of Ethereum yet and is exclusive to Chronicle Yellowstone.

<FeedbackComponent/>
