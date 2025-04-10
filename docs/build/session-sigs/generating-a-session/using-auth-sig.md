---
description: Learn how to use an Auth Sig to generate Session Signatures
sidebar_label: Using an Auth Sig
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using an Auth Sig to Generate Session Signatures

:::info
Session Signatures are used by the Lit network to authenticate you and verify your authorization to access requested Lit Resources. They are required when making network requests to sign with a PKP, decrypt data, and execute Lit Actions.

To learn more about Session Signatures, please go [here](../../../learn/authentication/session-sigs).
:::

Certain Lit Resources are directly associated with an Ethereum address. For instance, when PKPs are minted, the transaction signer can be permitted as an Authentication Method for the PKP. Additionally, Capacity Credits are owned by an Ethereum address and do not require the owner to delegate their usage to themselves for making requests to the Lit network. In these cases, providing an Authentication Signature to the Lit network when requesting to authorize a Session is sufficient.

This guide will show you how to use an Authentication Signature to generate Session Signatures.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/v2/session-signatures/generating-a-session/using-an-auth-sig).
:::

## Prerequisites

- An Ethereum wallet
- An understanding of:
  - [Authentication Signatures](../../../learn/authentication/auth-sigs)
  - [Session Signatures](../../../learn/authentication/session-sigs)
  - [Lit Resources and Abilities](../../../learn/authentication/lit-resources-and-abilities)

### Required Packages

- `@lit-protocol/constants`
- `@lit-protocol/lit-node-client`
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
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add \
@lit-protocol/constants \
@lit-protocol/lit-node-client \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>
</Tabs>

## The Code Example

### Initial Setup

1. Instantiate an Ethers.js Wallet
   - This wallet will be used to sign the Authentication Signature that is submitted with the Session Signature generation request
   - The Ethereum address corresponding to this wallet must be authorized to use the Lit Resources and Abilities that will be requested
   - A code example is available [here](../../getting-started/authenticating-a-session#creating-an-ethers-signer)
2. Instantiate and connect a `LitNodeClient`
   - A code example is available [here](../../getting-started/connecting-to-lit)

:::info
The nodes in each Lit network use unique keys for generating Session Signatures. Therefore, Session Signatures created for one network are not compatible with another network.
:::

### Generating Session Sigs using an Auth Sig

Using the [getSessionSigs](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html#getSessionSigs) method, we can generate Session Signatures using an Auth Sig:

```ts
const sessionSignatures = await litNodeClient.getSessionSigs({
    chain: 'ethereum',
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    resourceAbilityRequests: [
        {
            resource: new LitAccessControlConditionResource('*'),
            ability: LIT_ABILITY.AccessControlConditionDecryption,
        },
    ],
    authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
    }) => {
        const toSign = await createSiweMessage({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: await ethersSigner.getAddress(),
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
        });

        return await generateAuthSig({
            signer: ethersSigner,
            toSign,
        });
    },
});
```

This method takes in an object with the following properties:

- **chain**: Corresponds to the signature schema and message format you're requesting the session to be authenticated with. This should almost always be `ethereum`.
- **expiration**: The date and time at which the session will no longer be valid.
  - It's recommended that you set this value to be as soon as possible, to minimize the amount of time that the session is valid for in case it gets compromised.
- **resourceAbilityRequests**: An array of objects that specify the Lit Resources and abilities you're requesting the session to be authorized to use.
- **authNeededCallback**: A function that you implement that generates an Authentication Signature for the session.

#### `authNeededCallback`

It's within the `authNeededCallback` function that the [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) message is created and signed by the `ethersSigner` to supply the Session Signature request with an Auth Sig.

[createSiweMessage](https://v7-api-doc-lit-js-sdk.vercel.app/functions/auth_helpers_src.createSiweMessage.html) and [generateAuthSig](https://v7-api-doc-lit-js-sdk.vercel.app/functions/auth_helpers_src.generateAuthSig.html) are helper functions provided by the Lit SDK that are used to create the ERC-5573 message and generate the Auth Sig in the format that the Lit nodes expect.

## Summary

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/v2/session-signatures/generating-a-session/using-an-auth-sig).
:::

This guide demonstrates how to use an Ethereum wallet to generate an Authentication Signature, and use that Authentication Signature to request the Lit network to authorize a Session to access specific Lit Resources and Abilities.

## Next Steps

- Explore how to use [PKPs (Programmable Key Pairs) to generate Session Signatures](./using-pkp/overview)
- Learn how to use [Session Signatures to interact with the Lit network](../making-a-request)
