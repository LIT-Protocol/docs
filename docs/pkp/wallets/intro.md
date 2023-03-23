---
sidebar_position: 1
---

# Introduction

:::note
**STATE OF THE NETWORK**

PKPs are still heavily in development and should NOT BE USED to transact live assets that hold monetary value. DO NOT store assets you are not prepared to lose. During this period, we're grateful for feedback on how to improve the docs and examples.
:::

:::note
**SDK DOCUMENTATION**

For the most up to date SDK documentation, check out the [Lit JS SDK V2 API docs](https://js-sdk.litprotocol.com/). For references to the Lit Actions functions which can be accessed inside a Lit Action via the `Lit.Actions` object, check out the [Lit Actions](http://actions-docs.litprotocol.com/) API docs.

If you need some Polygon Mumbai Tokens to [mint](https://explorer.litprotocol.com/mint-pkp) a PKP, fill out this [form](https://forms.gle/hcvh7VbS83DokBSE9).

:::

## MPC as a Key Management Solution

Applied generally, multi-party computation (MPC) allows multiple parties to collectively compute a function over a set of private inputs without ever revealing the inputs themselves. In the context of key management, MPC can be used to generate distributed shares of a public/private key pair (which can be utilized for encryption and signing), without ever exposing the private key in its entirety. This means no one party ever has full control over the underlying key pair, eliminating single points of failure that exist in "centralized" key management ecosystems. An in-depth look at the current state of the MPC wallet space is explored in [this article](https://medium.com/1kxnetwork/wallets-91c7c3457578) published by 1kx.

## PKPs as Distrbuted Custody Wallets

Lit’s [Programmable Key Pairs (PKPs)](/pkp/intro) product can be utilized by app developers to build a white-label MPC wallet solution that delivers a more flexible and seamless onboarding experience to their end users. 

Each PKP is an ECDSA key pair generated collectively by the Lit nodes through a process called [Distributed Key Generation](/resources/howItWorks#threshold-cryptography) (DKG). Operating as a decentralized network, this allows Lit to generate a new key pair where the private key never exists in its entirety. Instead, each node only holds a share of the key. These signature shares must be combined above the threshold (two-thirds of the nodes) to produce the complete signature signed by the PKP. This signature can then be used for instances such as posting a transaction to a blockchain network. Each PKP is represented by an ERC-721 token minted on [Polygon](https://explorer.litprotocol.com/pkps).

The two-thirds threshold design provides a level of censorship resistance and fault tolerance that “typical” 2-of-2 MPC designs (e.g. Fireblocks) do not. In addition to any 2-of-2 provider being able to deny the user access to their funds or censor transactions, most of these systems also require the end user to custody a key share. This means the goal of a seamless, “web2” style onboarding UX is not possible (onboarding without seed phrases or private key management), instead delivering the UX of self-custody with additional steps.

In Lit’s model, the entire key lives in the network, and *any* arbitrary rules for [authentication](/pkp/authHelpers) can be assigned to that key pair through the use of [Lit Actions](LitActions/actions/intro). Authentication refers to the *****method***** that “owns” or controls the underlying key, denoting who has the power to combine the shares. This means that the provider or end user have full control over designing how these interactions should be managed. For example, allowing a user to create a wallet with nothing but their Gmail account, or requiring multi-factor authentication (MFA) when attempting to spend more than X amount of assets, as well as enabling flexible social recovery. Today, PKPs support the following auth methods:

- WebAuthn from [FIDO Alliance](https://fidoalliance.org/fido2-2/fido2-web-authentication-webauthn/) (AKA Apple Passkey, [demo](http://getlit.dev/demo))
- Web3 ownership (holding the “controller” [PKP NFT](https://explorer.litprotocol.com/mint-pkp))
- oAuth (Google, Discord)
- Self-custody key (such as a Ledger hardware wallet)

The current methods are a work in progress:

- Email
- SMS

You can read more about how authentication works with PKPs in [this section](/pkp/authHelpers) of the docs.

The end goal of this system is to facilitate a simple onboarding experience that helps bridge the next billion users into Web3.

![authOverview](/img/authOverview.png)

## Supported Chains

Today, PKP wallets are inherently compatible with any blockchain or cryptographic system that utilizes [ECDSA](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) for digital signatures. This includes Ethereum and most EVM chains, Bitcoin, Cosmos-based chains, and storage networks like IPFS. This means that PKPs can be used to read and write data across these networks, bringing interoperability to previously disconnected ecosystems. You can view the complete list of supported chains [here](/resources/supportedChains#programmable-key-pairs).
