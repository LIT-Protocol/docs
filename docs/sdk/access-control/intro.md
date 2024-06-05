---
sidebar_position: 1
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Encryption and Access Control

:::info
The [Habanero Mainnet](../../network/networks/mainnet) and [Manzano Testnet](../../network/networks/testnet) are now live. Check out the [docs on migration](../../network/migration-guide) to learn how you can start building on Habanero and Manzano today. 
:::

## Introduction

You can use Lit for encryption to store data privately on the open web. The Lit network uses an identity-based encryption scheme, which means that decryption is only permitted to those who satisfy a certain pre-determined identity parameter.

Each Lit node holds a share of a shared BLS key. The signature from this BLS key serves as the decryption key for a particular set of [Access Control Conditions](../access-control/evm/basic-examples.md) and private data. The user will only be able to decrypt the data if they can prove that they satisfy the corresponding conditions.

Lit's encryption scheme is highly efficient, as encryption is entirely a client-side operation. Only one round of network interactivity (between the Lit nodes) is required for decryption in order to request the signature shares and assemble a decryption key.

The identity-based encryption scheme necessitates the construction of an identity parameter, and it is this parameter that the BLS network is producing signature shares over. In order to prevent the same network signature (decryption key) to be used for multiple distinct ciphertexts, we choose this identity parameter to be a combination of the hash of the Access Control Conditions and the hash of the private data itself.

## Overview

Here is a high-level, step-by-step breakdown of the encryption and decryption process with Lit:

### Encryption
1. Alice starts by creating an Access Control Condition(s) and combines it with her private data to construct the identity parameter.
2. Alice encrypts the private data and the identity parameter using the public key of the shared Lit BLS key to get a ciphertext.
3. Alice stores the encryption metadata - the set of Access Control Conditions, hash of the private data etc. - and the ciphertext wherever she wants (for example, IPFS or Ceramic).

### Decryption
1. Bob fetches the ciphertext and corresponding encryption metadata from the public data store.
2. Bob presents the encryption metadata to the BLS network and requests for signature shares over the identity parameter.
3. The Lit nodes check whether the user satisfies the Access Control Conditions before signing the constructed identity parameter.
4. Bob assembles the signature shares into a decryption key and successfully decrypts the ciphertext.

## Features and Examples

### Features

- Use state from most EVM chains, Cosmos, and Solana to create your conditions. Check out the full list of supported chains [here](../../resources/supported-chains.md).
- Use AND + OR operators ([boolean logic](../access-control/condition-types/boolean-logic)) can be used to combine any of the supported conditions listed above.
- Lit works with any storage provider, which means you can use your preferred storage solution, such as IPFS, Arweave, Ceramic, or even a centralized provider, like AWS.

### Examples

Lit supports the use of both on and [off-chain data](../access-control/lit-action-conditions.md) when creating Access Control Conditions. Some examples include:

- [Membership within a particular DAO](../access-control/evm/basic-examples#must-be-a-member-of-a-dao-molochdaov21-also-supports-daohaus)
- Ownership of a particular [ERC-721](../access-control/evm/basic-examples#must-posess-any-token-in-an-erc721-collection-nft-collection) or [ERC-20](../access-control/evm/basic-examples#must-posess-at-least-one-erc20-token) token
- The result of [any smart contract call](../access-control/evm/custom-contract-calls)
- The result of [any API call](../access-control/lit-action-conditions), such as a follow on Twitter

## Getting Started

You can get started with encryption following this [quick start](../access-control/quick-start.md) guide. Below, you'll find some additional resources and example implementations:

1. [Storing Private Data on ComposeDB](../../integrations/storage/ceramic-example.md)
2. [Encrypting Data on Arweave Using Lit and Irys](../../integrations/storage/irys.md) 
3. [Basic EVM Conditions](../access-control/evm/basic-examples)
4. [Access Control Using Off-Chain Inputs](../access-control/lit-action-conditions)

<FeedbackComponent/>
