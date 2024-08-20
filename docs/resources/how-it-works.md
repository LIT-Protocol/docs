---
sidebar_position: 1
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# How Does Lit Protocol Work

## Introduction

Lit Protocol combines cutting-edge cryptography, sealed confidential hardware, and peer-to-peer networking to provide builders in web3 with the ability to use cryptographic keys and perform private compute jobs. With Lit, developers can: 

1. Securely generate and manage non-custodial keys to build user wallets and signers. This enables you to seamlessly onboard users into your application without relying on a centralized custodian or dealing with the complexities of key management.
    - Example implementations: [PatchWallet](https://app.patchwallet.com/), [Silk](https://www.silk.sc/), [Collab.Land](https://www.collab.land/), [Tria](https://www.tria.so/), [Index Network](https://index.network/)

2. Perform data encryption and manage access to data with flexible access control rules and policies. 
    - Example implementations: [Fox](https://docs.verifymedia.com/publishing/access-control/methods/lit-protocol), [Terminal3](https://www.terminal3.io/), [Streamr](https://streamr.network/), [Cheqd](https://cheqd.io/), [Lens Protocol](https://www.lens.xyz/), [Gitcoin](https://publicgoods.network/)
        
3. Write and execute private and immutable functions for cross-chain messaging and transaction automation, enabling the development of protocols that have the ability to read and write data between blockchains.
    - Example implementations: [Event Listener](https://developer.litprotocol.com/v3/tools/event-listener), [Yacht Labs SDK](https://github.com/Yacht-Labs/yacht-lit-sdk)

4. Create data oracles that have the ability to fetch off-chain data for use in on-chain dApps.
    - Example implementations: coming soon.
    
5. Privacy-preserving and fully verifiable LLMs and AI agents.
    - Example implementations: coming soon.

6. And more…
    

To learn more about possible ways you can use Lit and to view additional implementation examples, check out the [use cases](../intro/usecases.md) section or follow the links below:

[Whitepaper](https://github.com/LIT-Protocol/whitepaper).   [Open Source Node Code](https://github.com/LIT-Protocol/Node).   [Audit reports](https://drive.google.com/drive/folders/1Rrht88iUkzpofwl1CvP9gEjqY60BKyFn?ref=spark.litprotocol.com).

Below, we will dive into Lit's core architecture and how things work under the hood:

## 1. Lit Nodes

Each Lit Node is a sealed encrypted virtual machine running on an independently operated server. The fact that each node is “sealed” means that neither the operator of the Lit Node, nor any other party, can access the interior of the processor.

Each Lit node contains a JavaScript execution environment ([Deno](https://deno.com/)) and key shares. Each key share corresponds to a key pair that is "shared" among all participating operators, created using [distributed key generation](https://docs.google.com/document/d/1eaSk6822d4B-bJtMiiGp4n9N4qZPnwWaEZOy-Xs8AK0/edit#heading=h.2q2y8wxw6nj8) (DKG), covered in more depth below.

### Threshold Keys and Distributed Key Generation

As introduced above, each Lit node collectively participates in a DKG to create new public/private key pairs where no one party ever holds the entire key. Instead, each node holds a **key share** which they use to sign and decrypt data with.

- **Network Consensus:** All operations (signing or decryption) are performed in parallel and require participation from two-thirds of network nodes to be executed.
- **Key Distribution:** No one node (or client) ever gains access to private keys in their entirety. Decryption and signing operations do not expose the underlying key.
- **Curve Flexibility:** The protocol supports multiple cryptographic curves and signature schemes, with the ability to add new ones to enable interoperability with a wide variety of protocols and standards.

### Sealed and Confidential Hardware

All Lit node operators run a bare metal install of [AMD’s SEV-SNP](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/solution-briefs/amd-secure-encrypted-virtualization-solution-brief.pdf), ensuring they never have access to any key shares directly, nor the computation processed inside of each node.

- **Trusted Execution Environment (TEE)**: SEV-SNP is an example of a TEE, which provides advanced hardware-level isolation for all network operations.
- **Code Immutability and Confidentiality:** Deployed programs within the TEE are immutable and private, preventing unauthorized changes and maintaining consistent operational integrity.

### JavaScript Execution Environment 

The JavaScript execution environment that is present in each Lit node enables developers to write immutable programs called [Lit Actions](https://developer.litprotocol.com/v3/sdk/serverless-signing/quick-start) that govern signing and encryption operations.  

## 2. The Lit Network

The Lit network is composed of a collection of Lit nodes. All nodes must stake tokens in order to participate in the “active” node operator set, providing crypto-economic security guarantees. 

Currently, the Lit network is in [Mainnet Beta](../network/migration-guide.md) and a test token is being used for staking. Current node operators include integration partners, project investors, and professional node operators. If you’re interested in becoming a node operator, please [reach out](https://docs.google.com/forms/d/e/1FAIpQLScBVsg-NhdMIC1H1mozh2zaVX0V4WtmEPSPrtmqVtnj_3qqNw/viewform).

### Node Operators

The full list of Datil node operators includes:

- Lit Protocol (our node)
- [Hypha](https://hypha.coop/?ref=spark.litprotocol.com)
- [Thunderhead](https://thunderhead.xyz/?ref=spark.litprotocol.com)
- [Terminal3](https://www.terminal3.io/?ref=spark.litprotocol.com)
- [Imperator](https://www.imperator.co/?ref=spark.litprotocol.com)
- [01node](https://01node.com/?ref=spark.litprotocol.com)
- [Cheqd](https://cheqd.io/?ref=spark.litprotocol.com)

The following operators will be joining the network after launch:

- [HireNodes](https://hirenodes.io/?ref=spark.litprotocol.com)
- [ETHGlobal](https://ethglobal.com/?ref=spark.litprotocol.com)
- [Zerion](https://zerion.io/?ref=spark.litprotocol.com)

### The Lit Protocol Token (LITKEY)

The Lit Protocol token, LITKEY, will be used by node operators to meet their staking requirement, as well as a reward token to pay node operators for their service.  Developers using Lit will also use the token to pay for transacting on the network.
    
:::info
The LITKEY token is NOT live, and currently a test token (tstLPX) is being used for staking and payment. The official LITKEY token will be released when the v1 network launches later this year. You can subscribe to updates [here](https://spark.litprotocol.com/).

If you're a developer building on Lit, test tokens can be claimed from the [verified faucet](https://chronicle-yellowstone-faucet.getlit.dev/).
:::
    

## Learn More

Learn more about how Lit Protocol works by checking out the resources below:

- About [user wallets](../user-wallets/overview.md).
- About [encryption and access control](../sdk/access-control/intro).
- About [decentralized compute](../sdk/serverless-signing/overview).

<FeedbackComponent/>
