---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Generating SessionSigs

You can use any wallet or auth method to generate session signatures with the `getSessionSigs()` function from the Lit SDK. This function generates a session keypair and uses a callback function that signs the generated session key to create an `AuthSig` that is scoped to specific capabilities.

In order to generate `SessionSigs`, you need a `capacityDelegationAuthSig` in signatures. This is because capacity credits are now required on both `Habanero` and `Manzano` networks. You can buy or [mint](../../capacity-credits.md#minting-capacity-credits) capacity credits centrally and [delegate](../../capacity-credits.md#delegating-access-to-your-capacity-credits-nft) them to your users. 

You can generate a `SessionSig` with the help of `capacityDelegationAuthSig` object in the following way:

```javascript
const { LitNodeClient } = require('@lit-protocol/lit-node-client');
const { LitNetwork } = require('@lit-protocol/constants');
const { LitAbility, LitActionResource, createSiweMessageWithRecaps } = require('@lit-protocol/auth-helpers');
const { ethers } = require('ethers');

// Create a new ethers.js Wallet instance
const wallet = new ethers.Wallet(process.env.YOUR_PRIVATE_KEY);

const sessionSigsFunction = async() => {
  // Instantiate a LitNodeClient
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: true,
  });
  await litNodeClient.connect();

  /*
  * When the getSessionSigs function is called, it will generate a session key
  * and sign it using a callback function. The authNeededCallback parameter
  * in this function is optional. If you don't pass this callback,
  * then the user will be prompted to authenticate with their wallet.
  */
  const authNeededCallback = async ({
    uri,
    expiration,
    resourceAbilityRequests,
  }) => {
    // Prepare the SIWE message for signing
    const toSign = await createSiweMessageWithRecaps({
      uri: uri,
      expiration: expiration,
      resources: resourceAbilityRequests,
      walletAddress: wallet.address,
      nonce: await litNodeClient.getLatestBlockhash(),
      litNodeClient: litNodeClient,
    });
    // Use the Ethereum wallet to sign the message, return the digital signature
    const signature = await wallet.signMessage(toSign);

    // Create an AuthSig using the derived signature, the message, and wallet address
    const authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: toSign,
      address: wallet.address,
    };

    return authSig;
  };

  // Create a session key and sign it using the authNeededCallback defined above
  const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    resourceAbilityRequests: [
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback,
    });

  return sessionSigs;
};
```

**Note:** The nonce should be the latest Ethereum blockhash returned by the nodes during the handshake.

:::note
 If running the SDK in a Server environment, session signatures may *not* be cached unless you provide an instance of `Storage` to the runtime.
 [Here](https://www.npmjs.com/package/node-localstorage) is an implementation of `LocalStorage` which creates local files to persist storage data.
 If storage is not available, session keys *MUST* be persisted in an external data store. 
 ```javascript
 const LocalStorage = require('node-localstorage').LocalStorage;
 const litNodeClient = new LitNodeClient({
  litNetwork: "datil-dev",
  debug: true,
  storageProvider: {
    provider: new LocalStorage('./storage.test.db'),
  }
 });
 ```
:::

The `getSessionSigs()` function will try to create a session key for you and store it in local storage. You can also generate the session key yourself using `generateSessionKeyPair()` function and store it however you like. You can then pass the generated session key to `getSessionSigs()` as the `sessionKey` param.

In the example above, we construct a SIWE message manually, but you can use the `checkAndSignAuthMessage` when in a browser context.

## Resources You Can Request

You can pass an array of "resource ability requests" to the `getSessionSigs()` function, which will be presented to the user in the SIWE message - read more [here](resources-and-abilities) about Lit resources and abilities. The resources and abilities requested by the session key must be narrower or equal to the capabilities granted to it per the session capability object specified in the inner `AuthSig`. 

When session capability objects are omitted from the `getSessionSigs()` function call, the SDK will generate a session capability object with **wildcard permissions against all of the resources in that category by default**, i.e. ability to perform operations against all access control conditions. Read more [here](capability-objects) about how to create custom session capability objects.

## Clearing Local Storage

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

<FeedbackComponent/>
