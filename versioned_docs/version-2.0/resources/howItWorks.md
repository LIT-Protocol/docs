---
sidebar_position: 1
---

# How Does Lit Protocol Work

:::note

**FOR DEVELOPERS: SDK API DOCUMENTATION**

To start building on Lit based on your use case, check out the Lit SDK [here](../SDK/intro). For an in-depth understanding of the functionality provided, check out the [API docs](https://js-sdk.litprotocol.com/). 

For references to the Lit Actions functions which can be accessed inside a Lit Action via the `Lit.Actions` object, check out the [Lit Actions](http://actions-docs.litprotocol.com/) API docs.

:::

## Overview

At its core, Lit is an attempt to decentralize [public key cryptography](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/) through the use of secure [multi-party computation](https://en.wikipedia.org/wiki/Secure_multi-party_computation) and [threshold signature schemes](https://en.wikipedia.org/wiki/Threshold_cryptosystem) (MPC + TSS). When run across a distributed network of nodes (the “Lit Network”), the Lit software supports the secure management of persistent cryptographic keys for [signing](../pkp/intro), [encryption](../accessControl/intro), and [compute](../LitActions/intro).

Both MPC and TSS originate from the concepts of public key cryptography and extend their benefits to multi-party and decentralized environments, where the security and privacy of the private key material, data, and computation are critically important. These methods expand upon “traditional” public key infrastructure (PKI), removing the dependence on centralized key custodians, who exist as a single point of failure. This greatly reduces the attack vector for key compromise by distributing ownership among multiple parties, undermining the ability of a single entity to cause widespread harm. In order for an attacker to gain control, they would need to successfully gain control of more than the threshold of participating parties. In the Lit Network, this threshold is set to two-thirds, meaning participation from two-thirds of nodes is required for signing and encryption.

In the Lit Network, the nodes perform a [distributed key generation](../resources/glossary#distributed-key-generation) (DKG) to create new public/private key pairs where no one party ever holds the entire key. Instead, each node holds a key share which they can use to sign and decrypt data. The nodes perform each operation (signing or decryption) in parallel and the individual results are aggregated to form the complete signature or decryption key, without exposing the underlying private key itself. By distributing the key among multiple parties, the network becomes more robust and can continue to function even when multiple participating parties may be offline or possess malicious intent.

## Secure Encrypted Virtualization (SEV)

In addition to the security provided by the decentralized nature of MPC and TSS, Lit leverages AMD’s [Secure Encrypted Virtualization](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf) (SEV), providing advanced hardware-level protection and an additional layer of security.

SEV ensures that node operators never have access to any key shares directly, nor the computation processed inside of each node. This robust hardware-level isolation complements the decentralization of cryptographic operations and significantly reduces the risk of unauthorized access to sensitive information.

In the context user-facing operations — such as when key shares are provisioned for signing and decryption — nodes communicate via independent, encrypted channels. This means that shares are only ever exposed client-side at the exact moment of recombination.

We believe that the marriage of MPC, threshold signature schemes (TSS), and SEV provides end users with the most robustly secure and versatile custody solution currently available on the market today.


## How Lit Protocol works for:

## Access Control

Lit offers threshold encryption for regulating access to data stored on the Web through the use of condition-based access control. With Lit, both encryption and decryption happen client-side according to specific rules defined by the end user. These rules are known as [“Access Control Conditions”](../accessControl/EVM/basicExamples) which make use of on or off-chain data to define their parameters.

An example of an Access Control Condition that utilizes on-chain data is gating by token ownership, such as requiring that a user possesses a [specific NFT](../accessControl/EVM/basicExamples#must-posess-a-specific-erc721-token-nft) in order to decrypt your content. When a user requests access, each Lit node confirms that the required condition has been satisfied using the user's wallet signature to verify asset ownership. Once verified, each node supplies a decryption share. After accumulating more than two-thirds of these shares, the user can decrypt the content on their device.

As mentioned above, Access Control Conditions are not limited to "on-chain" data sources. Using JavaScript logic known as [Lit Actions](../accessControl/conditionTypes/litActionConditions), an identical process is supported using off-chain data as input. A simple example would be mandating that a user follows you on Twitter before granting permission to decrypt your content. The Twitter API could be utilized to feed this information into a Lit Action, which gets executed concurrently by each node. If more than two-thirds of nodes verify that the condition has been fulfilled (according to the Lit Action), the shares would be provided, and the content could be decrypted client-side.

This feature empowers individuals to securely store data on the open Web and offers organizations a convenient method for sharing and distributing content across entire communities. For instance, employing NFTs to designate roles and access levels within a DAO, or using token ownership to grant exclusive discounts to users on an e-commerce platform such as Shopify. The capacity to gate access based on any arbitrary data via Lit Actions expands these possibilities even further, allowing the creation of decryption rules based on any accessible state.

Lit exclusively manages and provisions decryption keys, remaining entirely impartial to the storage provider. This means that **Lit does not store any encrypted content directly**, and developers integrating this service can choose a storage provider of their preference. Options include blockchains like Ethereum, open storage networks such as [IPFS](https://spark.litprotocol.com/encrypttoipfs/) or [Ceramic](https://github.com/LIT-Protocol/CeramicIntegration), or centralized providers like AWS or Google Cloud.

The comprehensive process for encryption and decryption with Lit is as follows:

1. Alice begins by generating a symmetric key and encrypting some content with it.
2. Alice then encrypts the symmetric key using the Lit Network BLS key. Each node in the network holds a share of the BLS key. 
3. Alice specifies the conditions under which the content should be decrypted (access control conditions).
4. When Bob, a separate user, attempts to access the content encrypted by Alice, they send a request to each node in parallel so that the network can verify whether they meet the requisite conditions.
5. If the conditions are met, each node provisions a decryption share to Bob. Once Bob has aggregated more than two-thirds of the decryption shares, they can decrypt Alice's content on their device using the decrypted symmetric key.

![accessControl](/img/AccessControl.png)

## Decentralized Programmable Signing and MPC Wallets

In addition to access control, Lit provides distributed ECDSA key-pairs that can be used for programmable, [“smart” signing](../LitActions/workingWithActions/conditionalSigning) and a [MPC wallet](../pkp/usage) solution.

These distributed key pairs are known as [Programmable Key Pairs](../pkp/intro) (PKPs), and the code that dictates their signing and authentication logic is called a [Lit Action](../LitActions/intro.md). Lit Actions are JavaScript functions that can be made immutable by storing them on the InterPlanetary File System (IPFS). They can be thought of as the permissionless rules that govern each PKPs signing automation. Every Lit Action is blockchain agnostic and has the ability to use off-chain data in their computation by making HTTP requests. This gives them the inherent ability to read and write data across on and off-chain platforms, facilitating interoperability and automation between previously disconnected ecosystems.

Each PKP is a public/private key-pair generated by the Lit Network using Distributed Key Generation (DKG), meaning no one node ever has access to the entire private key. Instead, the private key is stored in shares across the network, where each node holds a single share. A PKP is represented as an ERC-721 NFT, and the [owner of the NFT](../pkp/minting) becomes the designated “controller” of the Programmable Key Pair. The controller has the ability to assign additional signing logic and [authentication](../pkp/authHelpers/overview.md) mechanisms to their PKP using Lit Actions.

### Smart Signing

Functionally, PKPs and Lit Actions introduce a capacity for developing distributed serverless functions that have the ability to sign data with their own private key. This can be used to facilitate complex, condition-based automation within and across decentralized applications, as well as to generate proofs for verifying data from arbitrary on or off-chain sources. A simple example would be a Lit Action and corresponding PKP that checks if a number is prime. The Lit Action will only return a signed response if the number is prime, kind of like a sort of prime number certification service. In this case, since the Lit Action is immutable, and every signature requires participation from at least two-thirds of nodes, there is a provable chain of trust. Instead of having to do the math to ensure a number is prime, you could simply use the number as an input in your Lit Action and use the signature as proof.

### MPC Wallets

Each PKP is functionally [a wallet](../pkp/usage), where the private key lives across the Lit Network. The two-thirds threshold requirement provides a level of censorship resistance and fault tolerance that “typical” 2-of-2 MPC designs do not. In addition to any 2-of-2 provider being able to deny the user access to their funds or censor transactions, most of these systems also require the end user to manage a key share (i.e the provider holds a share and the user holds the other share). This means the goal of a seamless, “web2” style onboarding UX without seed phrases or private key management is not possible, instead delivering the UX of self-custody with additional steps.

Lit Actions are used to handle each PKP’s [authentication logic](https://spark.litprotocol.com/how-authentication-works-with-pkps/). Authentication refers to the method used to communicate with and “control” the underlying key pair. As mentioned above, by default each key pair is controlled by the underlying blockchain account (“wallet”) who mints and holds the associated PKP NFT. But what about users who don’t already have a wallet and are attempting to onboard into the ecosystem for the first time? Lit has integrated several “web2” authentication methods to make this onboarding process seamless for the end user, including WebAuthn (Apple Passkey) and oAuth. These credentials can be harnessed as the mechanism(s) associated with ownership of the PKP, [linking familiar web2 accounts to the world of web3](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/).

The use of Lit Actions in the wallet context also provides users with the ability to define automated signing logic. For example, setting up an on-chain limit order for the assets held within the wallet, or configuring a [monthly dollar-cost average investment scheme](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/). Of course, this signing logic is arbitrary and can be customized based on the specific context and applications being used. 

![cloudSigning](/img/CloudSigning.png)


## Supported Chains

Lit is currently compatible with most EVM blockchains, Cosmos, and Solana. You can find the full list of supported chains [here](../resources/supportedChains).

## Getting Started

Learn more by checking out the [Lit blog.](https://spark.litprotocol.com/resources/)

Getting started with [access control and encryption.](../accessControl/intro)

Dive into programmatic signing with [PKPs and Lit Actions.](../pkp/intro)

Working with the [Lit SDK.](../SDK/Explanation/installation)
