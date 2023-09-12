---
sidebar_position: 1
---

# Decentralized Access Control

## Overview

Lit Protocol provides developers with a decentralized access control layer that can be used to [encrypt](../sdk/access-control/encryption#technical-walkthrough) content for private and permissioned storage on the open Web. Lit provides utilities (via the Lit SDK) for encrypting and decrypting content client-side, while [access control conditions (ACCs)](../sdk/access-control/evm/basic-examples) are used to define who (or under what conditions) the data can be decrypted.

Both on and [off-chain data](../sdk/access-control/condition-types/lit-action-conditions) can be used to define these access control conditions, with examples including locking content behind:

- [Membership within a particular DAO](../sdk/access-control/evm/basic-examples#must-be-a-member-of-a-dao-molochdaov21-also-supports-daohaus)
- Ownership of a particular [ERC-721](../sdk/access-control/evm/basic-examples#must-posess-a-specific-erc721-token-nft) or [ERC-20](../sdk/access-control/evm/basic-examples#must-posess-at-least-one-erc20-token) token
- The result of [any smart contract call](../sdk/access-control/evm/custom-contract-calls)
- The result of [any API call](../sdk/access-control/condition-types/lit-action-conditions), such as a follow on Twitter

To get started building with these tools right away, check out the [SDK install guide](../sdk/installation). Otherwise, keep reading to get a better understanding of why encryption is so important, how it works at a high level, and potential ways Lit’s tooling can be implemented in the real world!

## Introduction to Encryption

Encryption is one of the two core ‘applications’ of [public key cryptography](https://www-ee.stanford.edu/~hellman/publications/24.pdf) (the other being digital signatures). A fundamental building block of modern security infrastructure on the Internet, public key cryptography plays a pivotal role in enabling secure communication, preserving data integrity, and facilitating trust in our digital interactions online. Where digital signatures can be used to authenticate the integrity of a particular message or input, encryption can be used to facilitate secure and privacy-preserving communication between multiple parties. 

Fundamentally, encryption is the process of transforming some plaintext data into ciphertext using a specialized algorithm. This renders the content unreadable and indistinguishable from random text to anyone without the proper decryption key.

Encryption involves the following steps:

1. The sender obtains the recipient's public key.
2. The sender encrypts the message using the recipient's public key.
3. The recipient receives the encrypted message and decrypts it using their private key.

## Exploring Decentralized Access Control with Lit

Lit’s threshold encryption network can be used to introduce ***private and permissioned*** data to a host of application categories, specifically by offering a solution to the “public-by-default” nature of blockchains and public storage networks. The Lit software can be applied generally, agnostic to the storage provider and desired use case. Lit provides the capacity for assigning arbitrary logic (“access control conditions”) for condition-based access control and encryption. Some possible use cases for this functionality include:

1. **Encrypted wallet-based messaging**: Secure wallet-to-wallet communication without relying on a centralized key custodian.
2. **User-owned social and identity graphs (“self-sovereign data”)**: Empower users with full control over how their personal data is managed on the Web, shifting power away from centralized corporations to individuals.
3. **Credential-gated spaces**: Use token and credential ownership as “keys” to accessing exclusive spaces, content, and experiences, introducing additional utility for digital assets.
4. **Mempool encryption**: This technique can be used to conceal transaction data from Searchers and Block Builders and mitigate the negative externalities of MEV.
5. **Private NFTs**: Release NFTs with private embedded content that can only be accessed by the NFT owner themselves.
6. **Open data marketplaces**: Open data marketplaces facilitate the exchange of data between individuals and organizations, allowing users to buy, sell, or share information in a secure and transparent manner. These systems promote data-driven innovation by making diverse datasets accessible to researchers, developers, and businesses, while also providing data creators with the opportunity to monetize their own content.
7. **Backup and recovery for private key material**: Use Lit to configure robust backup and recovery solutions for private key material (such as multi-factor authentication or social recovery methods), helping users avoid the catastrophic loss of access to their assets due to lost or compromised keys.

## Getting Started and Further Reading

Some links to further reading and resources to help you get started building on the Lit network today:

- Getting started with the [Lit SDK](../sdk/installation)
- [Access Control with Lit](../sdk/access-control/encryption)
- The [Lit Learning Lab](/learningLab/intro-to-lit/acc)
- Projects building [privacy and encryption tooling](https://github.com/LIT-Protocol/awesome/tree/main#privacy-and-encryption)
