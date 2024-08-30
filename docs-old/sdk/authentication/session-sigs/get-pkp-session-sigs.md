---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generating SessionSigs Using a PKP

This guide covers the `getPkpSessionSigs` function from the Lit SDK. For an overview of what Session Signatures are and how they are to be used, please go [here](./intro).

Using the `getPkpSessionSigs` function, you can specify the capabilities of your current session on the Lit network. 

This function requires you to own a PKP and some form of authentication to prove your identity (e.g. a custom Lit Action, AuthMethod, or AuthSig). It will enable specific abilities for your session keypair defined by the resources you specify.

This function uses the [`signSessionKey`](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#signSessionKey) function to sign the session public key using the PKP, which will generate an `AuthSig`.

Once the `AuthSig` has been created, it is then signed by the session keypair. Signing the `AuthSig` with the session keypair creates the Session Signatures.

## Prerequisites

Before continuing this guide, you should have an understanding of:
- [Session Signatures](./intro)
- [Lit Resources and Abilities](./resources-and-abilities.md)
- [PKPs](../../wallets/minting)

## Parameters and Returns Values

To see the parameters and return values of `getPkpSessionSigs`, please visit our [API Docs](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getPkpSessionSigs).

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

The `node-localstorage` dependency is only required when executing code outside a browser environment. The SDK will use the native browser storage when in a browser environment. You can learn more about this [here](./intro.md#storing-sessionsigs).

### Initializing an Ethers Signer
The `ETHEREUM_PRIVATE_KEY` environment variable is required.
```ts
import { LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";

const ethersSigner = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY,
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

### Initializing a `LitNodeClient`
Here we are initializing an instance of `LitNodeClient` and connecting it to the `datil-test` Lit network.
```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

let litNodeClient: LitNodeClient;

litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilTest,
      debug: false,
    });
await litNodeClient.connect();
```

### Instantiating a `LitContracts` Instance
Here we are initializing an instance of `LitContracts`. This allows us to interact with smart contracts on the Lit network. 

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNetwork } from "@lit-protocol/constants";

const litContracts = new LitContracts({
    signer: ethersSigner,
    network: LitNetwork.DatilTest,
    debug: false,
});
await litContracts.connect();
```

### Generating Session Signatures
In this example, we're enabling our session to use a PKP for signing.

The current code uses the wildcard (`*`) identifier for `LitPKPResource`, which grants signing abilities to **any** PKP. This should only be used for example implementations or debugging. A more secure implementation would instead use the PKP `tokenId` to grant signing abilities to a specific PKP.

To get the Lit resource identifier for other resources, you can use the other methods included in [@lit-protocol/auth-helpers](https://v6-api-doc-lit-js-sdk.vercel.app/modules/auth_helpers_src.html) package.

If you would like to use this function on the `datil` or `datil-test` networks, a `capacityDelegationAuthSig` is required. Please also keep in mind that implementing this requires owning or minting a PKP and some form of authentication (e.g. a custom Lit Action, Auth Method, or AuthSig). How this is done can be found in the full code example.


```ts
import { LitAbility, LitPKPResource } from "@lit-protocol/auth-helpers";

const sessionSignatures = await litNodeClient.getPkpSessionSigs({
    pkpPublicKey: pkp.publicKey!,
    capabilityAuthSigs: [capacityDelegationAuthSig],
    authMethods: [authMethod],
    resourceAbilityRequests: [
        {
            resource: new LitPKPResource("*"),
            ability: LitAbility.PKPSigning,
        },
    ],
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
});
```

## Clearing Local Storage

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

## Summary
This example shows how to enable a session to use a PKP for signing.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/session-signatures/getPkpSessionSigs).