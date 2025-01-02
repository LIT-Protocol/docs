---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using a Lit Action

:::warning
Please do not cache Session Signatures, and instead generate them on-demand.
:::

This guide covers the `getLitActionSessionSigs` function from the Lit SDK. For an overview of what Session Signatures are and how they are to be used, please go [here](./intro).

Using the `getLitActionSessionSigs` function, you can specify the capabilities of your current session on the Lit network. 

This function is very similar to [`getPkpSessionSigs`](./get-pkp-session-sigs.md). The `getPkpSessionSigs` function requires you to own a PKP and some form of authentication to prove your identity (e.g. a custom Lit Action, AuthMethod, or AuthSig).

Alternatively, the `getLitActionSessionSigs` function requires the form of authentication to be a Lit Action. Other authentication methods can be included as well, but a Lit Action is required.

Using this arrangement, the function executes the Lit Action to determine authorization for the following step.

This function uses the [`signSessionKey`](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#signSessionKey) function to sign the session public key using the PKP, which will generate an `AuthSig`.

Once the `AuthSig` has been created, it is then signed by the session keypair. Signing the `AuthSig` with the session keypair creates the Session Signatures.

:::note
The Lit Action is defined with the `litActionCode` or `litActionIpfsId` parameter, and `jsParams` must be provided for executing the action.
:::

## Prerequisites

Before continuing this guide, you should have an understanding of:
- [Session Signatures](./intro)
- [Lit Resources and Abilities](./resources-and-abilities.md)
- [PKPs](../../wallets/minting)

## Parameters and Return Values

To see the parameters and return values of `getLitActionSessionSigs`, please visit our [API Docs](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#getLitActionSessionSigs).

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
import { LIT_NETWORK } from "@lit-protocol/constants";

let litNodeClient: LitNodeClient;

litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilTest,
      debug: false,
    });
await litNodeClient.connect();
```

### Instantiating a `LitContracts` Instance
Here we are initializing an instance of `LitContracts`. This allows us to interact with smart contracts on the Lit network. 

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LIT_NETWORK } from "@lit-protocol/constants";

const litContracts = new LitContracts({
    signer: ethersSigner,
    network: LIT_NETWORK.DatilTest,
    debug: false,
});
await litContracts.connect();
```

### Generating Session Signatures
In this example, we're enabling our session to use a PKP for signing and to execute Lit Actions.

The current code uses the wildcard (`*`) identifier for `LitPKPResource`, which grants signing abilities to **any** PKP. This should only be used for example implementations or debugging. A more secure implementation would instead use the PKP `tokenId` to grant a specific PKP signing abilities. 

The wildcard identifier is also used for `LitActionResource`. This allows the session to execute **any** Lit Action. A more secure implementation would instead have a specific IPFS CID.

To get the Lit resource identifier for other resources, you can use the other methods included in [@lit-protocol/auth-helpers](https://v7-api-doc-lit-js-sdk.vercel.app/modules/auth_helpers_src.html) package.

If you would like to use this function on the `datil` or `datil-test` networks, a `capacityDelegationAuthSig` is required. Please also keep in mind that implementing this requires owning or minting a PKP and defining a Lit Action. How this is done can be found in the full code example.

```ts
import { LIT_ABILITY } from "@lit-protocol/constants";
import {
  LitActionResource,
  LitPKPResource,
} from "@lit-protocol/auth-helpers";

const sessionSignatures = await litNodeClient.getLitActionSessionSigs({
    pkpPublicKey: pkp.publicKey,
    capabilityAuthSigs: [capacityDelegationAuthSig],
    chain: "ethereum",
    resourceAbilityRequests: [
    {
        resource: new LitPKPResource("*"),
        ability: LIT_ABILITY.PKPSigning,
    },
    {
        resource: new LitActionResource("*"),
        ability: LIT_ABILITY.LitActionExecution,
    },
    ],
    // With this setup you could use either the litActionIpfsId or the litActionCode property
    //litActionIpfsId: litActionCodeIpfsCid,
    litActionCode: Buffer.from(litActionCode).toString("base64"),
    jsParams: {
    magicNumber: 42,
    },
});
```

## Clearing Local Storage

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

## Summary
This example shows how to enable a session to use a PKP for signing and to execute Lit Actions.

The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/session-signatures/getPkpSessionSigs).