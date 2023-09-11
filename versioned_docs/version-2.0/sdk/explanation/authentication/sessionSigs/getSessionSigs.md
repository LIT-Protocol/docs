---
sidebar_position: 2
---

# Generating SessionSigs

You can use any wallet or auth method to generate session signatures with the `getSessionSigs()` function from the Lit SDK. This function generates a session keypair and uses a callback function that signs the generated session key to create an `AuthSig` that is scoped to specific capabilities.

```javascript
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitAccessControlConditionResource, LitAbility } from '@lit-protocol/auth-helpers';

// Create a new ethers.js Wallet instance
const wallet = new Wallet(process.env.YOUR_PRIVATE_KEY);

// Instantiate a LitNodeClient
const litNodeClient = new LitNodeClient({
  litNetwork: "serrano",
  debug: true,
});
await litNodeClient.connect();

/**
 * When the getSessionSigs function is called, it will generate a session key
 * and sign it using a callback function. The authNeededCallback parameter
 * in this function is optional. If you don't pass this callback,
 * then the user will be prompted to authenticate with their wallet.
 */
const authNeededCallback = async ({ chain, resources, expiration, uri }) => {
  const domain = "localhost:3000";
  const message = new SiweMessage({
    domain,
    address: wallet.address,
    statement: "Sign a session key to use with Lit Protocol",
    uri,
    version: "1",
    chainId: "1",
    expirationTime: expiration,
    resources,
  });
  const toSign = message.prepareMessage();
  const signature = await wallet.signMessage(toSign);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: toSign,
    address: wallet.address,
  };

  return authSig;
};

// Create an access control condition resource
const litResource = new LitAccessControlConditionResource(
  hashedEncryptedSymmetricKeyString
);

const sessionSigs = await litNodeClient.getSessionSigs({
  chain: "ethereum",
  resourceAbilityRequests: [
    {
      resource: litResource,
      ability: LitAbility.AccessControlDescription
    }
  ],
  authNeededCallback,
});
```

The `getSessionSigs()` function will try to create a session key for you and store it in local storage. You can also generate the session key yourself using `generateSessionKeyPair()` function and store it however you like. You can then pass the generated session key to `getSessionSigs()` as the `sessionKey` param.

In the example above, we construct a SIWE message manually, but you can use the `checkAndSignAuthMessage` when in a browser context.

## Resources You Can Request

You can pass an array of "resource ability requests" to the `getSessionSigs()` function, which will be presented to the user in the SIWE message - read more [here](../sessionSigs/resources-and-abilities) about Lit resources and abilities. The resources and abilities requested by the session key must be narrower or equal to the capabilities granted to it per the session capability object specified in the inner `AuthSig`. 

When session capability objects are omitted from the `getSessionSigs()` function call, the SDK will generate a session capability object with **wildcard permissions against all of the resources in that category by default**, i.e. ability to perform operations against all access control conditions. Read more [here](../sessionSigs/capability-objects) about how to create custom session capability objects.

## Clearing Local Storage

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).