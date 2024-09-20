import FeedbackComponent from "@site/src/pages/feedback.md";

import AddRollupButton from "@site/src/components/AddRollupButton";

# Chronicle

:::warning
With the release of [Chronicle Yellowstone](./chronicle-yellowstone.md), Chronicle is being deprecated and **should no longer be used**.

Please refer to the [Migrating to Datil](../lit-networks/migrating-to-datil.md) guide if you need to migrate your application to Chronicle Yellowstone.
:::

Chronicle is Lit Protocol's custom EVM rollup testnet, which enhances the performance and scalability of our programmable decentralized threshold cryptography system.

<AddRollupButton />

## About Chronicle

Chronicle is a custom EVM rollup testnet based on the **OP Stack**, designed specifically for Lit Protocol. Anchored to the Polygon network, this rollup is the primary platform for:

- Coordination
- Minting and Managing [PKPs (Programmable Key Pairs)](../../../signing-data/pkps)
- Minting and Managing [Payment for usage of the network](../../../paying-for-lit/overview)

:::note
PKPs minted on Chronicle Yellowstone can still sign transactions on any chain supported by Lit, including EVM-compatible chains, Solana, and Bitcoin.
:::

## `tstLIT` Test Token

The `tstLIT` test token serves as the gas token for transactions on Chronicle. Please note that this is a test token with no real-world value, intended exclusively for testing and development on the Lit Protocol platform.

To obtain the `tstLIT` test token:

- **Use the [Faucet](https://chronicle-yellowstone-faucet.getlit.dev/):** The `tstLIT` test token will be sent to your wallet address, allowing you to perform transactions on the rollup.

**Note:** You must have the `tstLIT` test token in your wallet when minting a PKP, as it is used to pay the gas cost.

Keep in mind that the official Lit Protocol token is scheduled to launch in the future. This will be the actual token with real-world utility within the ecosystem.

## Connecting to Chronicle

To connect to Chronicle, you can:

- Click the Button: <AddRollupButton />
- Manually Add the Network Parameters:

| Parameter Name     | Value                                            |
|--------------------|--------------------------------------------------|
| **Chain ID**       | `175177`                                         |
| **Name**           | `Chronicle - Lit Protocol Testnet`               |
| **RPC URL**        | `https://chain-rpc.litprotocol.com/replica-http` |
| **Block Explorer** | `https://chain.litprotocol.com/`                 |
| **Currency Symbol**| `tstLIT`                                         |
| **Currency Decimals** | `18`                                          |

## Block Explorer

A block explorer is available for Chronicle, providing valuable insights into the network. You can access it [here](https://chain.litprotocol.com/). The explorer allows you to track transactions, addresses, and other essential data on the rollup.

## Special Features

Chronicle includes **BLS12-381 precompiles**, which means you can verify BLS signatures on-chain. This feature is not part of Ethereum yet and is exclusive to Chronicle.

<FeedbackComponent/>
