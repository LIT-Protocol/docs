---
sidebar_position: 2
---

# Introduction
Lit Protocol is a decentralized key management network powered by [threshold cryptography](/Introduction/howItWorks.md). A **blockchain-agnostic** middleware layer, Lit can be used to read and write data between blockchains and off-chain platforms, powering conditional decryption and programmatic signing.


## Decentralized Cryptography

On a fundamental level, Lit is an attempt to decentralize [public key cryptography](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/). First introduced by three researchers at Stanford University in the [1970s](https://pet3rpan.medium.com/history-of-things-before-bitcoin-cryptocurrency-part-one-e199f02ca380), public key cryptography is the technology that underpins cryptocurrency and most of the security infrastructure on the Internet today. 

Public key cryptography allows you to do two main things: 

1. Encrypt information so that it can only be accessed by authorized parties (encryption and access control).
2. Sign (write) data to blockchains, databases, storage networks, and other state machines (digital signatures).

### Encryption

[Encryption](https://www.cloudflare.com/learning/ssl/what-is-encryption/) is the process of encoding data so that it remains hidden or inaccessible to unauthorized parties, the core technology that enables privacy on the open web. 

### Signing

Every time you interact with a blockchain — whether it be selling some ETH, listing an NFT, or claiming an in-game item — you must **sign** the transaction. Just like a signature in the physical world, this digital signature provides “proof” that some interaction took place — a verifiable snapshot of history at a given point in time. 

## Core Functionality

As a protocol, Lit can be harnessed to build applications that leverage public key cryptography at their core, powering two main “buckets” of functionality:

### Encryption and Access Control

Lit Protocol offers a decentralized access control protocol compatible with most EVM chains, Cosmos chains and the Solana ecosystem. With Lit, you can harness on-chain access control conditions to:

- Let Alice encrypt data client side and let Bob decrypt data client side based on Alice’s rules (such as ownership over a certain NFT or token), without using a central authority to provision a decryption key to Bob.
- Request a network signed JWT that provisions access to dynamic content based on any on-chain condition.
With this functionality, Lit Protocol enables the storage of private data on the open web, facilitating interoperability and portability between previously disconnected users, applications and ecosystems.

You can get started with encryption and access control [here](/coreConcepts/accessControl/intro.md).

### Decentralized Programmatic Signing

Lit’s access control feature gives individuals the ability to read private data from the dWeb based on on-chain conditions. But this is only one half of the equation. What about writing data?
To facilitate signing (aka writing data to blockchains) Lit provides two interrelated services: Programmable Key Pairs (PKPs) and Lit Actions . 


PKPs are cryptographic keypairs  generated collectively by participating validators, stored as key shares distributed across the Lit network. Ownership of a PKP is represented by minting an NFT. Only those with authorized access can sign with the PKP.

Like their name suggests, PKPs are programmable. The programs that dictate when, why, and what a PKP will sign are called Lit Actions. These Actions are immutable JavaScript functions stored on IPFS. Actions can be thought of as smart contracts with superpowers: they can initiate the signing of a transaction and use off-chain data in their computation.

When these components work together, they have the power to facilitate complex signing  automation. What if you could “tell” your wallet to execute a trade when your token fell below a specified price? Or to automatically list your NFT when the collection hits a certain floor price? Or what if you wanted to use off-chain or cross-chain data as a “trigger” to execute functionality within your decentralized application? With PKPs and Lit Actions, these use cases become possible.

PKPs don’t just have to represent a user’s wallet either, these tools can also be harnessed within the context of proof generation. Conditional-based signing through Lit Actions opens up the possibility of verifying data from arbitrary sources, such as an off-chain API or cross-chain application. For example, writing a Lit Action that fetches data from a weather API and only returns a signature when the temperature is above 60 degrees fahrenheit. If the signature is returned, you have “proof” that the temperature was in fact above the temp specified. Get started with proofs [here](/SDK/Explanation/LitActions/conditionalSigning). 

Keep reading about PKPs and Lit Actions [here](/coreConcepts/LitActionsAndPKPs/intro.md).

## What can you build with Lit?

Lit infrastructure can be used to support an entire host of web3 applications. Here are some examples:

### DeFi

- Condition-based transaction execution (ex. on-chain limit orders).
- Automated, recurring payments.
- Liquid staking solutions.
- Frictionless transaction execution (signing abstraction).
- Vault applications for seamlessly trading asset “bundles”.

### Infrastructure

- Cross-chain bridges.
- Oracles for off-chain data.
- Event listening and condition-based execution.
- Privacy-preserving transactions.
- Decentralized key custodians.

### Web3 Social

- Private data for social apps.
- Credentialing systems for privacy-preserving web3 login.
- User owned social graphs.
- Account abstraction with support for web2 auth methods (i.e. Apple Passkey).
- Decentralized chat bots.
- Verifiable, on-chain reputation building.

### Gaming

- Signing and wallet abstraction for blockchain-based games.
- Condition-based reward systems and achievements.
- Private data for multiplayer games.

### Unlockable NFTs

Using [HTML NFTs](/ToolsAndExamples/SDKExamples/HTMLNfts.md), you can create locked content that only owners of the NFT have access to. This includes dynamic content, like websites or metaverse spaces. 

Here’s an [example](https://twitter.com/LitProtocol/status/1504630741849853954) using our Lit Genesis Canvas NFT. Only holders can access the private canvas site linked within!

### Add Token Gating to Web2 Apps

- [Shopify](https://apps.shopify.com/lit-token-access): Blockchain-based access control for your online store.
- [Zoom](https://litgateway.com/apps/zoom): Token-gated Zoom calls.
- [Google Drive](https://litgateway.com/apps/google-drive): Add access control requirements to your Google Drive files.
- [WordPress](https://litgateway.com/apps/wordpress): Gate access to WordPress sites and pages.

### More Ideas

- A certification system utilizing [conditional signing](/SDK/Explanation/LitActions/conditionalSigning).
- A blockchain.

To read about more examples, take a look at our [use cases](/coreConcepts/usecases.md) page. You can also explore some of the projects that have been built with Lit [here](/ecosystem/projects).

## Join the Community

[Discord](https://litgateway.com/discord) is the home base for our Developer Ecosystem. Join us to stay up to date on the latest developments, ask questions and get programming support, and engage with the wider community!

Follow us on [Twitter](https://twitter.com/LitProtocol) for updates.

Read our [blog](https://blog.litprotocol.com/) and subscribe to our monthly [newsletter](https://litproject.substack.com/) for news and announcements on the state of Lit Protocol.

Subscribe to our [community calendar](https://calendar.google.com/calendar/u/5?cid=Y19hMnVxZDNjaHVqZ2Q0a3FqbGlvcDdxY2JhMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t) for events, hackathons, and other ways to meet the Lit team.

Have an idea for a project or currently building? Take a look at our [Ecosystem RFPs](https://www.notion.so/Lit-Request-for-Ecosystem-Proposals-ae3f31e7f32c413cbe0b36c2fe53378d) and apply for a [grant](https://github.com/LIT-Protocol/LitGrants).
