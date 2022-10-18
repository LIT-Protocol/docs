---
sidebar_position: 3
---

# How does Lit Protocol work?

![What is Lit explanation graph](../../static/img/lit_explanation.jpeg)
Lit Protocol uses threshold cryptography in order to generate shares of public/private key pairs. Once a certain percentage of shares are confirmed by the Lit Protocol Nodes, an authorized signer is able to encrypt or decrypt information.

## How Lit Protocol works for: 

### Static Content - Encrypting / locking

The SDK encrypts your content and uploads the conditions for decryption to each Lit Protocol node. You will need to store the encrypted content in a place of your choosing (IPFS, Arweave, or even somewhere centralized).

When someone wants to access the content the SDK will request a message signature from the user's wallet. The message signature proves that the corresponding wallet meets the conditions (ex. NFT ownership) for decryption. The Lit Protocol nodes will then send down the decryption shares. The SDK combines them and decrypts the content.

### Dynamic Content - Authorizing access to a resource via JWT

The SDK can create the authorization conditions for a given resource and store them with Lit Protocol nodes. When someone requests a network signature to access a resource (typically a server that serves some dynamic content) the SDK will request a message signature from the user's wallet. The signature allows the Lit Protocol nodes to know who owns the NFT associated with the resource.

Lit Protocol nodes will verify that the user owns the NFT, sign the JWT to create a signature share, then send down that signature share. The SDK will combine the signature shares to obtain a signed JWT which is presented to the resource to authenticate and authorize the user.
