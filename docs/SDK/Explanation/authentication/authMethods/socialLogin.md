---
sidebar_position: 3
---

# Social Login

Social login offers users a convenient way to authenticate with Lit Protocol by leveraging their existing social accounts. Currently, Lit Protocol supports Google and Discord OAuth.

## Integrating social login

`@lit-protocol/lit-auth-client` makes it easy to implement social login in your web apps. The library provides a `LitAuthClient` class that you can use to initialize a provider for each supported social login method. Each provider has a `signIn()` method that you can call to begin the authentication flow.

```javascript
// Set up LitAuthClient
const litAuthClient = new LitAuthClient({
  litRelayConfig: {
     // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
    relayApiKey: '<Your Lit Relay Server API Key>',
  },
});

// Initialize Google provider
litAuthClient.initProvider(ProviderType.Google, {
  // The URL of your web app where users will be redirected after authentication
  redirectUri: '<Your redirect URI>',
});

// Begin login flow with Google
async function authWithGoogle() {
  const provider = litAuthClient.getProvider(
    ProviderType.Google
  );
  await provider.signIn();
}
```

At the start of the authentication flow, users will be redirected to the social login page hosted by Lit. Once users have successfully signed in, they will be redirected back to your web app.

## Handling the redirect

At the `redirectUri` specified when initializing the providers, call `handleSignInRedirect`. You can also use `isSignInRedirect` method to check if the app is in the redirect state or not.

```javascript
async function handleRedirect() {
  // Check if app has been redirected from Lit login server
  if (isSignInRedirect(redirectUri)) {
    // Get the provider that was used to sign in
    const provider = provider = litAuthClient.getProvider(
      ProviderType.Google,
    );
    // Get auth method object that has the OAuth token from redirect callback
    const authMethod: AuthMethod = await provider.authenticate();
    return authMethod;
  }
}
```

The provider's `authenticate` method validates the URL parameters returned from Lit's login server after a successful login, and then returns an `AuthMethod` object containing the OAuth token.

With the `AuthMethod` object, you can mint or fetch PKPs associated with the authenticated social account.

TODO: AuthSig?

:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::