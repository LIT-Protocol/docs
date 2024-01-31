# Introduction

:::note
PKPs are still heavily in development and things may change. We're grateful for [feedback](https://forms.gle/4UJNRcQspZyvsTHt8) on how to improve the docs and examples!

Need some `testLPX` test tokens to mint a PKP on Chronicle? Use the faucet: https://faucet.litprotocol.com/

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

Each Programmable Key Pair (PKP) is a versatile MPC wallet that can be used to [seamlessly onboard](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/) users into web3 and provide flexible and intuitive asset management experiences. 

## Features

1. [Blockchain Agnostic](../../resources/supported-chains#programmable-key-pairs): PKPs can be used to sign transactions on any blockchain or state machine supported by Lit. Currently, the [SDK](https://github.com/LIT-Protocol/js-sdk/tree/master/packages/pkp-client) provides easy-to-use methods for creating wallets on EVM and Cosmos-based chains. 
2. Programmable: [Lit Actions](../serverless-signing/overview) can be used to define flexible transaction automations and handle the authentication logic for PKPs.
3. Atomicity: Using [Mint/Grant/Burn](../serverless-signing/overview), you can atomically link a PKP to an authorized set of Lit Actions. This method guarantees that a particular PKP can only ever be used to sign data from within the approved set, and nothing else. 
4. Fault-tolerant: Each PKP is generated collectively by the Lit nodes through a process called [Distributed Key Generation](https://en.wikipedia.org/wiki/Distributed_key_generation) (DKG). As a network, this allows Lit to generate a new wallet where the private key never exists in its entirety. 
5. Interoperable: Use a provider like [WalletConnect](../wallets/walletconnect.md) to connect PKPs to your favorite dApps, just like any other EOA wallet.

## Examples and Use Cases

PKPs can be used to power a wide array of potential applications and use cases:

1. [Seed-Phraseless Onboarding Experiences](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/)
2. [DeFi automation](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/)
3. [Automated Credential Issuance](https://spark.litprotocol.com/krebitxlitactions/)
4. [Versatile Web3 Wallets](https://github.com/DustilDawn/Magic)
5. [Cross-Chain Messaging and Swaps](https://spark.litprotocol.com/xchain-bridging-yacht-lit-swap/)
6. [Signer on an AA Wallet](https://spark.litprotocol.com/account-abstraction-and-mpc/)