---
sidebar_position: 2
---

# Introduction

:::note

Lit Actions and PKPs are still heavily in development and things may change.

**SDK DOCUMENTATION**
For the most up to date SDK documentation, check out the [Serrano branch SDK docs](https://serrano-sdk-docs.litprotocol.com/#welcome). For references to the Lit Actions functions which can be accessed inside a Lit Action via the `Lit.Actions` object, check out the [Lit Actions](http://actions-docs.litprotocol.com/) API docs.

Need some Polygon Mumbai Tokens to [mint](https://explorer.litprotocol.com/mint-pkp) a PKP? Fill out this [form](https://forms.gle/hcvh7VbS83DokBSE9).

:::


As a distributed key management network, Lit provides developers with the ability to add programmable signing to their applications and wallets. These distributed wallets are known as Programmable Key Pairs (PKP) and the application logic that dictates when and why that key-pair will sign is known as a Lit Action.


## Programmable Key Pairs (PKPs)

PKPs are public/private key-pairs generated in a process called Distributed Key Generation. This allows each node in the Lit network to custody a share of the underlying keypair. Currently, ownership of a given PKP is represented by the ownership of a NFT. Only those with authorized access (such as holding the PKP NFT) can sign or delegate signing to a Lit Action.

Development is underway to add support for additional authorization and authentication  methods, such as Google oAuth, Discord oAuth, and Apple Passkey. This will allow users to login to the decentralized Web with distributed multi-factor authentication, helping facilitate more seamless onboarding experiences for non crypto natives by abstracting away the complexities present in the current UX surrounding web3 wallets. You can learn more about these updates in the [docs](/SDK/Explanation/LitActions/authHelpers) or on our [blog](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/).


PKPs can also be used for additional use-cases beyond user wallets. For example, using a PKP as an immutable serverless signer that adheres to predefined rules (a Lit Action). 

Continue reading about PKPs [here](/coreConcepts/LitActionsAndPKPs/PKPs.md).

## Lit Actions

When someone holds a PKP, they can delegate the rights to sign via the wallet to some application logic, this logic is specified in a Lit Action. 

Lit Actions are immutable JavaScript programs that run across the network to sign data via a PKP. In this way they can be thought of as the permissionless rules that govern each PKP’s signing automation.
Actions are blockchain agnostic, giving them the inherent capacity to communicate data across blockchains. This facilitates interoperability between previously disconnected ecosystems.

They can also use off-chain data sources in their computation by making arbitrary [HTTP requests](/SDK/Explanation/LitActions/usingFetch). For example, calling an off-chain price feed (via API) for potential oracle or [conditional signing](/SDK/Explanation/LitActions/conditionalSigning) use cases.

Get started with Lit Actions [here](/coreConcepts/LitActionsAndPKPs/litActions.md).

## How do Lit Actions and PKPs work together?

A user can create a new PKP and grant a Lit Action the right to sign using it. This means the distributed key has the ability to sign and decrypt arbitrary data based on pre-defined logic and conditions.

## Why is this useful?

A programmable distributed key is a primitive with a number of potential use-cases. For example, using a PKP and Lit Actions for onboarding web2 users to wallets based on modern multi-factor authentication (that don’t rely on a central authority or key custodian). 

Additionally, Lit Actions + PKPs + web3 storage can be a replacement for a traditional web2 backend. Imagine a web3 Twitter clone that stores the data on Ceramic. You could create a PKP that owns a Ceramic stream, and then grant access to sign with that PKP to a group of Lit Actions for things like createPost() and likePost(). Your Lit Actions can work just like a web2 backend, with business logic to ensure that only correct data is written to your Ceramic Stream. For example, the likePost() function could check that a user has not already liked a post, and only write the like to the stream if they have not already liked it.

In web2, your backend has "god mode" access to the database. Using Lit and web3 storage like Ceramic, you can create Lit Actions that have "god mode" over a Ceramic stream, because the Lit Action has been granted the ability to sign with a PKP that owns the Ceramic stream. However, the Lit Action will only write to the stream according to the logic of the code inside it. This makes moving from a centralized web2 paradigm to a decentralized web3 paradigm much easier.


## How does network consensus work?

Each node only holds a share of the underlying key pair. These shares must be combined **above the threshold** to form the complete signature or decryption key. This threshold is set to **two thirds of the network**, meaning any signature generated or decryption key provisioned by Lit must have been authorized by at least two-thirds of the nodes.

The Lit network doesn't have a traditional consensus mechanism like most blockchains do. This two-thirds threshold is mathematically enforced by the threshold cryptography algorithms Lit uses and the authorizations from the nodes are collected either client side or by an application. Lit is stateless.


## State of the network today - Serrano Testnet

The Lit Actions and PKP network is in a testnet state. In this state, only the ability to generate a new PKP for ECDSA signatures has been implemented. The data on the Serrano Testnet is not persistent and may be erased at any time. 

We do not recommend storing anything of value on the Serrano Testnet.


## How can I know that a given PKP wasn't used to sign a bunch of stuff before it was granted approval to use a Lit Action? What is Mint/Grant/Burn?

Suppose you have a Lit Action that will check if a number is prime, and if it is, sign that number. If it is not prime, the Lit Action will abort. If you were able to mint a PKP, assign it to that Lit Action, and then burn the PKP in a single atomic transaction, then it would be provable that the PKP was not used to sign anything before it was approved to use the Lit Action. In this case, you  could trust that any numbers signed with that PKP are indeed prime, without needing to check them yourself. This creates a powerful way to prove the output of any JS code by checking that 1) the signature is valid, 2) the lit action code is correct, and 3) that the PKP was minted using this Mint/Grant/Burn pattern.

The function to do this is called Mint/Grant/Burn. You mint the PKP, grant access for a Lit Action to use it, and then burn the PKP in a single transaction. Burning the PKP destroys the ability to grant access for a Lit Action to use it, so you know that no other Lit Action can ever use that PKP.
 You can see the definition of a MintGrantBurn fuction in the contract source code [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPNFT.sol#L157)
