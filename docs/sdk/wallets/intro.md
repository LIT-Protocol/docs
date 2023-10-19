# Introduction

:::note
PKPs are still heavily in development and things may change. We're grateful for [feedback](https://forms.gle/4UJNRcQspZyvsTHt8) on how to improve the docs and examples!

Need some `LIT` test tokens to mint a PKP on Chronicle? Use the faucet: https://faucet.litprotocol.com/

**PKP Developer Preview is Live!**
Get a PKP on the [PKP Explorer](https://explorer.litprotocol.com/mint-pkp)

:::

## Quick Start

Ready to jump right in? Quickly learn how you can integrate Programmable Key Pairs (PKPs) into your own product:

1. Resource: [Minting a PKP using the Lit Explorer](https://explorer.litprotocol.com/mint-pkp)
2. Resource: [Testnet Faucet](https://chronicle-faucet-app.vercel.app/)
3. Concept: [Assigning an Authentication Method](../wallets/auth-methods.md) (and associated [blog post](https://spark.litprotocol.com/how-authentication-works-with-pkps/))
4. SDK Package: [Using PKPs as Wallets](../wallets/walletconnect.md) 

## Overview

Each Programmable Key Pair (PKP) is a versatile MPC wallet that can be utilized by developers to:

1. Provide users of web3 with seamless, ["seed-phraseless" onboarding](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/) experiences.
2. Facilitate transaction execution on [blockchains](https://www.youtube.com/watch?v=zJEVPH1UUxM), [storage networks](https://github.com/LIT-Protocol/key-did-provider-secp256k1), and other state machines.
3. Build fully decentralized application backends.

## Features

1. [Blockchain Agnostic](../../resources/supported-chains#programmable-key-pairs): PKPs can be used to sign transactions on any blockchains or state machines using [ECDSA](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) for digital signatures. Currently, the [SDK](https://github.com/LIT-Protocol/js-sdk/tree/master/packages/pkp-client) provides easy-to-use methods for creating wallets on EVM and Cosmos based chains. 
2. Programmable: [Serverless signing](../serverless-signing/overview.md) is useful for defining signing automations, handling [authentication](../wallets/auth-methods.md), or generating conditional proofs. 
3. Atomicity: Using Mint/Grant/Burn, you can atomically link a PKP to an authorized set of Lit Actions. This method guarantees that a particular PKP can only ever be used to sign data from within the approved set.
4. Fault-tolerant: Each PKP is generated collectively by the Lit nodes through a process called [Distributed Key Generation](https://en.wikipedia.org/wiki/Distributed_key_generation) (DKG). As a network, this allows Lit to generate a new key-pair where the private key never exists in its entirety. 
5. Interoperable: Use a provider like [WalletConnect](../wallets/walletconnect.md) to connect PKPs to your favorite dApps, just like any other EOA wallet.

## Examples and Use Cases

PKPs can be used to power a wide array of potential applications and use cases:

1. [Seed-Phraseless Onboarding Experiences](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/) with Multi-Factor Authentication
2. Signing Automation and [Conditional Transaction Execution](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/)
3. [Automated Credential Issuance](https://spark.litprotocol.com/krebitxlitactions/)
4. [Versatile Web3 Wallets](https://github.com/DustilDawn/Magic)
5. [Cross-Chain Messaging and Swaps](https://spark.litprotocol.com/xchain-bridging-yacht-lit-swap/)
6. [Signer on an AA Wallet](https://spark.litprotocol.com/account-abstraction-and-mpc/)