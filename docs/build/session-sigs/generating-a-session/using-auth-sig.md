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

This guide will demonstrate how to use an Authentication Signature (Auth Sig) to generate Session Signatures.

:::info
The full implementation of the code used in this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/v2/session-signatures/generating-a-session/using-an-auth-sig).
:::

## Prerequisites

- An Ethereum wallet
- An understanding of [Authentication Signatures](../../../learn/authentication/auth-sigs)
- An understanding of [Session Signatures](../../../learn/authentication/session-sigs)
- An understanding of [Lit Resources and Abilities](../../../learn/authentication/lit-resources-and-abilities)

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

### Instantiating an Ethers Signer

This `ethersSigner` will be used to sign the Auth Sig that is submitted with the Session Signature generation request.

The wallet corresponding to `process.env.ETHEREUM_PRIVATE_KEY` must be authorized to use the Lit Resources and Abilities that will be requested.

```ts
import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Instantiating a `LitNodeClient` Instance

Next we'll instantiate and connect a `LitNodeClient` client specifying the Lit network you are wanting to make requests to. In this case we'll be connecting to the [DatilTest](../../../learn/overview/how-it-works/lit-networks/testnets#the-datil-test-network) network.

:::info
Each Lit network's nodes have different keys used when generating their Session Signatures. Session Sigs generated for one network will not work on another.
:::

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";

litNodeClient = new LitNodeClient({
    litNetwork: LIT_NETWORK.DatilTest,
    debug: false,
});
await litNodeClient.connect();
```

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
