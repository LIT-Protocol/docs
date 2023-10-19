# Overview

:::note
💡 Lit Actions are still heavily in development and things may change. We're grateful for [feedback](https://forms.gle/4UJNRcQspZyvsTHt8) on how to improve the docs and examples!

For an in-depth review of the functionality provided by the Lit Actions SDK, take a look at our [API docs](https://actions-docs.litprotocol.com/).
:::

## Quick Start

1. Guide: [Getting Started](../serverless-signing/quick-start.md)
2. Tool: [GetLit CLI](https://developer.litprotocol.com/v3/tools/getlit-cli)
3. Example: [Fetching Off-Chain Data in a Lit Action](../serverless-signing/fetch.md)
4. Example: [Conditional Signing with Lit Actions](../serverless-signing/conditional-signing.md)

### Overview

Blockchains like Ethereum have smart contracts that let developers encode logic to change that state. As a key management network, Lit provides a method for allowing developers to encode logic that dictate signing.

Severless signing or what we’ll refer to as Lit Actions are JavaScript programs that can be used to specify signing and authentication logic for programmable key pairs (PKPs). When used in conjunction with PKPs, Lit Actions are serverless functions with their own private key-pair. Together these tools can be used to write data to blockchains and other state machines.

A trivial example would be a Lit Action and associated PKP that checks if a number is prime, only returning a signature if the number is prime. Each node will execute the Lit Action with a submitted input and verify that it meets the required conditions. If it does, the node will provision an independent signing share. Only after more than two-thirds of these shares have been collected can the complete signature be formed.

### Features

1. [Blockchain Agnostic](../../resources/supported-chains.md): Lit Actions can be used to write data to blockchains using PKPs.
2. Immutable: Once a Lit Action has been published, just like a blockchain smart contract - it cannot be modified. Using Mint/Grant/Burn, you can atomically link a PKP to an authorized set of Lit Actions. This method guarantees that a particular PKP can only ever be used to sign data from within the approved set.
3. Off-Chain Compatibility: Lit Actions can pull in data from off-chain sources natively, without requiring the use of a third party oracle.

### Use Cases

**Ideal use cases**

- Generating proofs
- Looking up permitted actions, addresses and auth methods associated with a PKP
- Checking access control conditions with conditional signing

**Not Recommended Use Cases**

- POST request that inserts a new SQL row (if not called in single execution, the Lit Action will be executed by every node in parallel, you will end up with n number of rows, where n is no less than two-thirds the number of total nodes in the Lit network)
- ETH RPC calls
- Sending a transaction that needs an external API call (the API call will be sent n times, where n is no less than two-thirds the number of total nodes in the Lit network)

### Examples

1. [Executing a trade on Uniswap](https://github.com/LIT-Protocol/lit-apps/blob/master/packages/lit-actions/src/to-be-converted/wip-swap.action.mjs?ref=spark.litprotocol.com)
2. [Fetching off-chain price data](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/#how-it-works)
