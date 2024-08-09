---
sidebar_position: 1
---

import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# Overview

<StateOfTheNetwork/>

To interact with the nodes in the Lit Network, you will need to generate and present signatures. Currently, there are three ways to do this:

## Obtain an `AuthSig`

A wallet signature, also referred to as `AuthSig`, is a signature that proves you own a particular public key. Learn more about wallet signatures [here](../authentication/auth-sig.md).

## Generate `SessionSigs` manually

Session signatures, or `SessionSigs`, are signatures that are scoped to specific capabilities and resources. For example, you can set up `SessionSigs` to permit only the encryption and decryption of data during a particular time frame.

`SessionSigs` are designed to be ephemeral and limited in scope, allowing for fine-grained control and enabling secure, seamless interactions with any platform integrating Lit. Get started with `SessionSigs` [here](../authentication/session-sigs/intro).

## Generating `SessionSigs` automatically (Recommended)

When interacting with PKP entities such as PKPEthersWallet or PKPClient, instead of passing `SessionSigs`, you can pass the context to generate them. By doing so, the PKP entity will be able to generate its `SessionSigs` automatically.

This is the recommended way to interact with PKP entities as it will automatically handle refreshing the `SessionSigs` when they expire or network conditions have changed.

:::note

`SessionSigs` are only available on Ethereum and are heavily in development, so things may change. Be sure to use the latest version of the Lit JS SDK.

:::

<FeedbackComponent/>
