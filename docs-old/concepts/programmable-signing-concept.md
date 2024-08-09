---
sidebar_position: 2
---

import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# Decentralized Compute with Lit Actions

<StateOfTheNetwork/>

## Overview

With the Lit network, you can generate decentralized key pairs for signing and encryption. Associated with these signing keys is the ability to create powerful serverless functions and condition-based signing automations using Lit Actions. Written in JavaScript, Lit Actions allow you to define the rules and logic PKPs should follow when signing data. These rules are:


1. [Blockchain Agnostic](../resources/supported-chains#programmable-key-pairs): Define signing automations on any blockchain or state machine that is supported by Lit. Currently, the Lit [SDK](../sdk/installation) provides easy-to-use methods for creating wallets and signing transactions on EVM and Cosmos-based chains.
2. Programmable: Program signing based on pre-defined conditions, referred to as [conditional signatures](../sdk/serverless-signing/conditional-signing.md) in the docs. This is useful for creating [DeFi automations](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/), handling [authentication](../sdk/wallets/auth-methods) logic, and generating [proofs](https://spark.litprotocol.com/authenticity-matters/) over off-chain data.

To get started building with these tools right away, check out the [Lit Actions](../sdk/serverless-signing/overview) page. Otherwise, keep reading to get a better understanding of how serverless signing works and potential ways to implement in the real world.

## Introduction to Digital Signatures

Another core application of [public key cryptography](https://en.wikipedia.org/wiki/Public_key_infrastructure), digital signatures provide a secure means of verifying the authenticity and integrity of data produced on the web. A signature created with a private key can be mathematically verified against the associated public key, providing a high probability that the signed data is in fact authentic and hasn’t been tampered with.

Digital signatures also make up a key aspect of the account and transaction logic used by blockchains and other distributed systems. Your wallet (AKA your private key) allows you to create and send transactions. Every time you send some tokens on Ethereum or post a message on Orbis, the action is signed before being sent on-chain. 

## Programmable Signatures with Lit

Use serverless signing for:

1. **Event listening and condition-based transaction execution**: Automate your interactions with blockchain ecosystems using condition-based execution, enabling use cases such as on-chain limit orders or recurring payments that don’t require manual input (i.e. signing off on the transaction) from the end user.
2. **Native cross-chain messaging and swaps**: Seamlessly transfer assets and data across blockchain networks without relying on a trusted intermediary or centralized asset bridge.
3. **Automated verifiable credential issuance**: Verifiable credentials are digital certifications attesting to particular user attributes or qualifications. Using condition-based signing, automate the issuance of these credentials and eliminate the possibility of fraud or human error.
4. **Enterprise “signed data” applications**: There are numerous use cases for cryptographically-verifiable “signed data” in institutional and enterprise environments, such as using digital signatures to authenticate and track goods in physical supply chains.
5. **Generating signed proofs over arbitrary Web data**: Using digital signatures to verify the provenance and integrity of data sourced from various locations on the open Web.
6. **Trustless vault applications**: Each PKP is represented by an ERC-721 token on the blockchain (explored in more detail in subsequent sections). This means that any assets sent to the PKP can be traded or sold in a single transaction by selling the NFT that controls the underlying key pair. This facilitates potential trustless “vault” applications where an array of assets may be managed together according to the rules associated with the PKP itself.
7. **Authentication for AI generated content**: A registry of identities and associated keys (which do the signing) in order to verify who made a given claim is neither ideal for privacy nor in line with the way that people use the Web. Threshold signing offers a unique solution to the data integrity problem, distributing trust among a set of parties to act as a “signer of last resort”.

## Getting Started and Further Reading

Some links to help you get started building with serverless signing:

- Overview of [serverless signing](../sdk/serverless-signing/overview)
- Getting started with the [Lit SDK](../sdk/installation)
- The [Lit Learning Lab](/learningLab/intro-to-lit/prog-signing)
- [Projects building with Lit](https://github.com/LIT-Protocol/awesome/tree/main#projects-and-integrations)

<FeedbackComponent/>
