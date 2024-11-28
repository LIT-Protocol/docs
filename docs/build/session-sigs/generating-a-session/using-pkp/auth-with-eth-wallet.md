---
description: Learn how to use an Ethereum wallet to generate PKP Session Signatures
sidebar_label: Auth with an Ethereum Wallet
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using an Ethereum Wallet to Generate PKP Session Signatures

If an Ethereum wallet is added as a permitted Authentication Method for a PKP, then we can generate an Authentication Signature with the Ethereum wallet to prove that we own an Ethereum wallet authorized to sign with the PKP.

Using this Authentication Signature, we can then request the Lit network to generate PKP Session Signatures that authorize a Session to use the specified Lit Resources and Abilities.

This guide will demonstrate how to use an Ethereum wallet to generate PKP Session Signatures.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/v2/session-signatures/generating-a-session/using-pkp).
:::

## Prerequisites

- An Ethereum wallet
- An understanding of:
  - [Authentication Methods](../../../learn/authentication/auth-methods)
  - [Programmable Key Pairs (PKPs)](../../../learn/signing-data/pkps)
  - [Authentication Signatures](../../../learn/authentication/auth-sigs)
  - [Session Signatures](../../../learn/authentication/session-sigs)
  - [Lit Resources and Abilities](../../../learn/authentication/lit-resources-and-abilities)

### Required Packages

- `@lit-protocol/constants`
- `@lit-protocol/lit-node-client`
- `@lit-protocol/lit-auth-client`
- `@lit-protocol/auth-helpers`
- `ethers@v5`

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/lit-auth-client \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/lit-auth-client \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>
</Tabs>

## The Code Example

### Initial Setup

1. Instantiate an Ethers.js Wallet
   - A code example is available [here](../../getting-started/authenticating-a-session#creating-an-ethers-signer)
2. Instantiate and connect a `LitNodeClient`
   - A code example is available [here](../../getting-started/connecting-to-lit)

:::info
The nodes in each Lit network use unique keys for generating Session Signatures. Therefore, Session Signatures created for one network are not compatible with another network.
:::

### Authenticating the Ethereum Wallet

The first step is to prove that we own an Ethereum wallet that is authorized to sign with the PKP.

This code example makes use of the [EthWalletProvider](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_auth_client_src.EthWalletProvider.html) to authenticate the Ethereum wallet. The `authenticate` method will first create an [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) message and sign it using the provided `signer`. It will then format that Authentication Signature as an Auth Method that can be used in the request to generate PKP Session Signatures.

```ts
import { EthWalletProvider } from '@lit-protocol/lit-auth-client';

const authMethod = await EthWalletProvider.authenticate({
    signer: ethersSigner,
    litNodeClient,
});
```

### Requesting PKP Session Signatures

Next we utilize the [getPkpSessionSigs](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html#getPkpSessionSigs) method to request the Lit network to generate PKP Session Signatures. This method requires the following parameters:

- `pkpPublicKey`: The public key of the PKP that will be used to generate Session Signatures
- `authMethods`: The Authentication Signature created in the previous step that proves we own an Ethereum wallet authorized to sign with the PKP
- `resourceAbilityRequests`: The Lit Resources and Abilities we're requesting the Session to be authorized to use
- `expiration`: The date and time at which the Session Signatures expire

```ts
const sessionSignatures = await litNodeClient.getPkpSessionSigs({
    pkpPublicKey: pkp.publicKey!,
    authMethods: [authMethod],
    resourceAbilityRequests: [
        {
            resource: new LitPKPResource('*'),
            ability: LIT_ABILITY.PKPSigning,
        },
    ],
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
});
```

The result of this method is an object containing the Session Signatures from the Lit nodes. These Session Signatures can then be used in subsequent requests to interact with the Lit network.

## Summary

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/v2/session-signatures/generating-a-session/using-pkp).
:::

This guide explains how to use an Ethereum wallet as an Authentication Method for a PKP to generate Session Signatures, which authorize a Session to access specific Lit Resources and Abilities.

## Next Steps

- Explore how to use alternative Authentication Methods for a PKP to generate Session Signatures
  - [Google OAuth](./auth-with-google-oauth)
  - [Discord OAuth](./auth-with-discord-oauth)
  - [Google JWT](./auth-with-google-jwt)
  - [Custom Authentication Method](./auth-with-custom-auth-method)
- Learn how to use [Session Signatures to interact with the Lit network](../../making-a-request)
