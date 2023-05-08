---
sidebar_position: 1
---

# Overview

With Lit Protocol, you can enable your users to seamlessly and securely interact with the open web without worrying about their private keys. The Lit SDK makes it easy to build intuitive authentication flows and generate and present signatures to Lit nodes.

Currently, authenticating against Lit nodes can be done in two ways:

## Obtain an `AuthSig`

An auth signature, also referred to as `AuthSig`, is a signature that proves you own a particular public key. An `AuthSig` can be created using any of the currently supported authentication methods:

- Externally-Owned Account
- Smart Contract
- Social Login (e.g, Google, Discord)
- WebAuthn

## Generate `SessionSigs`

Once you have obtained an `AuthSig`, you can use it to generate session signatures (`SessionSigs`), which are signatures that are scoped to specific capabilities and resources. For example, you can set up `SessionSigs` to permit only the encryption and decryption of data during a particular time frame.

`SessionSigs` are designed to be ephemeral and limited in scope, allowing for fine-grained control and enabling secure, seamless interactions with any platform integrating Lit.

:::note

`SessionSigs` are only available on Ethereum and are heavily in development, so things may change. Be sure to use the latest version of the Lit SDK and connect to the `serrano` testnet.

:::
