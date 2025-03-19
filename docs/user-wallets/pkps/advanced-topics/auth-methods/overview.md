import FeedbackComponent from "@site/src/pages/feedback.md";

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Auth Methods

Authentication methods are ways of assigning Programmable Key Pairs (PKP) to a specific account resource. This requires individuals to authenticate before performing operations requiring a PKP. This is a powerful feature of the Lit network as it means users can sign up for a wallet the same way they sign up for other types of digital resources, thus lowering the barrier to accessing web3 enabled applications.

## What is authentication?

An authentication method refers to the specific credential (i.e a wallet address, Google oAuth, or Discord account) that is programmatically tied to the PKP and used to control the underlying key-pair. Only the auth method associated with a particular PKP has the ability to combine the underlying shares. You can read more about how authentication works with PKPs on our [blog](https://spark.litprotocol.com/how-authentication-works-with-pkps/).

Right now, there are two main ways to do auth with Lit Actions. We will dive into these two methods below:
1. [Using Lit Auth Directly](#using-lit-auth-directly)
2. [Custom Auth / Adding new Auth Methods not yet supported by Lit](./custom-auth)

## Using Lit Auth Directly

Several auth methods are supported by Lit directly. These include methods configured using the [PKPPermissions](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/lit-node/PKPPermissions.sol) contract, the user holding the PKP NFT, or assigned via a Lit Action with permission to sign using the PKP. If you use Lit auth directly, you are limited to the auth methods that we support. We provide an easy to use SDK to help you add auth methods to a PKP. You can find the SDK [here](https://github.com/LIT-Protocol/js-sdk/tree/master/packages/lit-auth-client).

### Existing supported auth methods

| Auth Method Name     | Auth Method Type Number | Description                                                                                                                                                                                                                                                                                         |
| -------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NULLMETHOD           | 0                       | Don't use this one, it's just a placeholder                                                                                                                                                                                                                                                         |
| ADDRESS              | 1                       | An Ethereum address. As long as the user presents an AuthSig with this address, they can sign using the PKP.                                                                                                                                                                                        |
| ACTION               | 2                       | A Lit Action. This is the IPFS CID of the Javascript that is your Lit Action, base58 decoded. As long as the user is calling a Lit Action with this CID, the Lit Action can sign using this PKP. It's very important to only authorize actions that you trust, because they can sign using the PKP. |
| WEBAUTHN             | 3                       | A WebAuthn Public Key. Take a look at our [WebAuthn example](https://github.com/LIT-Protocol/oauth-pkp-signup-example/tree/main) to learn more.                                                                                                                                                     |
| DISCORD              | 4                       | Discord Oauth Login                                                                                                                                                                                                                                                                                 |
| GOOGLE               | 5                       | Google Oauth Login. You should try to use the Google JWT Oauth Login below if you can, since it's more efficient and secure.                                                                                                                                                                        |
| GOOGLE_JWT           | 6                       | Google Oauth Login, except where Google provides a JWT. This is the most efficient way to use Google Oauth with Lit because the Lit nodes only need to check the JWT signature against the Google certificates, and don't need to make HTTP requests to the Google servers to verify the token.     |
| APPLE_JWT            | 8                       | Sign in with Apple Login                                                                                                                                                                                                                                                                            |
| STYTCH_JWT           | 9                       | Stytch Login using the Stytch user. Can use any supported Stytch auth method but note - the Stytch account admin can change underlying identifiers like phone number. To prevent this attack, use one of the explicit Stytch auth methods below                                                     |
| STYTCH_EMAIL_OTP     | 10                      | Stytch Login using the Stytch user's email address. This is a one-time password (OTP) sent to the user's email address.                                                                                                                                                                             |
| STYTCH_SMS_OTP       | 11                      | Stytch Login using the Stytch user's phone number. This is a one-time password (OTP) sent to the user's phone number.                                                                                                                                                                               |
| STYTCH_WHATS_APP_OTP | 12                      | Stytch Login using the Stytch user's WhatsApp number. This is a one-time password (OTP) sent to the user's WhatsApp account.                                                                                                                                                                        |
| STYTCH_TOTP          | 13                      | Stytch Login using the Stytch user's TOTP. This is a one-time password (OTP) generated by the user's authenticator app.                                                                                                                                                                             |

Check out the implementation details within the SDK section [here](./add-remove-auth-methods.md).

**Note:** When using the `ACTION` Auth Method, it's necessary to convert the IPFS CID from base58 encoding to bytes-like before passing it to the Lit Protocol SDK. You can achieve this conversion using the `getBytesFromMultihash` function provided in the `utils` module of the `contracts-sdk`.

### Auth Method Scopes

Auth methods support scoping, which permits what they can be used for within Lit. These scopes are passed in to the "scopes" array as numbers when adding an auth method, or minting a PKP with PKPHelper. An overview of minting with scopes is provided in this [section](../../minting/overview). The scopes are as follows:

| Scope Name         | Scope Number | Description                                                                                                                                                                                                                                               |
| ------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign Anything      | 1            | This scope allows signing any data                                                                                                                                                                                                                        |
| Personal Sign | 2            | This scope only allows signing messages using the [EIP-191 scheme](https://eips.ethereum.org/EIPS/eip-191) which prefixes "Ethereum Signed Message" to the data to be signed. This prefix prevents creating signatures that can be used for transactions. |

You can also set scopes: `[]` which will mean that the auth method can only be used for authentication, but not authorization. This means that the auth method can be used to prove that the user is who they say they are, but cannot be used to sign transactions or messages.

Any auth methods (regardless of scope) passed in to a Lit Action will be resolved/checked and put into the Lit.Auth object which is available inside the Lit Action. However, when you try to sign something using signEcdsa(), you'll find that it checks the scopes of the auth methods passed in, and will only sign if the appropriate scope is present.

Using this strategy, you could have a Lit Action that governs all signing for a user, and then add many auth methods with scopes: [], so that they cannot be used on their own without the Lit Action. You would then also use addPermittedAction() with scopes: [1] on the PKP to permit that action to sign. Then, inside the action, you can check if the auth methods resolved in Lit.Auth are authorized to sign, and if so, sign the data.

Using this strategy, you could implement your own MFA, where the user must present 2 or more auth methods to sign something, for example.

**Adding permitted scopes to existing PKPs**
1. Verify the scopes:
```js
import { getAuthIdByAuthMethod } from '@lit-protocol/lit-auth-client';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { AUTH_METHOD_SCOPE, AUTH_METHOD_TYPE } from '@lit-protocol/constants';

const authMethod = {
  authMethodType: AUTH_METHOD_TYPE.EthWallet,
  accessToken: ...,
};

const authId = await getAuthIdByAuthMethod(authMethod);

const scopes = await contractClient.pkpPermissionsContract.read.getPermittedAuthMethodScopes(
  tokenId,
  AUTH_METHOD_TYPE.EthWallet,
  authId,
  3 // there are only 2 scope numbers atm. and index 0 doesn't count
);

// -- validate both scopes should be false
if (scopes[1] !== false) {
  return fail('scope 1 (sign anything) should be false');
}

if (scopes[2] !== false) {
  return fail('scope 2 (personal sign) should be false');
}
```
2. Set the scopes:
```js
import { getAuthIdByAuthMethod } from '@lit-protocol/lit-auth-client';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { AUTH_METHOD_SCOPE, AUTH_METHOD_TYPE } from '@lit-protocol/constants';

const authMethod = {
  authMethodType: xx,
  accessToken: xxx,
};

const authId = await getAuthIdByAuthMethod(authMethod);

const setScopeTx =
  await contractClient.pkpPermissionsContract.write.addPermittedAuthMethodScope(
    tokenId,
    AUTH_METHOD_TYPE.EthWallet,
    authId,
    AUTH_METHOD_SCOPE.SignAnything
  );

await setScopeTx.wait();
```

**Demos**: 
1. [Minting a PKP with an auth method and permitted scopes (Easy)](https://github.com/LIT-Protocol/js-sdk/blob/feat/SDK-V3/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-and-set-scope-1-2-easy.mjs)

2. [Minting a PKP with an auth method and permitted scopes (Advanced)](https://github.com/LIT-Protocol/js-sdk/blob/feat/SDK-V3/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-and-set-scope-1-advanced.mjs)

3. [Minting a PKP with no permissions, then add permitted scopes](https://github.com/LIT-Protocol/js-sdk/blob/feat/SDK-V3/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-then-set-scope-1.mjs)

4. [Minting a PKP using the relayer, adding permitted scopes, and getting session sigs](https://github.com/LIT-Protocol/js-sdk/tree/feat/SDK-V3/e2e-nodejs/group-pkp-session-sigs)

### Adding a Permitted Address

You can use the [PKPPermissions contract](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/lit-node/PKPPermissions.sol) to add additional permitted auth methods and addresses to your PKP. Note that any permitted users will be able to execute transactions, authorized Lit Actions, and additional functionality associated with that PKP.

### Sending the PKP to itself

Sending a PKP to itself is possible, because the PKP is an NFT and also a wallet. This is useful if you want to make sure that only the PKP itself can change it's auth methods. You can use our handy auth helper contract [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/lit-node/PKPHelper.sol) and use that contract there is a parameter called `sendPkpToItself` in the `mintNextAndAddAuthMethods` function that you can set to true to send the PKP to itself.

### Obtaining the PKP Public Key

After a PKP is generated and assigned an auth method, you can pass the AuthMethodType and AuthMethodId into this [function](https://github.com/LIT-Protocol/LitNodeContracts/blob/ed2adf77e63f371ef864846dc9e92fef42f0ebb1/contracts/PKPPermissions.sol#L99) to obtain the PKP ID. The PKP ID can be used to fetch the PKP's public key by passing it into this [function](https://github.com/LIT-Protocol/LitNodeContracts/blob/ed2adf77e63f371ef864846dc9e92fef42f0ebb1/contracts/PKPPermissions.sol#L78).

The PKP public key is required to initialize a new 'wallet' object when using [Lit and WalletConnect](https://github.com/LIT-Protocol/pkp-walletconnect/blob/main/components/CallRequest.js#L44) together.

You will also need the PKP public key in order to generate a [sessionSig](https://developer.litprotocol.com/v3/sdk/authentication/session-sigs/intro) which is required to communicate with the Lit nodes, as seen in this [example](https://github.com/LIT-Protocol/oauth-pkp-signup-example/blob/main/src/App.tsx#L422).

## Custom Auth / Adding new Auth Methods not yet supported by Lit

More info on this is available [here](./custom-auth).

<FeedbackComponent/>
