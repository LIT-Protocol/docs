---
slug: /usecases
sidebar_position: 4
---

import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# Use Cases

<StateOfTheNetwork/>

Developers can leverage the Lit Network to build decentralized applications with programmable keys at their core. Possible use cases include:

### Decentralized Access Control

The Lit Network can be used to introduce private and permissioned data to the open web through [threshold encryption](../resources/how-it-works.md), addressing the “public-by-default” nature of blockchains and public storage networks like IPFS. 

Encrypting your data with Lit is simple and a completely [client-side operation](../sdk/access-control/encryption.md). In order to decrypt, users have to meet the ([access control conditions](../sdk/access-control/evm/basic-examples.md)) you set. Some possible use cases for decentralized access control include:

1. Encrypted wallet-based messaging: Secure wallet-to-wallet communication. [Examples](https://github.com/LIT-Protocol/awesome/blob/main/README.md).

2. User-owned social and identity graphs (“self-sovereign data”): Empower users with full control over how their data is managed on the Web. [Examples](https://github.com/LIT-Protocol/awesome/blob/main/README.md).

3. Credential-gated spaces: Use token and credential ownership as “keys” to accessing exclusive spaces, content, and experiences. [Examples](https://github.com/LIT-Protocol/awesome/blob/main/README.md).

4. Mempool encryption: This technique can be used to conceal transaction data from Searchers and Block Builders and mitigate the negative externalities of MEV. 

5. Private NFTs: Release NFTs with private embedded content that can only be accessed by the NFT owner themselves. 

6. Open data marketplaces: Open data marketplaces facilitate the exchange of data between individuals and organizations, allowing users to buy, sell, or share information in a permissioned yet transparent manner. These systems promote data-driven innovation by making diverse datasets accessible to researchers, developers, and businesses, while also providing data creators with full control over how their data is used and managed. [Examples](https://github.com/LIT-Protocol/awesome/blob/main/README.md).

### Programmable Signing and User Wallets

Interrelated but distinct from Lit’s decentralized encryption capabilities is the ability to generate programmable keys for non-custodial [user onboarding](../user-wallets/pkps/overview.md) and [serverless signing](../sdk/serverless-signing/overview.md). Some potential use cases include:

1. Event listening and condition-based transaction execution: Automate transactions with condition-based execution, enabling use cases such as on-chain limit orders, recurring payments, and more. [Example](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/).

2. Native cross-chain messaging and swaps: Transfer assets and data across blockchain networks without relying on a trusted intermediary or centralized asset bridge. [Example](https://spark.litprotocol.com/xchain-bridging-yacht-lit-swap/).

3. Seed-phraseless user onboarding and web2 authentication flows (such as SMS, Discord oAuth, Passkeys): Create easier onboarding experiences for non-crypto native users using familiar sign-on methods and session keys, while providing the full web3 capabilities of an EOA. [Examples](https://github.com/LIT-Protocol/awesome/blob/main/README.md?ref=spark.litprotocol.com#wallets-and-account-abstraction-aa).

4. Automated verifiable credential issuance: Automate credential issuance with programmable signing. [Example](https://spark.litprotocol.com/krebitxlitactions/).

5. Enterprise signed data applications: There are numerous use cases for cryptographically-verifiable “signed data” in institutional and enterprise environments, such as using digital signatures to authenticate and track goods in physical supply chains. 
Generating signed proofs over arbitrary Web data: Using digital signatures to verify the provenance and integrity of data sourced from various locations on the open web. [Example](https://spark.litprotocol.com/authenticity-matters/).

7. Backup, recovery, and progressive self custody for account abstraction (AA): Use Lit to configure robust backup and recovery solutions for AA wallets (such as multi-factor authentication or social recovery methods), helping users avoid the loss of access to their assets due to lost or compromised keys. [Get started](https://spark.litprotocol.com/mass-adoption-of-digital-ownership-and-progressive-self-custody/).

## Additional Resources

You can find even more examples, ideas, and resources [here](https://github.com/LIT-Protocol/awesome/blob/main/README.md).

Have an idea for a project? [Get in touch](https://forms.gle/jNsLvvwcySDprtAx7)!

<FeedbackComponent/>
