import FeedbackComponent from "@site/src/pages/feedback.md";

# Decentralized Compute with Lit Actions

:::info
**STATE OF THE NETWORK**

Using Lit Actions in production IS now supported on the [Habanero Mainnet](../../network/networks/mainnet) and [Manzano Testnet](../../network/networks/testnet). Check out the [docs on migration](../../network/migration-guide) to learn how you can start building on Habanero today. 

:::

## Introduction

Blockchains like Ethereum have smart contracts that let developers encode logic to change state. With Lit, you can encode logic that governs signing and encryption. 

This logic is encoded using a Lit Action, an immutable JavaScript program that can be "assigned" to the key pairs generated on Lit and used to dictate how they are used.

A simple example would be a Lit Action that checks if a number is prime. To start, you would generate a [Programmable Key Pair](../wallets/intro.md) and assign it to your Lit Action so that it could use it to produce a signature. This signature would only be returned if the conditions defined within your Lit Action were met. In this case, the Lit Action would verify that the input was indeed a prime number. Every Lit node would execute your program independently and provision their key share down to the requesting client. Only after more than two-thirds of these shares have been collected can the complete signature be formed. You can read more about how Lit works [here](../../resources/how-it-works.md).

## Features and Examples

### Features

- **[Blockchain Agnostic](../../resources/supported-chains.md)**: Lit Actions can be used to read and write data to or even between blockchains with Programmable Key Pairs
- **Immutable**: Once a Lit Action has been published, it cannot be modified, just like a smart contract deployed on a blockchain. The [Mint/Grant/Burn](https://github.com/LIT-Protocol/js-sdk/blob/70a041a97b56ba1a75724ba2cd56952b622e8a7f/packages/contracts-sdk/src/abis/PKPNFT.ts#L376) function allows you to atomically link a PKP to an authorized set of Lit Actions, guaranteeing that a particular PKP can only ever be used to sign data from within the approved set.
- **Off-Chain Compatibility**: You can make arbitrary HTTP requests from a Lit Action, meaning you can pull in data from off-chain sources natively, without needing to use of a third party oracle.

### Examples

- [Conditional signing](../serverless-signing/conditional-signing.md): Return a signature when your pre-defined conditions are met.
- [Using fetch](../serverless-signing/fetch.md): Fetch data from other chains or off-chain sources in your Lit Action.
- [Access control](../access-control/lit-action-conditions.md): Create Lit Action Conditions to permit decryption using off-chain data. 
- [Importing dependencies](../serverless-signing/dependencies.md): Use external packages in your Lit Action.

## Getting Started

You can create your first Lit Action by following this [quick start](../serverless-signing/quick-start.md) guide. Below, you'll find some additional resources and example implementations:

1. [GetLit CLI](../../tools/getlit-cli.md): The GetLitCLI simplifies the Lit Action development process.
2. [Event Listener](../../tools/event-listener.md): Use the Lit Event Listener to create event-based triggers for Lit Actions.
3. [DeFi Automation](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/): Check out this example of using Lit Actions to automate portfolio rebalancing on Uniswap.

<FeedbackComponent/>
