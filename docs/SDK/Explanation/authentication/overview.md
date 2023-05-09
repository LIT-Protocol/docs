---
sidebar_position: 1
---

# Overview

To interact with the nodes in the Lit Network, you will need to generate and present signatures. Currently, there are two ways to do this:

## Obtain an `AuthSig`

A wallet signature, also referred to as `AuthSig`, is a signature that proves you own a particular public key. Learn more about wallet signatures [here](/SDK/Explanation/authentication/authSig).

## Generate `SessionSigs` (Recommended)

Session signatures, or `SessionSigs`, are signatures that are scoped to specific capabilities and resources. For example, you can set up `SessionSigs` to permit only the encryption and decryption of data during a particular time frame.

`SessionSigs` are designed to be ephemeral and limited in scope, allowing for fine-grained control and enabling secure, seamless interactions with any platform integrating Lit. Get started with `SessionSigs` [here](/SDK/Explanation/authentication/sessionSigs).

:::note

`SessionSigs` are only available on Ethereum and are heavily in development, so things may change. Be sure to use the latest version of the Lit SDK and connect to the `serrano` testnet.

:::
