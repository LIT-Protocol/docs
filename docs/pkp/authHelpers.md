---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authentication with PKPs

When you call a Lit Action, you may pass Auth Methods that should be resolved. These could be things like a WebAuthn signature, or an oauth token from a service like Discord or Google. You can see an example of this [here](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/authContext.js#L32).

## What is authentication?

An authentication method refers to the specific credential (i.e a wallet address, Google oAuth, or Discord account) that is programmatically tied to the PKP and used to control the underlying key-pair. Only the auth method associated with a particular PKP has the ability to combine the underlying shares. You can read more about how authentication works with PKPs on our [blog](https://spark.litprotocol.com/how-authentication-works-with-pkps/).

Right now, there are two main ways to do auth with Lit Actions. We will dive into these two methods below.

## Using Lit Auth Directly

Several auth methods are supported by Lit directly. These include methods configured using the [PKPPermissions](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPPermissions.sol) contract, the user holding the PKP NFT, or assigned via a Lit Action with permission to sign using the PKP. If you use Lit auth directly, you are limited to those basic auth methods that we support.

## Custom Auth

If you would like further customization over your PKP auth methods, you can do auth yourself with a Lit Action, using the auth helpers we provide (see below). In this scenario, after you give your Lit Action permission to use the PKP, the typical flow is to burn the PKP NFT or send it to itself. It is important to note, if you do decide to burn the PKP, you will be unable to add additional auth methods in the future. If you go this route, your auth basically looks like a bunch of if statements inside the Lit Action.

If you decide to use your own auth, you can still use the PKPPermissions contract to define your method(s) of choice, or deploy your own access control contract. If you use the deployed Lit PKPPermissions contract, then it is important to pick a unique authMethodType that isn't used by anyone else, ever. Since it can be a uint256, you should do something like `sha256("some unique or random string")` to pick a unique authMethodType number. You can find the current methods being used [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPPermissions.sol#L25). If this is the route you choose, you could check the PKPPermissions contract in your Lit Action using [this function](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPPermissions.sol#L25).

## How does authentication differ from authorization?

Authorization refers to an [auth signature](/SDK/Explanation/WalletSigs/authSig), which is **always required** to communicate with the Lit nodes and make a request to the network. It doesn't matter if you are decrypting a piece of data or calling a Lit Action, an auth sig will always be required.

In the case that a user doesn’t own a wallet (and therefore cannot produce a valid AuthSig), they can present their alternative auth method to the Lit SDK which will convert it into a “compliant” AuthSig. This is documented in our [docs](/SDK/Explanation/WalletSigs/sessionSigs#obtaining-session-signatures-when-the-user-doesnt-have-a-wallet). The flow is as follows:

1. Present a PKP public key and an auth token from an authorized auth method (like a Google OAuth JWT), as well as a session public key for a local key-pair that is generated and stored locally.
2. The PKP is used to sign a SIWE signature which authorizes the session key-pair going forward.
3. The Lit SDK will use the session key to sign future requests. So instead of signing the session key-pair with a wallet, you can sign it using the PKP by communicating with the Lit nodes and presenting proof that you are authorized.

## Authentication Helpers

Inside of your Lit Actions, there is an object called `Lit.Auth` that will be pre-populated with the resolved Auth Methods, and a few other items. For example, if you pass a Google Oauth Token, then the Lit Nodes will resolve the Oauth Token into a user ID and application ID and those will be available to you in `Lit.Auth`. `Lit.Auth` has the following members:

- actionIpfsIds: An array of IPFS IDs that are being called by this Lit Action. This will typically only have a single item, but if you call multiple Lit Actions from inside your Lit Action, they will all be included here. For example, if you have two Lit Actions, A, and B, and A calls B, then the first item in the array will be A and the last item will be B. Therefore, the last item in the array is always the IPFS ID of the Lit Action that is currently running.
- authSigAddress: A verified wallet address, if one was passed in. This is the address that was used to sign the AuthSig.
- authMethodContexts: An array of auth method contexts. Each entry will contain the following items: `userId`, `appId`, and `authMethodType`. A list of AuthMethodTypes can be found [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPPermissions.sol#L25)

Important to note on Authentication Helpers: authorization is not included. This means that a user can present a Google oAuth JWT as an auth method to be resolved and validated by your Lit Action. The Action will then stick the result inside the Lit.Auth object. In this case, the result would be the users verified google account info like their user id, email address, and more.
