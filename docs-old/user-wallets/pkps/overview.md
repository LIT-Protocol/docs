import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Overview

Programmable Key Pairs (PKPs) are ECDSA public/private key pairs created by the Lit network using Distributed Key Generation (DKG). Each Lit node holds a share of the private key, and more than two-thirds of these shares must be collected to execute a given action (i.e. signing a transaction).

PKPs can be programmed with custom logic to automate on-chain actions and implement sophisticated access control. They can be used to create non-custodial wallets, automate transactions, and build complex decentralized applications.

Please refer to the [Quick Start Guide](./quick-start.md) for how to get started with PKPs.

## Key Features

- **Distributed Security**: No single point of failure in key management.
- **Programmable Logic**: Automate on-chain actions with custom logic.
- **Flexible Permissions**: Implement sophisticated access rules for key usage.
- **Non-Custodial**: Users maintain control over their assets without managing private keys directly, and don't have to trust any single party to manage keys for them.

## How it Works

### Key Generation and Storage

PKPs are created using Distributed Key Generation (DKG) across the Lit network. This process ensures that the private key is never assembled in one place, and is instead split into shares with each node in the Lit network holding a share. Consequently, no single entity, including Lit Protocol itself, has access to the full private key. The public key, however, is publicly available and can be used to derive the corresponding blockchain address.

### Signing Process

When a signing operation is requested, a Lit node client sends the request to the Lit network where nodes holding key shares participate in a threshold signing process. Each Lit node is then tasked with providing their signature share of the data using their respective PKP key share. Once more than two-thirds of the Lit nodes respond, the signature shares are combined resulting in a complete signature of the data you requested be signed by the PKP.

This threshold signing process ensures that the full private key is never reconstructed at any point, maintaining security while producing a signature with the PKP.

### Programmability and Key Management

A key feature of PKPs is their programmability through [Lit Actions](../../sdk/serverless-signing/overview.md), which are JavaScript scripts that define the conditions and logic for key usage. This programmability enables several advanced capabilities such as:

- **Transaction Automation:** PKPs can be programmed to automatically sign and execute transactions based on various conditions, streamlining complex on-chain operations.
- **Conditional Signatures:** Implement custom logic for when and how a PKP can sign transactions, based on various on-chain and off-chain factors.
**- Off-chain Data Attestation:** Use PKPs to cryptographically sign and attest to off-chain data, allowing for the secure integration of real-world information into blockchain systems.
- **Sophisticated Permission Systems:** Define granular and context aware permissions for key usage, allowing for fine-tuned control over who can use the PKP, and under what circumstances.

The flexibility of Lit Actions, being JavaScript-based, allows you to create complex and tailored solutions for managing and utilizing PKPs for you application.

### Interoperability and Upgradability

PKPs are designed with interoperability in mind, capable of interacting with various blockchains and Web3 protocols. This makes them suitable for executing cross-chain operations and implementing [chain abstraction](https://blockworks.co/news/definitive-guide-chain-abstraction). Furthermore, the logic associated with PKPs (in the form of Lit Actions) can be updated without changing the key pair itself, allowing for evolving functionality.

By leveraging these features, PKPs enable you to create sophisticated, secure, and user-friendly blockchain applications with programmable, non-custodial key management. This approach opens up new possibilities for decentralized applications, automated transactions, and complex on-chain logic execution.

## Use Cases

- Building non-custodial wallets with improved user experience
- Automating recurring transactions or complex DeFi strategies
- Implementing multi-factor authentication for blockchain applications
- Creating decentralized identity solutions

For more detailed information on creating and using PKPs, please refer to the [Quick Start Guide](./quick-start.md).
