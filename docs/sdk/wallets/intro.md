import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# Introduction to User Wallets

<StateOfTheNetwork/>

:::info
Need some `tstLPX` test tokens to mint a PKP on Chronicle Yellowstone? Use the [faucet](https://chronicle-yellowstone-faucet.getlit.dev/).
:::

## Introduction

You can use Lit to build seamless, non-custodial wallets and onboarding experiences using Programmable Key Pairs (PKPs). Each PKP is an ECDSA public / private key pair created by the Lit network using Distributed Key Generation (DKG). Each Lit node holds a share, and more than two-thirds of these shares must be collected to execute a given action (i.e. a signed transaction). You can read more about how Lit works [here](../../resources/how-it-works.md).

When used to build a wallet, PKPs can make onboarding into and interacting with web3 significantly simpler and more secure. You can hook up web2-style authentication (i.e. Google OAuth, Passkeys, etc) to these keys to abstract away the complexities of seed phrases and self-custody. Since PKPs are decentralized, you don't have to worry about the inherent risks associated with key custodians, ensuring no one but your user can control their wallet and manage the assets within. 

## Features and Examples

### Features

- **[Blockchain Agnostic](../../resources/supported-chains#programmable-key-pairs)**: PKPs can be used to sign transactions on any blockchain or state machine supported by Lit. Currently, the [SDK](https://github.com/LIT-Protocol/js-sdk/tree/master/packages/pkp-client) provides easy-to-use methods for creating wallets on EVM and Cosmos-based chains. 
- **Programmable**: [Lit Actions](../serverless-signing/overview) can be used to automate signing with PKPs.
- **Non-Custodial**: Each PKP is generated collectively by the Lit nodes using a process called [Distributed Key Generation](../../resources/how-it-works.md) (DKG). As a network, this allows Lit to generate a new wallet where the private key never exists in its entirety. 

### Examples

- [Minting a PKP](../wallets/minting.md): Learn about the various methods you can use to create PKPs.
- [Assigning an Authentication Method](../wallets/auth-methods.md): Authentication methods have the ability to "control" the underlying key pair.
- [Signing Transactions](../serverless-signing/processing-validation.md): You can use [Lit Actions](../serverless-signing/overview.md) to sign transactions with PKPs.
- [Connecting to dApps](../wallets/walletconnect.md): Use WalletConnect to connect your PKP wallet to all of your favorite dApps.

## Getting Started

You can get started with user wallets following this [quick start](../wallets/quick-start.md) guide. Below, you'll find some additional resources and example implementations:

1. [Seed-Phraseless Onboarding](../wallets/minting-methods/mint-via-social.md)
2. [Use a PKP as a Signer on a Smart Account](https://spark.litprotocol.com/account-abstraction-and-mpc/)
3. [Using the Lit Explorer](../../tools/pkpexplorer.md)
4. [Working with Claimable Keys](../wallets/claimable-keys/intro.md)

<FeedbackComponent/>
