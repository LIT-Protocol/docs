import FeedbackComponent from "@site/src/pages/feedback.md";

# Decentralized Compute with Lit Actions

Lit Actions are immutable JavaScript programs that run on a decentralized Lit network. They enable powerful, blockchain-agnostic applications with built-in cryptographic capabilities like signing and encryption.

## What Makes Lit Actions Different

Lit Actions are a paradigm shift in decentralized computation, offering a flexible and powerful tool for creating sophisticated decentralized applications. Here's some of what makes them unique:

- **JavaScript-Based**: They're written in JavaScript, executed in a secure Deno environment, and support the importing of third-party libraries such as [ethers.js](https://github.com/ethers-io/ethers.js) and [@solana/web3.js](https://github.com/solana-labs/solana-web3.js).
- **Blockchain Agnostic**: Unlike traditional smart contracts, Lit Actions can interact with multiple blockchains, allowing for cross-chain applications and broader interoperability.
- **Off-Chain Capabilities**: Lit Actions can make HTTP requests and interact directly with off-chain APIs, eliminating the need for complex oracle systems.
- **Programmable Signing**: Through integration with [Programmable Key Pairs (PKPs)](../../user-wallets/pkps/overview.md), Lit Actions enable custom and automated, condition-based signing.
- **Decentralized Execution**: Lit Actions run on the distributed Lit Network, ensuring high availability and resistance to censorship.
- **Stateless but Stateful**: While Lit Actions themselves are stateless, they can interact with both on-chain and off-chain state, enabling new application designs not available using existing blockchains like Ethereum.

## Example Lit Action Implementation

To illustrate the power and flexibility of Lit Actions, let's consider a practical example:

 > A Lit Action that signs a transaction only if the reported temperature for a specific area is below a defined threshold.

###### How it would work:

1. The Lit Action fetches temperature data from three different weather APIs.
   - The choice of using three APIs is arbitrary, but demonstrates how data from multiple sources can be fetched from within a single Lit Action.
2. It calculates the average temperature from the these sources.
3. If the average temperature is below a predefined threshold, the Lit Action uses a [Programmable Key Pair (PKP)](../../user-wallets/pkps/overview.md) to sign a transaction that transfers tokens on a blockchain.
4. The signed transaction can be broadcasted to the blockchain network immediately, or returned for later submission.

###### This example showcases how Lit Actions can:

- Interact with on and off-chain APIs/RPCs
- Perform computations and make decisions using fetched data
- Use PKPs for [conditional signing](./conditional-signing.md)

## Use Cases

Below are a couple examples of how Lit Actions can be leveraged:

- **Cross-Chain DeFi:** Automate trades or manage portfolios across multiple blockchains.
- **Decentralized Access Control**: Create dynamic, condition-based access to digital assets or data.
- **Automated Governance**: Implement complex voting mechanisms or proposal execution across DAOs.
- **Decentralized Oracles**: Fetch, process, and provide verified off-chain data to smart contracts.
- **NFT Utilities**: Create dynamic NFT metadata or automate royalty distributions.
- **Privacy-Preserving Computations**: Perform computation without exposing sensitive data.

## Getting Started

You can create your first Lit Action by following this [Quick Start](../serverless-signing/quick-start.md) guide. Below, you'll find some additional resources and example implementations:

### Starter Examples

- [Conditional signing](../serverless-signing/conditional-signing.md): Return a signature when your pre-defined conditions are met.
- [Using fetch](../serverless-signing/fetch.md): Fetch data from other chains or off-chain sources in your Lit Action.
- [Access control](../access-control/lit-action-conditions.md): Create Lit Action Conditions to permit decryption using off-chain data. 
- [Importing dependencies](../serverless-signing/dependencies.md): Use external packages in your Lit Action.

### Advanced Examples

- [Combining signatures within a Lit Action](../serverless-signing/combining-signatures.md): Sign a message or transaction from within a Lit Action.
- [Decrypting within a Lit Action](../serverless-signing/combining-decryption-shares.md): Decrypt data for processing within a Lit Action.
- [Executing a Lit Action on a single node](../serverless-signing/run-once.md): Execute a Lit Action on a single node instead of across the entire network.
- [Broadcast and collect](../serverless-signing/broadcast-and-collect.md): Execute a Lit Action on each Lit node and aggregate their responses. Useful for performing operations over the return values, such as calculating an average or median. 

### Resources

- [Lit Actions API docs](https://actions-docs.litprotocol.com/): An overview of all available functionality offered by Lit Actions.
- [GetLit CLI](../../tools/getlit-cli.md): The GetLitCLI simplifies the Lit Action development process.
- [Event Listener](../../tools/event-listener.md): Use the Lit Event Listener to create event-based triggers for Lit Actions.
- [Developer Guides](https://github.com/LIT-Protocol/developer-guides-code/tree/master): Quick examples to get you started. 

<FeedbackComponent/>
