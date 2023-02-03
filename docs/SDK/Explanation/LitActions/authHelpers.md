---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authentication Helpers

When you call a Lit Action, you may pass Auth Methods that should be resolved. These could be things like a WebAuthn signature, or an oauth token from a service like Discord or Google. You can see an example of this here: https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/authContext.js#L32

## What is authentication?
An authentication method refers to the specific credential (i.e a wallet address, Google oAuth, or Discord account) that is programmatically tied to the PKP and used to control the underlying key-pair. Only the auth method associated with a particular PKP has the ability to combine the underlying shares. You can read more about how authentication works with PKPs on our [blog](https://spark.litprotocol.com/how-authentication-works-with-pkps/).

## How does authentication differ from authorization?

Authorization refers to an [auth signature](/SDK/Explanation/WalletSigs/authSig), which is **always required** to communicate with the Lit nodes and make a request to the network. It doesn't matter if you are decrypting a piece of data or calling a Lit Action, an auth sig will always be required.


## How to use
Inside of your Lit Actions, there is an object called `Lit.Auth` that will be pre-populated with the resolved Auth Methods, and a few other items. For example, if you pass a Google Oauth Token, then the Lit Nodes will resolve the Oauth Token into a user ID and application ID and those will be available to you in `Lit.Auth`. `Lit.Auth` has the following members:

- actionIpfsIds: An array of IPFS IDs that are being called by this Lit Action. This will typically only have a single item, but if you call multiple Lit Actions from inside your Lit Action, they will all be included here. For example, if you have two Lit Actions, A, and B, and A calls B, then the first item in the array will be A and the last item will be B. Therefore, the last item in the array is always the IPFS ID of the Lit Action that is currently running.
- authSigAddress: A verified wallet address, if one was passed in. This is the address that was used to sign the AuthSig.
- authMethodContexts: An array of auth method contexts. Each entry will contain the following items: `userId`, `appId`, and `authMethodType`. A list of AuthMethodTypes can be found here: https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPPermissions.sol#L25