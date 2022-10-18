---
sidebar_position: 4
---

# Lit Protocol Use Cases

## Introduction
Lit Protocol is a decentralized key management network that facilitates two main use cases: access control and compute — AKA “read” and “write”. Though distinct, these features work hand-in-hand and are powered by a single overarching primitive: [threshold cryptography](https://en.wikipedia.org/wiki/Threshold_cryptosystem). 

For a more in-depth explanation of how Lit works, check out our [Developer Docs](https://developer.litprotocol.com/).
## Access Control

Lit’s access control protocol runs atop most EVM chains, Cosmos, and Solana (you can view the full list of supported networks [here](https://developer.litprotocol.com/supportedChains)) and introduces private data to the open web. Using Lit, users can encrypt data behind [on-chain conditions](https://developer.litprotocol.com/accesscontrolconditions/evm/basicexamples/), such as the assets one holds in their wallet. When another user attempts to access this data, the Lit network will check that the required conditions have been met by requesting a wallet signature. If the’ve been met, the network will provision unique decryption key shares that can be combined client-side and used to access the locked content. You can read more about decentralized access control on our [blog](https://blog.litprotocol.com/?p=what-is-decentralized-access-control).

Some examples of applications that can (and have) been built harnessing this functionality:

### Web3 Apps with Private Data

Introduce privacy to decentralized applications. Use Lit to securely store private and permissioned data on the open web. To get started with an integration, use our JavaScript [SDK](https://developer.litprotocol.com/SDK/intro).

Examples:

- [Orbis Club](https://orbis.club/): Enabling “friends-only” content and encrypted messaging.
- [Gather](https://www.gather.town/): Powering private virtual spaces for your team.
- [Headline](https://viaheadline.xyz/): Publish exclusive content for your web3 community.
- [IPFS](https://litgateway.com/files): Encrypt content for private storage on IPFS.
- [WalletChat.fun](https://lit.walletchat.fun/): Encrypted wallet-to-wallet messaging.
- [Nowhere](https://www.urnowhere.com/): Token-gated metaverse spaces.

### Add Token Gating to Web2 Apps

Use on-chain credentials to gate access to your favorite web2 applications and data. 

- [Shopify](https://apps.shopify.com/lit-token-access): Blockchain-based access control for your online store.
- [Zoom](https://litgateway.com/apps/zoom): Token-gated Zoom calls.
- [Google Drive](https://litgateway.com/apps/google-drive): Add access control requirements to your Google Drive files.
- [WordPress](https://litgateway.com/apps/wordpress): Gate access to WordPress sites and pages.

### Unlockable NFTs

Using [HTML NFTs](https://developer.litprotocol.com/ToolsAndExamples/SDKExamples/HTMLNfts), you can create locked content that only owners of the NFT have access to. This includes dynamic content, like websites or metaverse spaces. 

Here’s an [example](https://twitter.com/LitProtocol/status/1504630741849853954) using our Lit Genesis Canvas NFT. Only holders can access the private canvas site linked within!

## Programmable Key Pairs

What if a smart contract could have it's own public and private keypair, just like any other wallet? And what if that smart contract had the ability to make arbitrary HTTP requests and use the data in its computation? Imagine smart contracts that can read and write from any HTTP endpoint, blockchain, state machine, or decentralized storage system.

We're building this at Lit: The smart contracts are Lit Actions and the keypairs they can use are PKPs.

You can read more about PKPs and Lit Actions in our [docs](https://developer.litprotocol.com/LitActionsAndPKPs/whatAreLitActionsAndPKPs#what-are-programmable-key-pairs-pkps), or check out our latest [announcement](https://twitter.com/LitProtocol/status/1572981766536790018?s=20&t=4lEfj2jDwUG8dzBjgT__GQ).

Below you will find some examples of projects that have been built using PKPs, as well as some other potential ideas and use cases. You can check out even more examples [here](https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/js-sdkTests).

### DeFi Automation

Use PKPs and Actions to automate your interactions across decentralized finance. 

- Condition-based transactions (ex. on-chain limit orders).
- Recurring payments.
- Liquid staking solutions.
- Frictionless transaction execution (signing abstraction).
- Vault applications for seamlessly trading asset “bundles”.

Example Projects:

- [Sling Protocol](https://github.com/Sling-Protocol/pkp-dex-sdk): An SDK for automating transactions on popular DEXs. Currently supports Uniswap V3 and 1inch.
- [Cask](https://www.cask.fi/): Automated, recurring payments.

### Infrastructure

Build powerful infrastructure that harnesses the power of Lit!

- Cross-chain bridges.
- Oracles for off-chain data.
- Event listening and condition-based execution.
- Privacy-preserving transactions.
- Decentralized key custodians.

Example Projects:

- Coming soon… 👀 —> [build with us](https://discord.com/invite/nm9aBG8z9w)!

### Web3 Social

Social applications that empower users with privacy and true data ownership.

- Credentialing systems for privacy-preserving web3 login.
- User owned social graphs.
- Account abstraction with support for web2 auth methods (i.e. Apple Passkey).
- Decentralized chat bots.
- Verifiable, on-chain reputation building.

Example Projects:

- [Ceramic Integration](https://github.com/LIT-Protocol/lit-action-ceramic-signing-demo): Write and permission access to your own private Ceramic data store.

### Gaming

Improve the state of web3 gaming.

- Signing and wallet abstraction for blockchain-based games.
- NPCs!
- Condition-based reward systems and achievements.
- Private data for multiplayer games.

### Misc

More ideas!

- A certification system utilizing [conditional signing](/coreConcepts/accessControl/EVM/customContractCalls).
- A blockchain.

### You can find even more examples, ideas, and resources [here](https://github.com/LIT-Protocol/awesome/blob/main/README.md).

### Have an idea for a project? [Get in touch](https://airtable.com/shr2NWJbH1Y6Y3kOU)!