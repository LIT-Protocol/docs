---
sidebar_position: 2
---

# Generate Session Signatures

You can use any wallet or signing method to generate session signatures with the `getSessionSigs()` function. This function generates a session keypair and uses a callback function that signs the generated session key to create an `AuthSig` that is scoped to specific capabilities.

TODO: Update example

```javascript
import { LitNodeClient } from '@lit-protocol/lit-node-client';

// Create a new ethers.js Wallet instance
const wallet = new Wallet(process.env.YOUR_PRIVATE_KEY);

// Instantiate a LitNodeClient
const litNodeClient = new LitNodeClient({
  litNetwork: "serrano",
  debug: true,
});
await litNodeClient.connect();

// When the getSessionSigs function is called, it will generate a session key and sign it
// using this callback function.
let authNeededCallback = async ({ chain, resources, expiration, uri }) => {
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

let sessionSigs = await litNodeClient.getSessionSigs({
  chain: "ethereum",
  resources: ["litAction://*"],
  authNeededCallback,
});
```

The `getSessionSigs()` function will try to create a session key for you and store it in local storage. You can also generate the session key yourself using `generateSessionKeyPair()` function and store it however you like. You can then pass the generated session key to `getSessionSigs()` as the `sessionKey` param.

## Using `LitAuthClient`

The `@lit-protocol/lit-auth-client` package provides a convenient function that wraps `getSessionSigs()` and generates session signatures for a given PKP public key and `AuthMethod` object for you.

```javascript
import { LitAuthClient } from '@lit-protocol/lit-auth-client';

// Set up LitAuthClient
const litAuthClient = new LitAuthClient({
  litRelayConfig: {
     // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
    relayApiKey: '<Your Lit Relay Server API Key>',
  },
});

// Initialize Ethereum account provider
const provider = litAuthClient.initProvider(ProviderType.EthWallet);

// Get the auth method object that contains a wallet signature
const authMethod = await provider.authenticate({
  address: '<Wallet address>',
  signMessage: '<Function that uses a wallet to sign a message>'
});

// Get session signatures for the given PKP public key and auth method
const sessionSigs = await provider.getSessionSigs({
  pkpPublicKey: '<Public key of PKP to scope the SessionSigs to>',
  authMethod: '<AuthMethod object returned from authenticate()>',
  sessionSigsParams: {
    chain: 'ethereum',
    resources: [`litAction://*`],
  },
});
```

## Resources you can request

You can pass an array of resources to the `getSessionSigs()` function, which will be presented to the user in the SIWE message. Resources are things the signature is permitted to be used for. These can be specific items, such as the ID of an encryption condition, or they can be wildcards. The default is all resources with wildcards. The resources are strings that follow the format `lit<conditionType>://<resourceId>`. The conditionType can be either `SigningCondition` or `EncryptionCondition`. The resourceId is a string that uniquely identifies the resource you are requesting access to. For signing conditions, the resourceId is a hash of the resourceId JSON you are requesting access to. For encryption conditions, the resourceId is a hash of the encrypted symmetric key that you are requesting access to.

Since Session keys need the capability to sign on behalf of you and your wallet, you grant them condition types, but with the addition `Capability` at the end. For example, `litSigningConditionCapability://*` will give the session key the capability to sign on your behalf for any signing condition. `litEncryptionConditionCapability://*` will give the session key the capability to sign on your behalf for any encryption condition.

The protocol prefixes of the resources are:

| Resource                        | Protocol Prefix                     | Identifier              | Type                | Usage                                                                                                                                                                                                      |
| ------------------------------- | ----------------------------------- | ----------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encryption Condition            | litEncryptionCondition://           | Encryption condition ID | Restrictive         | Specify which encryption conditions can be processed                                                                                                                                                       |
| Signing Conditions              | litSigningCondition://              | Signing condition ID    | Restrictive         | Specify which signing conditions can be processed                                                                                                                                                          |
| A PKP                           | litPKP://                           | PKP Token ID            | Restrictive         | Specify which PKPs can be used                                                                                                                                                                             |
| A RLI NFT                       | litRLI://                           | RLI Token ID            | Restrictive         | Specify which RLIs can be used                                                                                                                                                                             |
| A Lit Action                    | litAction://                        | Lit Action IFPS ID      | Restrictive         | Specify which Lit Actions can be called                                                                                                                                                                    |
| Encryption Condition Delegation | litEncryptionConditionCapability:// | Encryption condition ID | Granting Capability | Specify which encryption conditions can be processed on behalf of this user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key. |
| Signing Conditions Delegation   | litSigningConditionCapability://    | Signing condition ID    | Granting Capability | Specify which signing conditions can be processed on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.     |
| PKP Delegation                  | litPKPCapability://                 | PKP Token ID            | Granting Capability | Specify which PLPs can be used on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.                        |
| RLI Delegation                  | litRLICapability://                 | RLI TokenID             | Granting Capability | Specify which RLIs can be used on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.                        |
| Lit Action Delegation           | litActionCapability://              | Lit Action IPFS ID      | Granting Capability | Specify which Lit Actions can be called on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.               |
|                                 |                                     |                         |                     |                                                                                                                                                                                                            |

## Clearing the stored session key and signature

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).