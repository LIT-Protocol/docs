---
slug: /what-is-lit
sidebar_position: 2
---

import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# What is Lit Protocol

<StateOfTheNetwork/>

Giving private keys or credentials to a server is a massive security responsibility. 

Lit Protocol is a decentralized key management network for programmable signing and encryption. The network empowers developers to create secure, decentralized applications that manage crypto assets, private data, and user authority seamlessly across platforms.



Lit’s threshold cryptography architecture ensures secrets remain verifiably secure and encrypted at the hardware level—while being fragmented and distributed across a decentralized network. For the first time, universal accounts can be programmed without trusting centralized custodians.
Using Lit’s SDK, developers can easily [encrypt data](../sdk/access-control/quick-start.md), [create and manage Web3 accounts](../user-wallets/overview.md), [generate digital signatures](../intro/first-request/making-first-signing.md), execute blockchain transactions, and implement virtually any signing or encryption operation.

Builders leverage these capabilities to develop immutable, interoperable, and user-owned apps, agents, and protocols. Existing ecosystem applications include AI-driven agents, cross-chain DeFi solutions, universal solvers, private user-controlled accounts, and decentralized data marketplaces.

Learn more about [How Lit Works](../resources/how-it-works.md).

Lit Protocol fills a missing layer of the Web3 “stack” by taking on secret management and making it into a computing primitive for builders with a fault-tolerant, and programmable network. Lit Protocol helps secure our digital interactions and data, facilitates greater interoperability between on and off-chain systems, and eliminates centralized points of control. 

[Make your first signing request](../intro/first-request/making-first-signing.md).

[Make your first decryption request](../intro/first-request/making-first-decryption.md).

## Use Cases
The programmable signing and encryption capabilities provided by the Lit network can be used by developers to support the following use cases.

:::note
For a more comprehensive list of example projects, check out the [Lit Ecosystem page](../../Ecosystem/projects). 
:::

**Universal Accounts**: Lit Protocol enables the creation of universal accounts that can operate seamlessly across any blockchain network, including Bitcoin, Ethereum, Solana, Cosmos, and beyond. The underlying private keys are managed by the decentralized Lit network, meaning these wallets are fully programmable and always non-custodial. Developers can use this to build user wallets, orchestrate liquidity across isolated networks, enable transaction automations (e.g. dollar-cost-averaging), and more.

Examples: [Emblem Vault](https://circuitsofvalue.com/), [CollabLand](https://collab.land/), [Genius](https://www.tradegenius.com/), [Tria](https://tria.so/), [Eco](https://eco.com/).

**Private Data**: The Lit network can be used to implement encryption and access control for any use case that demands privacy. Builders can use [access control conditions] to manage access rights for relevant stakeholders according to the policies you set. Think things like private data marketplaces, secure data sharing, sealed-bid auctions, locked NFTs with private content, and more.

Examples: [Verify (Fox Corp)](https://www.verifymedia.com/), [Streamr](https://streamr.network/), [Cheqd](https://cheqd.io/), [Index](https://index.network/).

**Agent Wallets**: [Vincent](https://docs.heyvincent.ai/) is a framework and open standard that enables the creation of autonomous, verifiable, and user-controlled agents. Built directly on top of Lit’s core infrastructure, Vincent enables agents to securely manage keys, sensitive data, and other secrets. Developers building agent runtimes and other agent-powered applications can use Vincent to manage their agents’ keys and create “tools” (using [Lit Actions](../sdk/serverless-signing/overview.md)) custom built for specific actions and operations (e.g. dollar-cost-averaging). 

For end users, Vincent serves as a marketplace for discovering these agentic apps and tools, while giving them the ability to set fine-grained permissions that govern the specific actions agents can take on their behalf when interacting with each (i.e. spending limits or time intervals for DCA).

[Get started building with Vincent](https://sdk-docs.heyvincent.ai/). 

**Multi-Party and Cross-Org Coordination**: Lit’s threshold cryptography allows multiple parties to share control over keys and secrets without ever handing trust to a single operator. This enables DAO treasuries, consortium agreements, corporate boards, and cross-organizational data sharing to coordinate securely and verifiably.

**Decentralized Identity & Authentication**: Developers can build authentication and access systems without relying on a central provider. Lit makes it possible to create portable, user-owned identities that work across apps and platforms, replacing siloed login systems.

**Custody-Resistant Secrets**: Enterprises can secure sensitive credentials (like API keys, medical records, or enterprise config secrets) with Lit. Recovery and continuity can be built in without any single custodian holding full control—reducing insider risk and improving compliance.

**Machine-to-Machine Trust**: Autonomous agents, IoT devices, and AI systems can use Lit to sign messages, prove identity, and encrypt traffic across owners and jurisdictions, enabling decentralized machine-to-machine economies.


## Community
Join the Lit developer community on [Discord](https://litgateway.com/discord) and [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) to stay up to date on the latest developments, troubleshoot errors, get technical support, and engage with fellow builders.

Stay informed by following Lit on [X](https://x.com/LitProtocol), and by reading the Lit [blog](https://spark.litprotocol.com/) for new product announcements, integrations, ecosystem updates, and insights into cryptography and Web3.
<FeedbackComponent/>
