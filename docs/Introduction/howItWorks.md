---
sidebar_position: 3
---

# How does Lit Protocol work?

## Introduction

The Lit network is made up of a decentralized* federation of nodes, each playing a vital role in key generation, consensus, and the execution of Lit Actions (Javascript smart contracts that can utilize on or off-chain data in their computation). Lit is **not a blockchain** but instead can be defined as a middleware service that has the capacity to read and write data between blockchains and other distributed systems and state machines.

## Threshold Cryptography

Lit is powered by **threshold cryptography**. This implies that no one node ever holds “executive authority”. Instead, participation from a pre-defined *threshold* of nodes must be reached. 

In the context of the Lit network, threshold cryptography is used to generate ***shares*** of a new public/private key pair in a process called [Distributed Key Generation](https://en.wikipedia.org/wiki/Distributed_key_generation). This means that the private key of this key pair **never exists in its entirety**, ever. 

Instead, each node holds a **private key share**, which they can use to both sign and decrypt data, just like a regular old private key. The key (no pun intended) difference is that someone needs to combine the resulting signature or decryption shares from all the nodes, **above the threshold**, to get the final signature or decrypted content.  We currently set the threshold to two-thirds, so if there are 100 nodes in the Lit network, then you would need to request decryption or signature shares from at least 67 of them. Because of this, a single private key share is useless on its own, and the ownership of the private key itself is decentralized across the nodes.

It is important to note that all operations are done inside of a secure, black-box environment, meaning node operators and other external "agents" have no access to thes key shares contained within. In the context user-facing operations (such as provisioning shares for signing and decryption), nodes communicate with each user via independent, encrypted channels. This means that shares are only ever exposed client-side at the exact moment of recombination.

## How Lit Protocol works for:

## Access Control

### Static Content - Encrypting / locking[](https://developer.litprotocol.com/Introduction/howItWorks#static-content---encrypting--locking)

The SDK encrypts your content and uploads the conditions for decryption to each Lit Protocol node. You will need to store the encrypted content in a place of your choosing (IPFS, Arweave, or even somewhere centralized).

When someone wants to access the content the SDK will request a message signature from the user's wallet. The message signature proves that the corresponding wallet meets the conditions (ex. NFT ownership) for decryption. The Lit Protocol nodes will then send down the decryption shares. Collecting responses and combining them above a threshold is included in the functionality of the [Lit JS SDK](/SDK/intro.md). 


### Dynamic Content - Authorizing access to a resource via JWT[](https://developer.litprotocol.com/Introduction/howItWorks#dynamic-content---authorizing-access-to-a-resource-via-jwt)

The SDK can create the authorization conditions for a given resource and store them with Lit Protocol nodes. When someone requests a network signature to access a resource (typically a server that serves some dynamic content) the SDK will request a message signature from the user's wallet. The signature allows the Lit Protocol nodes to know who owns the NFT associated with the resource.

Lit Protocol nodes will verify that the user owns the NFT, sign the JWT to create a signature share, then send down that signature share. The SDK will combine the signature shares to obtain a signed JWT which is presented to the resource to authenticate and authorize the user.

![accessControl](/img/AccessControl.png)


## Decentralized Cloud Signing

### Lit Actions

Lit Actions are our version of smart contracts, native to Lit Protocol. Actions are immutable JavaScript functions stored on IPFS that can utilize the threshold cryptography that powers Lit. They can also make external HTTP requests and interact with most EVM-compatible blockchains. 

Lit Actions can be used for signing and decryption and work directly with Programmable Key Pairs (PKPs). You can write some JS code, upload it to IPFS, and ask the Lit Nodes to execute that code and return the result. 

The Lit Nodes can sign or decrypt some data for you using their private key share. These signature or decryption shares can be collected and combined on the client side to get the full signature or decryption key. 

![cloudSigning](/img/CloudSigning.png)


## Supported Chains

Lit is currently compatible with most EVM blockchains, Cosmos, and Solana. You can find the full list of supported chains [here](/Support/supportedChains.md). 

## Getting Started

Getting started with [access control and encryption.](/coreConcepts/accessControl/intro)

Dive into programmatic signing with [PKPs and Lit Actions.](/coreConcepts/LitActionsAndPKPs/intro)

Working with the [Lit SDK.](/SDK/Explanation/installation)
