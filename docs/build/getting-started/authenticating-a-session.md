---
description: Learn how to authenticate a session with the Lit Network
sidebar_label: Authenticating a Session
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authenticating a Session

In order to use your [Lit Resources and their corresponding abilities](./overview#lit-resources-and-abilities), you need to authenticate yourself with the Lit Network. After your identity has been authenticated, the Lit nodes can then verify whether you have the necessary permissions to access a given Lit Resource and its associated abilities when you make requests to the Lit Network (such as decrypting data, signing transactions with a PKP, or executing a Lit Action).

As covered [here](./overview#session-signatures) in the Getting Started overview, Sessions are the means by which you authenticate with the Lit Network to interact with Lit Resources securely without repeatedly signing transactions with your wallet. This guide will walk you through the process of authenticating a session, which involves:

1. Generating a Session Key Pair
2. Creating an Authentication Signature to authorize your Session Key to use Lit Resources you have access to
3. Requesting the Lit network to generate Session Signatures for your Session, authorizing it to perform actions with the specified Lit Resources

## Prerequisites

- Understanding of Lit core terminology and concepts covered [here](./overview#core-terminology)
  - Specifically [Session Signatures](./overview#session-signatures)
- Understanding of the [Connecting to the Lit Network](./connecting-to-lit) guide

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
npm install @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>
</Tabs>

## The Code Example

:::info
A full implementation of the code covered in this guide is available [here](https://github.com/LIT-Protocol/developer-guides-code/tree/v2/getting-started/authenticating-a-session).
:::

### Creating an Ethers Signer

```typescript
import { ethers } from "ethers";
import { LIT_RPC } from '@lit-protocol/constants';

const ethersSigner = new ethers.Wallet(
  ETHEREUM_PRIVATE_KEY,
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

The wallet that corresponds to `ETHEREUM_PRIVATE_KEY` would be the wallet that has permission to decrypt some data, sign with a PKP that it controls, or would be paying for the execution of a Lit Action.

As we'll cover further below, the `ethersSigner` is used to generate an Authentication Signature which is a [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) message that specifies what Lit Resources and corresponding abilities the Session will be authorized to use.

:::note
While not always required, we provide the `ethers.Wallet` with a JSON RPC provider that connects it to the [Lit Chronicle Yellowstone blockchain](../../learn/overview/how-it-works/lit-blockchains/chronicle-yellowstone). However, this RPC provider is required once you move onto minting Programmable Key Pairs (PKPs) and Capacity Credits, but that's not relevant for this guide.
:::

### Requesting Session Signatures

After connecting an instance of `LitNodeClient` to the Lit Network, the code calls the `getSessionSigs` method to request the Lit network to generate session signatures for the session.

<details>
<summary>Click here to see how this is done</summary>
<p>

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

</p>
</details>

This method takes in an object with the following properties:

- **chain**: Corresponds to the signature schema and message format you're requesting the session to be authenticated with. This should almost always be `ethereum`.
- **expiration**: The date and time at which the session will no longer be valid.
  - It's recommended that you set this value to be as soon as possible, to minimize the amount of time that the session is valid for in case it gets compromised.
- **resourceAbilityRequests**: An array of objects that specify the Lit Resources and abilities you're requesting the session to be authorized to use.
- **authNeededCallback**: A function that you implement that generates an Authentication Signature for the session.

As a result of executing `getSessionSigs`, the Lit SDK will generate the ephemeral session key pair, execute the `authNeededCallback` function to generate an Authentication Signature, and submit the request to the Lit Network to generate session signatures.

Upon receiving the request, each Lit node in the network will independently authenticate the Authentication Signature, deriving the corresponding Ethereum address, and use that address to check if it has the authority to delegate the specified Lit Resources and abilities to the session.

If a node determines that the Authentication Signature is valid and authorized to delegate the `resourceAbilityRequests` to the session, it will generate a Session Signature indicating that the session is authenticated and authorized to use the specified Lit Resources and abilities.

After a threshold of nodes have generated Session Signatures, the Lit Network will send the Session Signatures back to your client. You will then use these Session Signatures to interact with the Lit Network, as we'll cover in other code examples in this guide.

