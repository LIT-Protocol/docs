---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Social Login

Social login offers users a convenient way to authenticate with Lit Protocol by leveraging their existing social accounts. Currently, Lit Protocol supports Google and Discord OAuth.

## Integrating Social Login

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

By default, Lit's social login providers use Lit's OAuth project. In case you want to use a custom OAuth project instead of the one provided by Lit, you can pass a callback in the `signIn` method and modify the URL as needed.

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

// Begin login flow with Google but using your own OAuth project
async function authWithGoogle() {
  const provider = litAuthClient.getProvider(
    ProviderType.Google
  );
  await provider.signIn((url) => {
    const myURL = new URL(url);
    
    // Modify URL as needed
    myURL.host = 'mycustomdomain.com';
    myURL.pathname = '/myCustomOauthLoginFlow';
    // myURL.searchParams.get('app_redirect') is your redirect URI for logged in users
    
    window.location.assign(url);
  });
}
```

To login using Discord, you need to initialize the provider with `ProviderType.Discord` and pass it a Discord `clientId` along `redirectUri`

```javascript
// Set up LitAuthClient
const litAuthClient = new LitAuthClient({
  litRelayConfig: {
     // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
    relayApiKey: '<Your Lit Relay Server API Key>',
  },
});

// Initialize Discord provider
litAuthClient.initProvider(ProviderType.Discord, {
  // The URL of your web app where users will be redirected after authentication
  redirectUri: '<Your redirect URI>',
  clientId: '<Your Discord Client ID>',
});

// Begin login flow with Discord
async function authWithDiscord() {
  const provider = litAuthClient.getProvider(
    ProviderType.Discord
  );
  await provider.signIn((url) => {
    const myURL = new URL(url);
    
    // Modify URL as needed
    myURL.host = 'mycustomdomain.com';
    myURL.pathname = '/myCustomOauthLoginFlow';
    // myURL.searchParams.get('app_redirect') is your redirect URI for logged in users
    
    window.location.assign(url);
  });
}
```

:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::

## Handling the Redirect

At the `redirectUri` specified when initializing the providers, call `handleSignInRedirect`. You can also use `isSignInRedirect` method to check if the app is in the redirect state or not.

```javascript
import { isSignInRedirect } from '@lit-protocol/lit-auth-client';

async function handleRedirect() {
  // Check if app has been redirected from Lit login server
  if (isSignInRedirect(redirectUri)) {
    // Get the provider that was used to sign in
    const provider = litAuthClient.getProvider(
      ProviderType.Google,
    );
    // Get auth method object that has the OAuth token from redirect callback
    const authMethod: AuthMethod = await provider.authenticate();
    return authMethod;
  }
}
```

The provider's `authenticate` method validates the URL parameters returned from Lit's login server after a successful login, and then returns an `AuthMethod` object containing the OAuth token.

With the `AuthMethod` object, you can mint or fetch PKPs associated with the authenticated social account. View the available methods in the [API docs](https://js-sdk.litprotocol.com/modules/lit_auth_client_src.html).

## Generating `SessionSigs`

After successfully authenticating with a social login provider, you can generate `SessionSigs` using the provider's `getSessionSigs` method. The `getSessionSigs` method takes in an `AuthMethod` object, optional `LitNodeClient` object, a PKP public key, and other session-specific arguments in `SessionSigsParams` object such as `resourceAbilityRequests` and `chain`. View the [API Docs](https://js-sdk.litprotocol.com/interfaces/types_src.BaseProviderSessionSigsParams.html).

```javascript
// Get session signatures for the given PKP public key and auth method
const sessionSigs = await provider.getSessionSigs({
  authMethod: '<AuthMethod object returned from authenticate()>',
  pkpPublicKey: '<YOUR PKP PUBLIC KEY>'
  sessionSigsParams: {
    chain: 'ethereum',
    resourceAbilityRequests: [{
        resource: litResource,
        ability: LitAbility.AccessControlConditionDecryption
      }
    ],
  },
});
```

<FeedbackComponent/>
