---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generating SessionSigs: `getLitActionSessionSigs`

This guide covers the `getLitActionSessionSigs` function from the Lit SDK. For an overview of what session signatures are and how they are to be used, please go [here](./intro).

Using the `getLitActionSessionSigs` function, you can specify the capabilities of your current session on the Lit network. 

This function is very similar to [`getPkpSessionSigs`](./get-pkp-session-sigs.md). The `getPkpSessionSigs` function requires you to own a PKP and some form of authentication to prove your identity (e.g. a custom Lit Action, AuthMethod, or AuthSig).

Alternatively, the `getLitActionSessionSigs` function requires the form of authentication to be a Lit Action. Other authentication methods can be included as well, but a Lit Action is required.

Using this arragement, the function executes the Lit Action to determine authorization for the following step.

This function uses the [`signSessionKey`](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#signSessionKey) function to sign the session public key using the PKP, which will generate an `AuthSig`.

Once the `AuthSig` has been created, it is then signed by the session keypair. Signing the `AuthSig` with the session keypair creates the session signatures.

:::note
The Lit Action is defined with the `litActionCode` or `litActionIpfsId` parameter, and `jsParams` must be provided for executing the action.
:::

## Prerequisites

Before continuing this guide, you should have an understanding of:
- [Session Signatures](./intro)
- [Lit Resources and Abilities](./resources-and-abilities.md)
- [PKPs](../../wallets/minting)

## Parameters and Returns

To see the parameters and return of `getLitActionSessionSigs`, please visit our [API Docs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getPkpSessionSigs).

## Example Implementation

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/session-signatures/getLitActionSessionSigs).

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
ipfs-only-hash \
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
ipfs-only-hash \
ethers@v5
```

</TabItem>
</Tabs>

The `node-localstorage` dependency is only required when executing code outside a browser environment. The SDK will use the native browser storage when in a browser environment.
