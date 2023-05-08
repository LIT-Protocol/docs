---
sidebar_position: 4
---

# WebAuthn

WebAuthn enables users to authenticate with web apps using biometrics, passkeys, or other authenticators, providing user-friendly and secure alternative to traditional password-based authentication.

WebAuthn involves two key flows: registration and authentication. During registration, a new public key credential associated with the user and their device is created. During authentication, the user proves ownership of the corresponding private key by signing a challenge.

The `@lit-protocol/lit-auth-client` package leverages the `@simplewebauthn/browser` library and makes it easy to integrate WebAuthn into your web apps.

## Registration

Registration is similar to creating a new account. During the registration process, the user is prompted to create a new public key credential. The public key credential is then sent to the server, which verifies the credential and mints a new PKP for the user.

```javascript
// Set up LitAuthClient
const litAuthClient = new LitAuthClient({
  litRelayConfig: {
     // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
    relayApiKey: '<Your Lit Relay Server API Key>',
  },
});

// Initialize WebAuthn provider
litAuthClient.initProvider(ProviderType.WebAuthn);

async function registerWithWebAuthn() {
  const provider = litAuthClient.getProvider(ProviderType.WebAuthn);
  // Register new WebAuthn credential
  const options = await provider.register();

  // Verify registration and mint PKP through relay server
  const txHash = await provider.verifyAndMintPKPThroughRelayer(options);
  const response = await provider.relay.pollRequestUntilTerminalState(
    txHash
  );
  // Return public key of newly minted PKP
  return response.pkpPublicKey;
}
```

## Authentication

Authentication is similar to logging in with an existing account. During the authentication process, the user is prompted to sign a challenge. The signed challenge is then sent to the Lit nodes, which verify the signature and returns the validated authentication data.

```javascript
async function authenticateWithWebAuthn() {
  const provider = litAuthClient.getProvider(ProviderType.WebAuthn);
  const authMethod = await provider.authenticate();
  return authMethod;
}
```

The `authenticate` method returns an `AuthMethod` object containing the authentication data. You can use the authentication data to mint or fetch PKPs associated with the verified WebAuthn credential.

TODO: AuthSig?

## Design considerations

While the registration step involves minting a PKP via the Lit Relay Server (or, optionally, you can send a transaction to the contract yourself), we have implemented an authentication scheme that involves sending signed challenges to the decentralized Lit Network instead.

This works by using a recent block hash on the underlying blockchain (Polygon Mumbai) as a challenge, and having the user authenticate with their platform authenticator to generate a credential assertion (signature). When each Lit node receives this credential assertion from the client, they can recover the COSE credential public key which is stored in the smart contract to verify whether the assertion / signature is valid. If the signature is valid, then the nodes will return `AuthSig` signature shares back to the client.

:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::