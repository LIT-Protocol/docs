import FeedbackComponent from "@site/src/pages/feedback.md";

# Stytch OTP / TOTP

Email and SMS authentication provides users with a convenient way to verify their identity using one-time passwords (OTP) sent to their registered email address or phone number.
We have chosen (Stytch)[https://stytch.com/docs/api/send-otp-by-sms] as our OTP Authentication provider. Once you have setup your Stytch project you can use it via project meta data in our `lit-auth-client`
package.

:::note
The `lit-auth-client` requires a user session to be established in order to authenticate the session as this is the only way to obtain a `session_jwt` which our sdk requires.
See Stytch documentation for more information.
:::

We support all `otp` and `totp` authentication implementations stytch supports through the `StytchOtpProvider` this will use the `sub` property of the session token from our Stytch authentication session as the `user id` to form the `auth method identifier` which is registered to the pkp for permitting the authentication method.

- Email
- sms
- WhatsApp
- TOTP (authenticator apps)

## Obtain A Stytch session

```javascript
import * as stytch from "stytch";

const client = new stytch.Client({
  project_id: STYTCH_PROJECT_ID,
  secret: STYTCH_SECRET,
});

const emailResponse = await prompts({
  type: "text",
  name: "email",
  message: "Enter your email address",
});

const stytchResponse = await client.otps.email.loginOrCreate({
  email: emailResponse.email,
});

const otpResponse = await prompts({
  type: "text",
  name: "code",
  message: "Enter the code sent to your email:",
});

const authResponse = await client.otps.authenticate({
  method_id: stytchResponse.email_id,
  code: otpResponse.code,
  session_duration_minutes: 60 * 24 * 7,
});

let sessionResp = await client.sessions.get({
  user_id: authResponse.user_id,
});

// the sessionStatus contains the relevant session token
const sessionStatus = await client.sessions.authenticate({
  session_token: authResponse.session_token,
});
```

## Use an Authenticated Stytch Session with the `LitRelay`

```javascript
import { LIT_NETWORK } from "@lit-protocol/constants";
import { StytchOtpProvider } from "@lit-protocol/providers";
import { LitRelay } from "@lit-protocol/lit-auth-client";

const litRelay = new LitRelay({
  relayUrl: LitRelay.getRelayUrl(LIT_NETWORK.DatilDev),
  relayApiKey: 'test-api-key',
});

const session = new StytchOtpProvider({ relay: litRelay, litNodeClient, options: {    
    userId: sessionStatus.session.user_id,
    appId: "project-test-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"} 
    });

// from the above example of using the Stytch client to get an authenticated session
const authMethod = await session.authenticate({
  accessToken: sessionStatus.session_jwt,
});
```

## Using Specific Stytch Authentication Factors

We also support specific Stytch `authentication factors` which are the same as using the default `StytchOtp` provider type, however, instead of using the `user identifier` Stytch assigns to each user.
The `user id` will be the `Authentication Factor` transport. Meaning for example of sms otp was the authentication factor, then the phone number of the user will be the `user id`
below is a table of what each `auth factor` will use as the `user id`

| PROVIDER_TYPE           | user identifier value |
| ----------------------- | --------------------- |
| StytchEmailFactorOtp    | email address         |
| StytchSmsFactorOtp      | phone number          |
| StytchWhatsAppFactorOtp | phone number          |
| StytchTotpFactor        | totp id               |

There are two main benefits to using an `auth factor` over the generic Stytch OTP provider type.

- Admins of the stytch project cannot modify the user's authentication on their side.
- If being used through Claiming, the pkp public key can be derived without users authenticating beforehand.

Using a specific authentication factor means that each user authentication factor is a new user to the Lit Nodes. Meaning if a user has two different auth factors, they are two different authentication methods.

### Stytch Auth Method Provider Types

| Name                    | type |
| ----------------------- | ---- |
| StytchOtp               | 9    |
| StytchEmailFactorOtp    | 10   |
| StytchSmsFactorOtp      | 11   |
| StytchWhatsAppFactorOtp | 12   |
| StytchTotpFactorOtp     | 13   |

## Minting via Contract

An alternative to minting the PKP NFT via the Lit Relay Server is to send a transaction to the smart contract yourself. You can reference the following example data that is passed to the `mintNextAndAddAuthMethods` method of the `PKPHelper` smart contract:

- `keyType` is `2`
- `permittedAuthMethodTypes` is `[9 - 13]` depending on the type of Stytch authentication used
- `permittedAuthMethodIds` is an array with 1 element being the user's email or phone number.
- `permittedAuthMethodScopes` is an array with 1 zero-initialized element, e.g. `[[ethers.BigNumber.from("0")]]`
- `addPkpEthAddressAsPermittedAddress` is `true`
- `sendPkpToItself` is `true`

### Authenticating to Fetch PKP information

```javascript
import { AUTH_METHOD_SCOPE } from "@lit-protocol/constants";

// Using the session examples above you can call to fetch pkps by the auth method gotten from the provider examples
const txHash = await session.fetchPKPThroughRelayer(authMethod,  {
    permittedAuthMethodScopes: [[AUTH_METHOD_SCOPE.SignAnything]]
});
```

:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::

:::note
If the user is using a phone number, the country code must be provided.
:::

Below is an example of an authentication method from successful authentication

```javascript
{
    "accessToken": "eyJhbGciOiJzZWNwMjU2azEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJMSVQtUHJvdG9jb2wiLCJzdWIiOiJMSVQtT1RQIiwiaWF0IjoxNjg0ODc1NTE0NDkxLCJleHAiOjE2ODQ4NzczMTQ0OTEsIm9yZ0lkIjoiTElUIiwicm9sZSI6InVzZXIiLCJleHRyYURhdGEiOiIrMTIwMTQwNzIwNzN8MjAyMy0wNS0yM1QyMDo1ODozNC40OTE3ODU5NDUrMDA6MDAifQ.eyJyIjoiZTA0ZDAyNjhjN2ExMzhiNmZiNDJjYTk4NmIxY2I4MWM0N2QyMTc0MzZlOWNlYzc4NGUzNWEyOTZkZmY2YjA4NSIsInMiOiI0NTE5MTVkMDY5YTZhZGE5M2U0OGY3ODUwMGM0MWUzNmMwYzQ4Y2FlODYwMmYxYWM0Njc0MTQ1YTNiMmMyNDU4In0",
    "authMethodType": 9
}
```

## Generating `SessionSigs`

After successfully authenticating with a social login provider, you can generate `SessionSigs` using the provider's `getSessionSigs` method. The `getSessionSigs` method takes in an `AuthMethod` object, optional `LitNodeClient` object, a PKP public key, and other session-specific arguments in `SessionSigsParams` object such as `resourceAbilityRequests` and `chain`. View the [API Docs](https://js-sdk.litprotocol.com/interfaces/types_src.BaseProviderSessionSigsParams.html).

```javascript
import { LIT_ABILITY } from "@lit-protocol/constants";

// Get session signatures for the given PKP public key and auth method
const sessionSigs = await provider.getSessionSigs({
  authMethod: '<AuthMethod object returned from authenticate()>',
  pkpPublicKey: '<YOUR PKP PUBLIC KEY>'
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

### Generating Session Signatures using the `LitNodeClient`

Initalize an instance of the `LitNodeClient` and connect to the network

```javascript
const litNodeClient: LitNodeClientNodeJs = new LitNodeClientNodeJs({
  litNetwork: "datil-dev",
  debug: true,
});
await litNodeClient.connect();
```

Request a specified pkp to sign a session signature, authenticating with an `Auth Method` for a given `PKP`
The `session.fetchPKPThroughRelayer` method above can be used to query PKP public keys associated with a given auth method. You can also use the `contracts-sdk` to query PKP information by Authentication Method.

```javascript
import { LIT_ABILITY } from "@lit-protocol/constants";

// The implementation below is wrapped by the above `provider.getSessionSigs`
const authNeededCallback = async (params: AuthCallbackParams) => {
  console.log("params", params);
  const response = await litNodeClient.signSessionKey({
    sessionKey: sessionKeyPair,
    statement: params.statement,
    authMethods: [authMethod], // auth method from one of the `lit-auth-client` authentication providers
    pkpPublicKey: "<YOUR PKP PUBLIC KEY>", // pkp which has the auth method configured for authentication above
    expiration: params.expiration,
    resources: params.resources,
    chainId: 1,
  });
  console.log("callback response", response);
  return response.authSig;
};

const resourceAbilities = [
  {
    resource: new LitPkpResource("*"),
    ability: LIT_ABILITY.PKPSigning,
  },
];
const sessionSigs = await litNodeClient
  .getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    resourceAbilityRequests: resourceAbilities,
    sessionKey: sessionKeyPair,
    authNeededCallback,
  })
  .catch((err) => {
    console.log("error while attempting to access session signatures: ", err);
    throw err;
  });
console.log("session signatures: ", sessionSigs);
const authSig = sessionSigs[Object.keys(sessionSigs)[0]];
console.log("authSig", authSig);
```

<FeedbackComponent/>
