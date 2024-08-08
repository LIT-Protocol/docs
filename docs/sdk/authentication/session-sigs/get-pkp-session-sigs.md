---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generating SessionSigs: `getPkpSessionSigs`

This guide covers the `getPkpSessionSigs` function from the Lit SDK. For an overview of what session signatures are and how they are to be used, please go [here](./intro).

Using the `getPkpSessionSigs` function, you can specify the capabilities of your current session on the Lit network. 

This function requires you to own a PKP and some form of authentication to prove your identity (e.g. a custom Lit Action, AuthMethod, or AuthSig). It will enable specific abilities for your session keypair defined by the resources you specify.

This function uses the [`signSessionKey`](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#signSessionKey) function to sign the session public key using the PKP, which will generate an `AuthSig`.

Once the `AuthSig` has been created, it is then signed by the session keypair. Signing the `AuthSig` with the session keypair creates the session signatures.

## Prerequisites

Before continuing this guide, you should have an understanding of:
- [Session Signatures](./intro)
- [Lit Resources and Abilities](./resources-and-abilities.md)
- [PKPs](../../wallets/minting)

## Parameters and Returns

To see the parameters and return of `getPkpSessionSigs`, please visit our [API Docs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getPkpSessionSigs).

## Example Implementation

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/session-signatures/getPkpSessionSigs). 

### Installing the Required Dependencies
<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/contracts-sdk \
@lit-protocol/lit-auth-client \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/auth-helpers \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/contracts-sdk \
@lit-protocol/lit-auth-client \
ethers@v5
```

</TabItem>
</Tabs>

The `node-localstorage` dependency is only required when executing code outside a browser environment. The SDK will use the native browser storage when in a browser environment.
