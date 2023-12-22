# Overview

:::note
💡 Lit Actions are still heavily in development and things may change. We're grateful for [feedback](https://forms.gle/4UJNRcQspZyvsTHt8) on how to improve the docs and examples!

For an in-depth review of the functionality provided by the Lit Actions SDK, take a look at the [API docs](https://actions-docs.litprotocol.com/).
:::

## Quick Start

1. Guide: [Getting Started](../serverless-signing/quick-start.md)
2. Tool: [GetLit CLI](https://developer.litprotocol.com/v3/tools/getlit-cli)
3. Example: [Fetching Off-Chain Data in a Lit Action](../serverless-signing/fetch.md)
4. Example: [Conditional Signing with Lit Actions](../serverless-signing/conditional-signing.md)
3. Example: [Using Mint/Grant/Burn](https://github.com/LIT-Protocol/js-sdk/blob/70a041a97b56ba1a75724ba2cd56952b622e8a7f/packages/contracts-sdk/src/abis/PKPNFT.ts#L376): Use the Mint/Grant/Burn function in the Lit `contracts-sdk` to atomically assign a Lit Action(s) to a PKP. The PKP will only return a signed response if the function you've declared in your Lit Action returns 'true'. Learn more about minting PKPs [here](../wallets/minting.md).


### Overview

Blockchains like Ethereum have smart contracts that let developers encode logic to change that state. As a key management network, Lit provides a method that allows developers to encode logic that dictates signing.

Severless signing (AKA Lit Actions), are JavaScript programs that can be used to specify signing and authentication logic for Programmable Key Pairs (PKPs). When used in conjunction with PKPs, Lit Actions are serverless functions with their own private key-pair that can be used to write data to blockchains and other state machines.

A simple example is a Lit Action and associated PKP that checks if a number is prime. The PKP gets [atomically](https://github.com/LIT-Protocol/js-sdk/blob/70a041a97b56ba1a75724ba2cd56952b622e8a7f/packages/contracts-sdk/src/abis/PKPNFT.ts#L376) assigned to the Lit Action, only returning a signature if the required conditions are met (in this case, if a prime number is inputted). Each node will execute the Lit Action in parallel and verify that it meets the required conditions. If it does, each node independently provisions a signing share to the requesting client. Only after more than two-thirds of these shares have been collected is  the complete signature returned.

### Features

1. [Blockchain Agnostic](../../resources/supported-chains.md): Lit Actions can be used to write data to and across any supported blockchain and state machine using PKPs.
2. Immutable: Once a Lit Action has been published, it cannot be modified, just like a smart contract deployed on-chain. The [Mint/Grant/Burn](https://github.com/LIT-Protocol/js-sdk/blob/70a041a97b56ba1a75724ba2cd56952b622e8a7f/packages/contracts-sdk/src/abis/PKPNFT.ts#L376) function allows you to atomically link a PKP to an authorized set of Lit Actions, guaranteeing that a particular PKP can only ever be used to sign data from within the approved set.
3. Off-Chain Compatibility: Lit Actions can pull in data from off-chain sources natively, without requiring the use of a third party oracle.

### Use Cases

- [Generating proofs](../serverless-signing/conditional-signing)
- [Condition-based execution](../../tools/event-listener)
- [Looking up permitted actions, addresses and auth methods associated with a PKP](../wallets/auth-methods/#example-setting-auth-context-with-lit-actions)
- [Checking access control conditions](../access-control/lit-action-conditions)
- [Fetching off-chain data](../serverless-signing/fetch)


### Examples

1. [Executing a trade on Uniswap](https://github.com/LIT-Protocol/lit-apps/blob/master/packages/lit-actions/src/to-be-converted/wip-swap.action.mjs?ref=spark.litprotocol.com)
2. [Fetching off-chain price data](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/#how-it-works)