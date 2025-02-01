import FeedbackComponent from "@site/src/pages/feedback.md";

# Mint via Social or Email/SMS (OTP) 

## Social

You can mint a PKP by presenting a valid OAuth token as an authentication method to the Lit Relay server. Currently, only Google OAuth tokens are supported, but we plan to support Discord in the near term. 

You can mint PKPs using Google OAuth tokens by following these steps:

### Installing the `LitAuthClient` package
```bash
yarn add @lit-protocol/lit-auth-client
yarn add @lit-protocol/providers
```

### Integrating Social Login

`@lit-protocol/lit-auth-client` makes it easy to implement social login in your web apps. The library provides a `LitRelay` class that you can use to initialize a provider. The specific providers will be in the `@lit-protocol/providers` package. Each provider has a `signIn()` method that you can call to begin the authentication flow.

```javascript
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitRelay } from '@lit-protocol/lit-auth-client';
import { StytchOtpProvider } from '@lit-protocol/providers';
import { PROVIDER_TYPE, LIT_NETWORK } from '@lit-protocol/constants';

const litNodeClient = new LitNodeClient({
  litNetwork: LIT_NETWORK.DatilDev,
  debug: true,
});
await litNodeClient.connect();

const litRelay = new LitRelay({
  relayUrl: LitRelay.getRelayUrl(LIT_NETWORK.DatilDev),
  relayApiKey: 'test-api-key',
});

const googleProvider = new GoogleProvider({ relay: litRelay, litNodeClient });

// Begin login flow with Google
await googleProvider.signIn();
```

:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::

### Handling the Redirect

At the `redirectUri` specified when initializing the providers, call `handleSignInRedirect`. You can also use `isSignInRedirect` method to check if the app is in the redirect state or not.

```javascript
import { LitRelay, isSignInRedirect } from '@lit-protocol/lit-auth-client';
import { AUTH_METHOD_SCOPE, PROVIDER_TYPE } from '@lit-protocol/constants';

async function handleRedirect() {
  // Check if app has been redirected from Lit login server
  if (isSignInRedirect(redirectUri)) {
    // Get auth method object that has the OAuth token from redirect callback
    const authMethod: AuthMethod = await googleProvider.authenticate();
    // -- setting scope for the auth method
    // <https://developer.litprotocol.com/v3/sdk/wallets/auth-methods/#auth-method-scopes>
    const options = {
        permittedAuthMethodScopes: [[AUTH_METHOD_SCOPE.SignAnything]],
    };
    // Mint PKP using the auth method
    const mintTx = await googleProvider.mintPKPWithAuthMethods(
        [authMethod],
        options
    );
    // Fetch PKPs associated with the authenticated social account
    const pkps = await googleProvider.getPKPsForAuthMethod(authMethod);
    return pkps;
  }
}
```

The provider's `authenticate` method validates the URL parameters returned from Lit's login server after a successful login, and then returns an `AuthMethod` object containing the OAuth token.

With the `AuthMethod` object, you can mint and fetch PKPs associated with the authenticated social account. View the available methods in the [API docs](https://js-sdk.litprotocol.com/modules/lit_auth_client_src.html).

### Generating `SessionSigs`

After successfully authenticating with a social login provider, you can generate `SessionSigs` using the provider's `getSessionSigs` method. The `getSessionSigs` method takes in an `AuthMethod` object, optional `LitNodeClient` object, a PKP public key, and other session-specific arguments in `SessionSigsParams` object such as `resourceAbilityRequests` and `chain`. View the [API Docs](https://js-sdk.litprotocol.com/interfaces/types_src.BaseProviderSessionSigsParams.html).

```javascript
import { LIT_ABILITY } from "@lit-protocol/constants";

// Get session signatures for the given PKP public key and auth method
const sessionSigs = await provider.getSessionSigs({
  authMethod: '<AuthMethod object returned from authenticate()>',
  pkpPublicKey: pkps[0].publicKey, // Note, an AuthMethod can own more than one PKP
  sessionSigsParams: {
    chain: 'ethereum',
    resourceAbilityRequests: [{
        resource: litResource,
        ability: LIT_ABILITY.AccessControlConditionDecryption
      }
    ],
  },
});
```


## Email / SMS (OTP)

You can also mint a PKP by presenting a generated token from successful OTP code confirmation, which will be returned by the `lit-auth-client` in the `AuthMethod` return from successful code confirmation.

```javascript
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitRelay } from '@lit-protocol/lit-auth-client';
import { LIT_NETWORK, PROVIDER_TYPE } from '@lit-protocol/constants';
import { StytchOtpProvider } from '@lit-protocol/providers';

const litNodeClient = new LitNodeClient({
  litNetwork: LIT_NETWORK.DatilDev,
  debug: true
})
await litNodeClient.connect();

const litRelay = new LitRelay({
  relayUrl: LitRelay.getRelayUrl(LIT_NETWORK.DatilDev),
  relayApiKey: 'test-api-key',
});

// Send one-time passcodes via email or phone number through Stytch
async function sendPasscode(method, userId) {  
  // method: 'email' or 'sms', userId: email or phone number
  let response;
  if (method === 'email') {
    response = await stytchClient.otps.email.loginOrCreate(userId);
  } else {
    response = await stytchClient.otps.sms.loginOrCreate(
      !userId.startsWith('+') ? `+${userId}` : userId
    );
  }
  return response.method_id;
}

// Get auth method object by validating Stytch JWT and mint PKP after authenticating it
async function authenticateWithStytch(method, code, methodId) {
  // method: 'email' or 'sms', code: OTP code, methodId: method_id returned from sendPasscode
  
  // Authenticate the OTP code with Stytch
  const response = await stytchClient.otps.authenticate(code, methodId, {
    session_duration_minutes: 60,
  });

  // Initialize StytchEmailFactorOtp or StytchSmsFactorOtp provider
  const stytchOtpProvider = new StytchOtpProvider({ relay: litRelay, litNodeClient });


  // Get auth method object after authenticating Stytch JWT
  const authMethod = await stytchOtpProvider.authenticate({ response.session_jwt, response.user_id });

  // -- setting scope for the auth method
  // <https://developer.litprotocol.com/v3/sdk/wallets/auth-methods/#auth-method-scopes>
  const options = {
      permittedAuthMethodScopes: [[AUTH_METHOD_SCOPE.SignAnything]],
  };
  // Mint PKP using the auth method
  const mintTx = await stytchOtpProvider.mintPKPWithAuthMethods(
      [authMethod],
      options
  );
  // Fetch PKPs associated with the authenticated social account
  const pkps = await stytchOtpProvider.getPKPsForAuthMethod(authMethod);
  return pkps;
}
```

Read more about this process [here](../advanced-topics/auth-methods/overview.md).
<FeedbackComponent/>
