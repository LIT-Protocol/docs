---
sidebar_position: 2
---

# Examples

## Using oAuth for "Seed-Phraseless" Onboarding

The ability to authenticate a Web3 account through oAuth will revolutionize the way we interact with blockchain applications and services, making it easier than ever for users to access the decentralized Web.

The following [codebase](https://github.com/LIT-Protocol/oauth-pkp-signup-example) walks through an example of using oAuth to generate a Lit-powered MPC wallet, all without a single seed phrase in sight. This flow is supported by the Lit Relay Server, which takes care of the PKP minting request and the linking of the distributed key pair to the Google account, all in a gasless manner for the end user. This relay server is currently set to private by default, but if you would like to use it in your own application, [get in touch](https://airtable.com/shr2NWJbH1Y6Y3kOU).

The complete walkthrough of this example project can be found on our [blog](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/).

## Lit x WalletConnect: Connecting your PKP to the dWeb

Native support for WalletConnect has been added to PKPs. This means that you can easily connect your PKP cloud wallet to any one of the hundreds of decentralized applications that have enabled support for WalletConnect. To connect a PKP to your dApp, all you need to do is:

### Create a Lit PKP Wallet Object

[LitPKP](https://github.com/LIT-Protocol/lit-pkp-sdk/blob/main/lit-pkp.js?ref=spark-by-lit-protocol) is a wrapper of [PKPWallet](https://github.com/LIT-Protocol/pkp-ethers.js/tree/main/packages/wallet?ref=spark-by-lit-protocol), a Wallet class that extends `ether.js Signer` and provides convenient methods to sign transactions and messages using [Lit Actions](/LitActions/intro).

`LitPKP` includes added functionality to handle Ethereum JSON RPC signing requests, which will be used to respond to requests facilitated through WalletConnect.

### Initialize WalletConnect

To initialize a WalletConnect V2 client (NOTE: WalletConnect V1 has been [deprecated](https://docs.walletconnect.com/2.0/advanced/migrating-from-v1.0)), you must first sign up for a project ID through this [link](https://cloud.walletconnect.com/sign-in). This ID is used to link the WalletConnect modal to your specific application.

### Subscribe and Respond to Events

Once the client is initialized, the dApp will request to connect to your PKP. To respond to requests from the dApp, you'll need to subscribe to WalletConnect events. When the subscribed event fires, the connector will respond by invoking the callback function you passed to the event listener. 

We recommend subscribing to at least these three event types:

- `session_request`: when a dApp requests to connect to your PKP
- `call_request`: when a dApp wants your PKP to sign messages or send transactions
- `disconnect`: when a dApp disconnects from your PKP

You can read the full guide and explore additional examples on our [blog](https://spark.litprotocol.com/connecting-lit-pkps-with-dapps/).
