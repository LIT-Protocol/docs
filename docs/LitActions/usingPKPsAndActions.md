---
sidebar_position: 3
---

# Using PKPs and Lit Actions Together

:::note

Lit Actions and PKPs are still heavily in development and things may change.

**SDK DOCUMENTATION**

For the most up to date SDK documentation, check out the [Lit JS SDK V2 API docs](https://js-sdk.litprotocol.com/). For references to the Lit Actions functions which can be accessed inside a Lit Action via the `Lit.Actions` object, check out the [Lit Actions](http://actions-docs.litprotocol.com/) API docs.

Need some `LIT` test tokens to mint a PKP? Get some from the [faucet](https://faucet.litprotocol.com/)!

:::

As a distributed key management network, Lit provides developers with the ability to add programmable signing to their applications and wallets. These distributed wallets are known as Programmable Key Pairs (PKP) and the application logic that dictates when and why that key-pair will sign is known as a Lit Action.

## How do Lit Actions and PKPs work together?

A user can create a new PKP and grant a Lit Action the right to sign using it. This means the distributed key has the ability to sign and decrypt arbitrary data based on pre-defined logic and conditions.

### Adding a Permitted Address

You can use the [PKPPermissions contract](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPPermissions.sol#L418) to add additional permitted auth methods and addresses to your PKP. Note that any permitted users will be able to execute transactions, authorized Lit Actions, and additional functionality associated with that PKP. 

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

## Sending the PKP to itself

Sending a PKP to itself is possible, because the PKP is an NFT and also a wallet. This is useful if you want to make sure that only the PKP itself can change it's auth methods. To learn how auth works, read more [here](/pkp/authHelpers). You can also use our handy auth helper contract [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPHelper.sol). You can find the contract addresses [here](https://explorer.litprotocol.com/contracts). If you use that contract there is a parameter called `sendPkpToItself` in the `mintNextAndAddAuthMethods` function that you can set to true to send the PKP to itself.

## What is Mint/Grant/Burn?

Mint/Grant/Burn is an optional pattern that allows you to prove that a PKP was not used to sign anything before it was approved to use a Lit Action.

Suppose you have a Lit Action that will check if a number is prime, and if it is, sign that number. If it is not prime, the Lit Action will abort. If you were able to mint a PKP, assign it to that Lit Action, and then burn the PKP in a single atomic transaction, then it would be provable that the PKP was not used to sign anything before it was approved to use the Lit Action. In this case, you could trust that any numbers signed with that PKP are indeed prime, without needing to check them yourself. This creates a powerful way to prove the output of any JS code by checking that 1) the signature is valid, 2) the lit action code is correct, and 3) that the PKP was minted using this Mint/Grant/Burn pattern.

The function to do this is called Mint/Grant/Burn. You mint the PKP, grant access for a Lit Action to use it, and then burn the PKP in a single transaction. Burning the PKP destroys the ability to grant access for a Lit Action to use it, so you know that no other Lit Action can ever use that PKP.
You can see the definition of a MintGrantBurn fuction in the contract source code [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPNFT.sol#L157)
