---
sidebar_position: 4
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Paying For Usage 

:::info
Currently Rate Limiting is only enabled on `Datil` and `Datil-test`.
See [here](../connecting-to-a-lit-network/testnets) for a list of test networks.
See [here](../connecting-to-a-lit-network/mainnets) for a list of mainnet networks.
:::

# Overview

In order to use Lit, you must reserve capacity on the network. This can be done using capacity credits, which allow holders to reserve a configurable number of requests (measured in requests per day) over a fixed length of time (i.e. one week).

# **Capacity Credits**

In order to send transactions on Lit, you must first authenticate with the [Lit nodes](../sdk/authentication/overview). This can be done using one of two ways:

1. [Session signatures](../sdk/authentication/session-sigs/intro): signatures scoped to specific capabilities or resources, designed to be ephemeral and limited in scope. (RECOMMENDED)
2. [Auth sigs](../sdk/authentication/auth-sig): a signature obtained from a user proving they own a particular key (NOT RECOMMENDED)

Every time you authenticate with Lit, the request context (i.e. wallet address, owned capacity credits, etc) is extracted and validated against the Rate Limiting Module to ensure capacity has not been breached. In order to increase your rate limit, you'll need to mint a `Capacity Credits NFT` on Chronicle - Lit's custom EVM rollup testnet. To do so, you can either use:
1. The [Lit  Explorer](https://explorer.litprotocol.com/get-credits) or,
2. Our `contracts-sdk`.

A `Capacity Credits NFT` can be very easily minted from the Lit Explorer. So, here we will show how you can mint it using `contracts-sdk`. You can download the `contracts-sdk` from `npm` [here](https://www.npmjs.com/package/@lit-protocol/contracts-sdk).

You’ll also need some 'tstLPX' tokens for minting. These are test tokens that hold no real value and should only be used to pay for usage on Datil. `tstLPX` should only be claimed from the verified faucet, linked [here](https://chronicle-yellowstone-faucet.getlit.dev/).

For minting a Capacity Credits NFT see example docs for using our contract-sdk [here](../sdk/capacity-credits#minting-capacity-credits).

### **Delegating Capacity — Paying for Your Users’ Requests**
You can also delegate your capacity credits to other users. For example, Alice owns a Capacity Credit NFT and wants to let Bob use it, but only for a specific Lit Actions or another resource or set of resources that she owns.

Alice can create a session capability object that specifies the ability to Authenticate with an Capacity Credits NFT as well as request for Threshold Execution, for example, against a particular Lit Action IPFS CID(s). Alice then signs and issues these capabilities to Bob.

Alice can generate an `AuthSig` by delegating equal rights to Bob's session keys, and attaching the capabilities granted to him by Alice as a proof in the session object. Bob can subsequently generate a `SessionSig` that requests for Alice's Capacity Credits NFT, specifying the Lit Action IPFS CID in the `resourceAbilityRequests` field.

Lit employs `SessionSig` as a secure method for session management, utilizing ed25519 keypairs created randomly in the browser and stored locally. To generate a `SessionSig`, a user first needs to acquire an [AuthSig](../sdk/authentication/auth-sig.md) via an [authentication method](../user-wallets/pkps/advanced-topics/auth-methods/overview) like Google OAuth. This `AuthSig`, incorporating the session keypair's public key, allows users to delegate specific actions to the session keypair, enhancing security and control over [resource](../sdk/authentication/session-sigs/resources-and-abilities.md) access. The session keypair signs all requests to Lit Nodes, with the `AuthSig` attached as a [capability](../sdk/authentication/session-sigs/capability-objects.md) to ensure that each node can verify the user's ownership of the wallet address. This process not only secures session management but also streamlines user interactions with the Lit Network's resources. 

You can read more about Session Signatures [here](../sdk/authentication/session-sigs/intro.md).



```javascript
import { LitNetwork } from "@lit-protocol/constants";

  const litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilTest,
      checkNodeAttestation: true,
  });
  
  await litNodeClient.connect();
  const authNeededCallback = async ({ resources, expiration, uri }) => {
    // you can change this resource to anything you would like to specify
    const litResource = new LitActionResource('*');

    const recapObject =
      await litNodeClient.generateSessionCapabilityObjectWithWildcards([
        litResource,
      ]);

    recapObject.addCapabilityForResource(
      litResource,
      LitAbility.LitActionExecution
    );

    const verified = recapObject.verifyCapabilitiesForResource(
      litResource,
      LitAbility.LitActionExecution
    );

    if (!verified) {
      throw new Error('Failed to verify capabilities for resource');
    }

    let siweMessage = new siwe.SiweMessage({
      domain: 'localhost:3000', // change to your domain ex: example.app.com
      address: dAppOwnerWallet_address,
      statement: 'Some custom statement.', // configure to what ever you would like
      uri,
      version: '1',
      chainId: '1',
      expirationTime: expiration,
      resources,
    });

    siweMessage = recapObject.addToSiweMessage(siweMessage);

    const messageToSign = siweMessage.prepareMessage();
    const signature = await dAppOwnerWallet.signMessage(messageToSign);

    const authSig = {
      sig: signature,
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: messageToSign,
      address: dAppOwnerWallet_address,
    };

    return authSig;
  };

  let sessionSigs = await litNodeClient.getSessionSigs({
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    chain: 'ethereum',
    resourceAbilityRequests: [
      {
        resource: new LitActionResource('*'),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback,
    capacityDelegationAuthSig,
  });
```


### **Best Practices**

- **Capacity Management**: Keep an eye on your usage limit and expiration date.
- **Understanding Limits**: Be aware that there are no free requests on `Datil` mainnet or the `Datil-test` testnet. You must use Capacity credits to reserve usage on these networks.
- **Delegation**: You can create restrictions on your delegations to ensure that your users don't take your `capacityDelegationAuthSig` and use it for other apps.

<FeedbackComponent/>
