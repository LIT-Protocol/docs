import FeedbackComponent from "@site/src/pages/feedback.md";

# Connecting PKPs to dApps

Leverage Lit Protocol and WalletConnect V2 to seamlessly connect PKPs to hundreds of dApps. WalletConnect enables secure communication between wallets and dApps through QR code scanning and deep linking. With WalletConnect, PKPs act as MPC wallets, interacting with dApps without ever exposing private keys.

To connect a PKP and a dApp, you will need to:

1. Create a `PKPClient`
2. Initialize `PKPWalletConnect` with the `PKPClient`
3. Subscribe and respond to events

## 1. Create a `PKPClient`

`PKPClient` represents a PKP and initializes signers for use across multiple blockchains (note: EVM-only at the moment).

```js
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import { PKPClient } from "@lit-protocol/pkp-client";

// If you haven't done before, create a LitNodeClient instance
const litNodeClient = new LitNodeClient({
  litNetwork: "datil-dev",
});
await litNodeClient.connect();

// Prepare needed params for authContext
const resourceAbilities = [
  {
    resource: new LitActionResource("*"),
    ability: LitAbility.PKPSigning,
  },
];

const authNeededCallback = async (params: AuthCallbackParams) => {
  const response = await litNodeClient.signSessionKey({
    statement: params.statement,
    authMethods: [authMethod],
    expiration: params.expiration,
    resources: params.resources,
    chainId: 1,
  });
  return response.authSig;
};

const pkpClient = new PKPClient({
  authContext: {
    client: litNodeClient,
    getSessionSigsProps: {
      chain: 'ethereum',
      expiration: new Date(Date.now() + 60_000 * 60).toISOString(),
      resourceAbilityRequests: resourceAbilities,
      authNeededCallback,
    },
  },
  // controllerAuthSig: authSig,
  // controllerSessionSigs: sesionSigs, // (deprecated)
  pkpPubKey: "<Your PKP public key>",
});
await pkpClient.connect();
```

The `getSessionSigsProps`, `controllerAuthSig` or `controllerSessionSigs` (this last one deprecated) are used to authorize requests to the Lit nodes. To learn how to leverage different authentication methods, refer to the [Authentication section](./advanced-topics/auth-methods/overview).

To view more constructor options, refer to the [API docs](https://js-sdk.litprotocol.com/interfaces/types_src.PKPClientProp.html).

## 2. Initialize `PKPWalletConnect` with the `PKPClient`

`PKPWalletConnect` wraps [`@walletconnect/web3wallet`](https://www.npmjs.com/package/@walletconnect/web3wallet) to manage WalletConnect session proposals and requests using the given PKPClient.

```js
import { PKPWalletConnect } from "@lit-protocol/pkp-walletconnect";

const config = {
  projectId: "<Your WalletConnect project ID>",
  metadata: {
    name: "Test Lit Wallet",
    description: "Test Lit Wallet",
    url: "https://litprotocol.com/",
    icons: ["https://litprotocol.com/favicon.png"],
  },
};
const wcClient = new PKPWalletConnect();
await wcClient.initWalletConnect(config);
wcClient.addPKPClient(pkpWallet);
```

## 3. Subscribe and respond to events

### Session Proposal

Once the WalletConnect client is initialized, the PKP is ready to connect to dApps. The dApp will request to connect to your PKP through a session proposal. To respond to session proposals, subscribe to the `session_proposal` event.

```js
pkpWalletConnect.on("session_proposal", async (proposal) => {
  console.log("Received session proposal: ", proposal);

  // Accept session proposal
  await pkpWalletConnect.approveSessionProposal(proposal);

  // Log active sessions
  const sessions = Object.values(pkpWalletConnect.getActiveSessions());
  for (const session of sessions) {
    const { name, url } = session.peer.metadata;
    console.log(`Active Session: ${name} (${url})`);
  }
});
```

To trigger the session proposal, visit any WalletConnect V2 compatible dApp to obtain an URI. For an example, navigate to WalletConnect's [test dApp](https://react-app.walletconnect.com/), choose 'Ethereum' network, and click "Connect". A "Connect wallet" modal should appear with a copy icon located at the top right. Click on the icon to copy the URI.

```js
// Pair using the given URI
await pkpWalletConnect.pair({ uri: uri });
```

### Session Request

Once the session proposal is approved, the dApp can then request your PKP to perform actions, such as signing, via a session request. To acknowledge and respond to these session requests, set up an event listener for the `session_request` event.

```js
pkpWalletConnect.on("session_request", async (requestEvent) => {
  console.log("Received session request: ", requestEvent);

  const { topic, params } = requestEvent;
  const { request } = params;
  const requestSession = signClient.session.get(topic);
  const { name, url } = requestSession.peer.metadata;

  // Accept session request
  console.log(
    `\nApproving ${request.method} request for session ${name} (${url})...\n`
  );
  await pkpWalletConnect.approveSessionRequest(requestEvent);
  console.log(
    `Check the ${name} dapp to confirm whether the request was approved`
  );
});
```

## Using `SignClient`

The `@lit-protocol/pkp-walletconnect` library exposes base functionality needed to pair PKPs to dApps, approve and reject session proposals, and respond to session requests. For extended capabilities, you can retrieve WalletConnect's `SignClient` from the `PKPWalletConnect` instance.

```js
const signClient = pkpWalletConnect.getSignClient();
```

Refer to the [WalletConnect V2 docs](https://docs.walletconnect.com/2.0/) for more information on their protocol and SDKs.

<FeedbackComponent/>
