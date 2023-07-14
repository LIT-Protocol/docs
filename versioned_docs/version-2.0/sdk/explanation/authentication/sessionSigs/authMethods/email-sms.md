# Email / SMS

Email and SMS authentication provides users with a convenient way to verify their identity using one-time passwords (OTP) sent to their registered email address or phone number. 

Authenticating with OTP codes delivered via email or SMS is a two-step process. First, an OTP code is initiated and sent to the user's registered email or phone number. The user-provided code is then verified. Upon successful verification, a signed JSON Web Token (JWT) is generated. This token will be validated when creating session signatures.

:::note
Codes sent to users via email will be received from `noreply@litprotocol.com`. Codes sent to users via SMS will include `lit-verification` within the SMS message.
:::
## Register user with email or SMS

```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<Your Lit Relay Server API Key>',
    }
});

// starting a validation session
let session = authClient.initProvider(ProviderType.Otp,{
            userId: '<User email or phone number>'
});

let status = await session.sendOtpCode();
let authMethod = await session.authenticate({
    code: "<User entered OTP code>"
});
const txHash = await session.mintPKPThroughRelayer(authMethod);
```
:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::

## ReCaptcha verification
To send an otp code to the user they must first complete a ReCaptcha verification, to verify a user via ReCaptcha you may either use our embeddable captcha or use our `site key` in our own ReCaptcha package of choice

### Embedding ReCaptcha
```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<Your Lit Relay Server API Key>',
    }
});

authClient.embeddCaptchaInElement("element-id-of-anchor", document.head);
```
In the above example the `element-id-of-anchor` is id of the html tag to inject the recaptcha view into. 
After the user confirms the `response`, it will be added to a global variable `LIT_AUTH_CLIENT_CAPTCHA_RES`. When an `OtpProvider` is created it will look for this variable when initializing.
If you wish to refresh the `response` you can use the `setCaptchaResponse` method on the `OtpProvider`

**example**
```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<Your Lit Relay Server API Key>',
    }
});
authClient.embeddCaptchaInElement("element-id-of-anchor", document.head);

// starting a validation session
let session = authClient.initProvider(ProviderType.Otp,{
            userId: '<User email or phone number>'
});
session.setCaptchaResponse(window.LIT_AUTH_CLIENT_CAPTCHA_RES);

let status = await session.sendOtpCode();
let authMethod = await session.authenticate({
    code: "<User entered OTP code>"
});
const txHash = await session.mintPKPThroughRelayer(authMethod);
```
**note** ReCaptcha Responses are valid for 2 minutes. For information on ReCaptcha, [read more](https://developers.google.com/recaptcha/intro).


### Using the ReCaptcha Site Key in Another ReCaptcha implementation
If you would like to use another ReCaptcha implementation such as [react google recaptcha](https://www.npmjs.com/package/react-google-recaptcha) you can access the ReCaptcha `site key` shown below: 
```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<Your Lit Relay Server API Key>',
    }
});

authClient.getSiteKey();
```


## Minting via Contract

An alternative to minting the PKP NFT via the Lit Relay Server is to send a transaction to the smart contract yourself. You can reference the following example data that is passed to the `mintNextAndAddAuthMethods` method of the `PKPHelper` smart contract:

- `keyType` is `2`
- `permittedAuthMethodTypes` is `[7]`
- `permittedAuthMethodIds` is an array with 1 element being the user's email or phone number.
- `permittedAuthMethodScopes` is an array with 1 zero-initialized element, e.g. `[[ethers.BigNumber.from("0")]]`
- `addPkpEthAddressAsPermittedAddress` is `true`
- `sendPkpToItself` is `true`

### Authenticating to Fetch PKP information

```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<Your Lit Relay Server API Key>',
    }
});

// starting a validation session
let session = authClient.initProvider(ProviderType.Otp,{
            userId: '<User email or phone number>'
});

let status = await session.sendOtpCode();
let authMethod = await session.authenticate({
    code: "<User entered OTP code>"
});
const txHash = await session.fetchPKPThroughRelayer(authMethod);
```
:::note 
If the user is using a phone number, the country code must be provided.
:::

Below is an example of an authentication method from successful authentication
```javascript
{
    "accessToken": "eyJhbGciOiJzZWNwMjU2azEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJMSVQtUHJvdG9jb2wiLCJzdWIiOiJMSVQtT1RQIiwiaWF0IjoxNjg0ODc1NTE0NDkxLCJleHAiOjE2ODQ4NzczMTQ0OTEsIm9yZ0lkIjoiTElUIiwicm9sZSI6InVzZXIiLCJleHRyYURhdGEiOiIrMTIwMTQwNzIwNzN8MjAyMy0wNS0yM1QyMDo1ODozNC40OTE3ODU5NDUrMDA6MDAifQ.eyJyIjoiZTA0ZDAyNjhjN2ExMzhiNmZiNDJjYTk4NmIxY2I4MWM0N2QyMTc0MzZlOWNlYzc4NGUzNWEyOTZkZmY2YjA4NSIsInMiOiI0NTE5MTVkMDY5YTZhZGE5M2U0OGY3ODUwMGM0MWUzNmMwYzQ4Y2FlODYwMmYxYWM0Njc0MTQ1YTNiMmMyNDU4In0",
    "authMethodType": 7
}
```

:::note 
 Tokens expire after 30 minutes, and must be validated for session signature signing within that period
:::


### Generating `SessionSigs`

After successfully authenticating with an `AuthMethod`, you can generate `Session Signatures` using the provider's `getSessionSigs` method. The `getSessionSigs` method takes in an `AuthMethod` object, a PKP public key, and other session-specific arguments such as `resourceAbilityRequests` and returns a `SessionSig` object.

```javascript
// Get session signatures for the given PKP public key and auth method
const sessionSigs = await provider.getSessionSigs({
  authMethod: '<AuthMethod object returned from authenticate()>',
  sessionSigsParams: {
    chain: 'ethereum',
    resourceAbilityRequests: [{
      resource: litResource,
      ability: LitAbility.AccessControlConditionDecryption
    }],
  },
});
```
