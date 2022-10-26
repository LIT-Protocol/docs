---
sidebar_position: 4
---

# Lit Actions

:::note

Lit Actions are still heavily in development and things may change.

:::

## What are Lit Actions?

Lit Actions are JavaScript functions that can use the threshold cryptography that powers the Lit network. They are basically JavaScript smart contracts, only much more powerful.

Lit Actions are immutable, blockchain agnostic, and can make HTTP requests. This means that they can utilize on-chain and off-chain data in their computation. You can write some code and ask the Lit nodes to execute it, for example asking the network to calculate the difference between two random integers, x and y. 

The result of this function can be used to pass some functionality, like provisioning signature or decryption shares to a user (*if the difference between x and y is greater than 10, sign the result*).

## What can I use Lit Actions for?

Lit Actions are essentially decentralized serverless functions. You can use Lit Actions in conjunction with PKPs to sign and decrypt data, functionally creating a smart contract with its own key pair. 

A toy example would be a Lit Action and corresponding PKP that checks if a number is prime, and only signs it if it is prime.  Think of it as a sort of “prime number” certification service.  Since the Lit Action is immutable, and since you can permanently assign a PKP to a Lit Action, there is a provable chain of trust.  This means you could present the signature and a number to someone, and they could simply check the signature against the public key of the PKP to see if the number is actually prime, instead of having to do all the math to ensure that the number is actually prime.  The signature acts as a proof that the number is prime.  

## Getting started with Lit Actions

Get started with Lit Actions [here](/SDK/Explanation/litActions.md).

More [examples](/coreConcepts/usecases#programmatic-signing-lit-actions-and-pkps). 