---
sidebar_position: 1
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# How Does Lit Protocol Work

## Overview
Lit Protocol is a decentralized and programmable key management network for signing and encryption. The network is composed of a decentralized set of independent nodes, each running inside of a sealed Trusted Execution Environment (TEE). Within the TEE each node contains a unique set of key shares alongside a JavaScript execution environment. Each individual key share corresponds to a certain threshold signing or encryption key, each managed collectively by all of the nodes participating in the network.

Developers can write immutable JS functions (called [Lit Actions](../sdk/serverless-signing/overview.md)) that dictate how the keys managed by the network are used. This includes creating transaction automations, spending policies, access control rules, and more. These Lit Action functions inherit the same threshold and TEE-based security assumptions as the rest of the network as they are executed within the JS execution environment present in each node.

## Managing Keys and Other Secrets
Each Lit Protocol node participates in a Distributed Key Generation (DKG) process to create new public/private key pairs where no one party ever holds the entire key. Instead, each node holds a key share used to perform its portion of signing and decryption operations in parallel with the rest of the network. All operations require participation from more than two-thirds of the network to be executed. At no point during signing or decryption is the underlying private key exposed to any single node or requesting client.

The Lit network supports multiple cryptographic curves, signing schemes, and key types. Additional curves and schemes can be added as desired to enable additional interoperability with a wide variety of protocols and standards.

## Policy Enforcement and Data Orchestration – Lit Actions
Each Lit node contains a JavaScript execution environment which allows developers to write arbitrary code that dictates how the secrets and keys managed by the network are used. These programs are called [Lit Actions](../sdk/serverless-signing/overview.md), immutable JS serverless functions that govern signing and encryption / decryption operations. Lit Actions can natively fetch and process data from any on or off-chain source, be used to create complex transaction automations (e.g. dollar-cost-averaging), define rules for usage and access, create spending policies, trigger signature generation, and more. 

## Further Reading
For an in-depth overview of how Lit keeps keys and assets secure, please check out the [security](../security/introduction.md) section.
<FeedbackComponent/>
