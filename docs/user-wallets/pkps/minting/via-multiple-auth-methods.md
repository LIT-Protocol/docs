import FeedbackComponent from "@site/src/pages/feedback.md";

# Mint via multiple Auth Methods
You can also mint a PKP using [multiple Auth Methods](../advanced-topics/auth-methods/overview.md) (i.e. Multi-Factor Authentication). This can be done in two different ways:
1. [Using `LitAuthClient`](#using-litauthclient)
2. [Using `ContractsSDK`](#using-contractssdk)

## Using `LitAuthClient`

In this section, we will demonstrate how to mint a PKP using two popular authentication methods: 
1. Google OAuth Login, and 
2. Stytch SMS (OTP) 
  
via `LitAuthClient`. This approach enhances security by requiring authentication through both a social login provider and a one-time password sent via SMS. You can mint a PKP using Google OAuth token and a generated token from sucessful OTP code confirmation, by following these steps:

### Installing the `LitAuthClient` package
```bash
yarn add @lit-protocol/lit-auth-client
```

### Integrating Google OAuth Login

`@lit-protocol/lit-auth-client` makes it easy to implement social login in your web apps. The library provides a `LitAuthClient` class that you can use to initialize a provider for each supported social login method. Each provider has a `signIn()` method that you can call to begin the authentication flow.

```javascript
import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { ProviderType } from '@lit-protocol/constants';

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

:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::

### Handling the Redirect

At the `redirectUri` specified when initializing the providers, call `handleSignInRedirect`. You can also use `isSignInRedirect` method to check if the app is in the redirect state or not.

```javascript
import { LitAuthClient, isSignInRedirect } from '@lit-protocol/lit-auth-client';
import { AuthMethodScope, ProviderType } from '@lit-protocol/constants';

async function handleRedirect() {
  // Check if app has been redirected from Lit login server
  if (isSignInRedirect(redirectUri)) {
    // Get the provider that was used to sign in
    const provider = provider = litAuthClient.getProvider(
      ProviderType.Google,
    );
    // Get auth method object that has the OAuth token from redirect callback
    const authMethodGoogle: AuthMethod = await provider.authenticate();
    return authMethodGoogle;
  }
}
```

The provider's `authenticate` method validates the URL parameters returned from Lit's login server after a successful login, and then returns an `AuthMethod` object containing the OAuth token.

### Integrating SMS (OTP) Authentication

You can also authenticate users using SMS (OTP) by sending a one-time passcode to their phone number. This can be done using the `Stytch` provider.

```javascript
import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { AuthMethodScope, ProviderType } from '@lit-protocol/constants';

// Set up LitAuthClient
const litAuthClient = new LitAuthClient({
  litRelayConfig: {
     // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
    relayApiKey: '<Your Lit Relay Server API Key>',
  },
});

// Send one-time passcodes via phone number through Stytch
async function sendPasscode(userId) {  
  // userId: phone number
  const response = await stytchClient.otps.sms.loginOrCreate(
    !userId.startsWith('+') ? `+${userId}` : userId
  );
  return response.method_id;
}
```

### Authenticating with SMS (OTP)

After sending the OTP code, you can authenticate the user with the code and the method ID returned from `sendPasscode`.

```javascript
// Get auth method object by validating Stytch JWT 
async function authenticateWithStytch(code, methodId) {
  // code: OTP code, methodId: method_id returned from sendPasscode
  
  // Authenticate the OTP code with Stytch
  const response = await stytchClient.otps.authenticate(code, methodId, {
    session_duration_minutes: 60,
  });

  // Initialize StytchSmsFactorOtp provider
  const provider = litAuthClient.initProvider(ProviderType.StytchSmsFactorOtp, {
    appId: YOUR_STYTCH_PROJECT_ID
  });

  // Get auth method object after autheticating Stytch JWT
  const authMethodSMS = await provider.authenticate({ response.session_jwt, response.user_id });
  return authMethodSMS;
}
```

### Mint PKP with Multiple Auth Methods

Once you have authenticated the user with both Google OAuth Login and SMS (OTP), you can proceed to mint a PKP using both Auth Methods.

```javascript
async function mintPKPWithMultipleAuthMethods(authMethodGoogle, authMethodSMS) {
  let authClient = new LitAuthClient({
    litRelayConfig: {
      relayApiKey: '<Your Lit Relay Server API Key>',
    },
  });

  // Mint PKP using both Auth Methods
  let res = await authClient.mintPKPWithAuthMethods(
    [authMethodGoogle, authMethodSMS],   // Auth Methods
    {
      pkpPermissionScopes: [[1], [1]],  // PKP Permission Scopes
      sendPkpToitself: true,   // whether to send PKP to itself or not
      addPkpEthAddressAsPermittedAddress: true,  // whether to add PKP eth address as permitted address or not
    }
  );

  if (typeof res != 'object') {
    console.error('Minting failed');
    return;
  }

  console.log('Minting successful', res);
  return res;
}
```


## Using `ContractsSDK`

You can also mint a PKP using multiple Auth Methods via `ContractsSDK` by following these steps:

### Installing the `LitAuthClient` package
```bash
yarn add @lit-protocol/lit-auth-client 
yarn add @lit-protocol/contracts-sdk
```

### Setting up the `LitContracts` client

First, configure your Ethereum provider and the controller wallet. Initialize the LitContracts client with the appropriate network settings.

```javascript
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { LitNetwork } from "@lit-protocol/constants";

const contractClient = new LitContracts({
  signer: controllerWallet,    // Your ethers wallet
  network: LitNetwork.DatilTest,
});

await contractClient.connect();
```

### Defining the Auth Methods
Define the auth method you intend to use for minting the PKP. This example uses an Ethereum wallet's authentication signature, but you can adapt this to include other methods such as OAuth tokens from social logins or OTP codes from email/SMS verification.

```javascript
const authMethodWallet = {
  authMethodType: 1, // Adjust based on the auth method
  accessToken: JSON.stringify(authSig),  // Use authSig obtained from the controller wallet
};

const authIdWallet = LitAuthClient.getAuthIdByAuthMethod(authMethodWallet);

const authIdAction = contractClient.utils.getBytesFromMultihash('<IPFS-hash-of-Lit-Action>');
```

### Minting PKP with Multiple Auth Methods

Once you have defined the auth methods, you can proceed to mint a PKP using both Auth Methods.

```javascript
// Get the mint cost
const mintCost = await contractClient.pkpNftContract.read.mintCost();

// Mint PKP using both Auth Methods
const mintTx = await contractClient.pkpHelperContract.write.mintNextAndAddAuthMethods(
  2, // key type
  [AuthMethodType.EthWallet, AuthMethodType.LitAction], // Specify the auth method types
  [authIdWallet, authIdAction],  // Specify the auth method IDs
  ['0x', '0x'], // Specify the auth method public keys
  [[1], [1]], // Specify the auth method scopes
  true,  // Whether to add PKP eth address as permitted address or not
  true, // Whether to send PKP to itself or not
  { value: mintCost }
);

// Wait for the transaction to be mined
const mintTxReceipt = await mintTx.wait();
// Get the tokenId of the minted PKP
const tokenId = mintTxReceipt.events[0].topics[1];
```

View `Minting a PKP with multiple Auth Methods via ContractsSDK` example in our SDK [here](https://github.com/LIT-Protocol/js-sdk/blob/251482b90761e9e0e734cb08c0c4a93b563b6869/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-and-set-scope-1-advanced.mjs).
<FeedbackComponent/>
