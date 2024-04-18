---
sidebar_position: 1
---

# Introduction to Encryption/Decryption

:::info
[Habanero Mainnet](../../network/networks/mainnet) and [Manzano Testnet](../../network/networks/testnet) are now live. Check out the [docs on migration](../../network/migration-guide) to learn how you can start building on Habanero and Manzano today. 
:::

## Overview

You can use Lit for decentralized encryption with your storage provider of choice. With Lit, you can encrypt content client-side and define [access control conditions](../access-control/condition-types/unified-access-control-conditions) (ACCs) to provision access rights to users who meet the conditions you set.

Lit supports the use of both on and [off-chain data](../access-control/lit-action-conditions) when defining ACCs, examples including locking content behind:

- [Membership within a particular DAO](../access-control/evm/basic-examples#must-be-a-member-of-a-dao-molochdaov21-also-supports-daohaus)
- Ownership of a particular [ERC-721](../access-control/evm/basic-examples#must-posess-any-token-in-an-erc721-collection-nft-collection) or [ERC-20](../access-control/evm/basic-examples#must-posess-at-least-one-erc20-token) token
- The result of [any smart contract call](../access-control/evm/custom-contract-calls)
- The result of [any API call](../access-control/lit-action-conditions), such as a follow on Twitter

## Features

1. Access Control Conditions can be defined using state from most EVM chains, Cosmos, and Solana.. View the full list [here](../../resources/supported-chains.md).
2. AND + OR operators ([boolean logic](../access-control/condition-types/boolean-logic)) can be used to combine any of the supported conditions listed above.
3. Storage provider of choice: use your preferred storage solution, including [IPFS](https://spark.litprotocol.com/encrypttoipfs/), Arweave, Ceramic, or even a centralized provider, like AWS.

## Resources

Learn how you can integrate decentralized access control with Lit into your own product:

1. [Quick Start Guide](../access-control/quick-start.md)
2. [Storing Private Data on ComposeDB](../../integrations/storage/ceramic-example.md)
3. [Encrypting Data on Arweave Using Lit and Irys](../../integrations/storage/irys.md) 
4. [Basic EVM Conditions](../access-control/evm/basic-examples)
5. [Access Control Using Off-Chain Inputs](../access-control/lit-action-conditions)

## Examples and Use Cases

1. [Private data](https://docs.lens.xyz/docs/gated) for web3 social
2. [Token-gated video](https://github.com/suhailkakar/livepeer-token-gated-vod) streaming
3. [Encrypted token metadata](https://spark.litprotocol.com/semantic/)
4. [Persistent and private data marketplaces](https://blog.streamr.network/streamr-integrates-lit-protocol/)
5. [Decentralized content discovery](https://spark.litprotocol.com/decentralized-content-discovery-with-lit-and-index/)