import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Alchemy Account Kit

Learn how Lit [Programmable Key Pairs](../../sdk/wallets/intro.md) can be a signer for Alchemy's Account Kit!


---

## Objectives
At completion of this reading you should be able to:

- Describe use cases for Account Kit.
- Understand how to set Lit as a signer to an Account Kit.

---

## What is Account Kit?
[Alchemy's Account Kit](https://www.alchemy.com/account-kit) is a complete toolkit to embed smart accounts in your app with social login, gas abstraction, batch transactions, and more.

Powered by account abstraction (ERC-4337), Account Kit provides all the tools you need to onboard users with zero friction:

-**aa-sdk**: a flexible library to integrate, deploy, and use smart accounts
-**Light Account**: a gas-optimized ERC-4337 smart contract account
-**Signers**: integrations with your favorite social login and passkey providers
-**Gas Manager APIs**: a programmable API to sponsor gas fees in your app‍
-**Bundler APIs**: the most reliable Bundler to submit UserOps onchain at scale

With Account Kit, you can create a smart account for every user. Smart accounts are smart contract wallets that leverage account abstraction to radically simplify every step of the onboarding experience. Now, a new user can:

- Create a smart account directly in an Account Kit powered app without third-party - downloads
- Sign up with an email, social login, passkey, or self-custodial wallet
- Submit transactions without needing ETH in their account for gas
- Submit transactions in the background without leaving your app


## Guide

Combining Lit [PKP wallet](https://www.npmjs.com/package/@lit-protocol/pkp-ethers) with Account Kit allows you to use your Programmable Key Pairs (PKPs) as a smart account for your users.

### Pre-requisites
- Familiarity with JavaScript and TypeScript.
- Understand the basics of account abstraction.


### 1. Setup

Install the pkp ethers package:

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```js
npm i @lit-protocol/pkp-ethers@cayenne
```

</TabItem>

<TabItem value="sms">

```js
yarn add @lit-protocol/pkp-ethers@cayenne
```

</TabItem>

</Tabs>

Install the `LitNodeClient` package`:

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```js
npm i @lit-protocol/lit-node-client@cayenne
```

</TabItem>

<TabItem value="sms">

```js
yarn add @lit-protocol/lit-node-client@cayenne
```

</TabItem>

</Tabs>

### 2. Get A Programmable Key Pair (PKP)

Get some LIT Testnt tokens from Lit's [Chronicle network](../../network/rollup.mdx). 

Then mint a PKP through the [PKP explorer](https://explorer.litprotocol.com/mint-pkp).

For other ways to obtain a PKP, [read more within the Lit docs](../../sdk/wallets/intro.md). 

### 3. Create a SmartAccountSigner

Next, setup the `LitNodeClient` and `PKPEthersWallet` to create a `SmartAccountSigner`:

```js
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { AuthCallbackParams } from "@lit-protocol/types";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";

const API_KEY = "<YOUR ALCHEMY API KEY>";
const POLYGON_MUMBAI_RPC_URL = `${polygonMumbai.rpcUrls.alchemy.http[0]}/${API_KEY}`;
const PKP_PUBLIC_KEY = "<YOUR PKP PUBLIC KEY>";

const litNodeClient = new LitNodeClient({
  litNetwork: "cayenne",
  debug: false,
});
await litNodeClient.connect();

const resourceAbilities = [
  {
    resource: new LitActionResource("*"),
    ability: LitAbility.PKPSigning,
  },
];

/**
 * For provisioning keys and setting up authentication methods see documentation below
 * https://developer.litprotocol.com/v2/pkp/minting
 */
const authNeededCallback = async (params: AuthCallbackParams) => {
  const response = await litNodeClient.signSessionKey({
    sessionKey: params.sessionKeyPair,
    statement: params.statement,
    authMethods: [],
    pkpPublicKey: PKP_PUBLIC_KEY,
    expiration: params.expiration,
    resources: params.resources,
    chainId: 1,
  });
  return response.authSig;
};

const sessionSigs = await litNodeClient
  .getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    resourceAbilityRequests: resourceAbilities,
    authNeededCallback,
  })
  .catch((err) => {
    console.log("error while attempting to access session signatures: ", err);
    throw err;
  });

const pkpWallet = new PKPEthersWallet({
  pkpPubKey: PKP_PUBLIC_KEY,
  rpc: POLYGON_MUMBAI_RPC_URL,
  controllerSessionSigs: sessionSigs,
});

// a smart account signer you can use as an owner on ISmartContractAccount
export const litSigner: SmartAccountSigner = new WalletClientSigner(
  createWalletClient({ transport: custom(pkpWallet.rpcProvider) }), // JsonRpcProvider instance,
  "lit" // signerType
);
```

### 4. Use SmartAccountSigner with LightAccount
We can link the `SmartAccountSigner` to a `LightSmartContractAccount` from `aa-accounts`:


`example.ts`

```js
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LightSmartContractAccount } from "@alchemy/aa-accounts";
import { litSigner } from "./lit";

const chain = sepolia;
const provider = new AlchemyProvider({
  apiKey: "ALCHEMY_API_KEY",
  chain,
  entryPointAddress: "0x...",
}).connect(
  (rpcClient) =>
    new LightSmartContractAccount({
      entryPointAddress: "0x...",
      chain: rpcClient.chain,
      owner: litSigner,
      factoryAddress: "0x...",
      rpcClient,
    })
);
```

`lit.ts`
```js
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { AuthCallbackParams } from "@lit-protocol/types";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";

const API_KEY = "<YOUR API KEY>";
const POLYGON_MUMBAI_RPC_URL = `${polygonMumbai.rpcUrls.alchemy.http[0]}/${API_KEY}`;
const PKP_PUBLIC_KEY = "<YOUR PKP PUBLIC KEY>";

const litNodeClient = new LitNodeClient({
  litNetwork: "cayenne",
  debug: false,
});
await litNodeClient.connect();

const resourceAbilities = [
  {
    resource: new LitActionResource("*"),
    ability: LitAbility.PKPSigning,
  },
];

/**
 * For provisioning keys and setting up authentication methods see documentation below
 * https://developer.litprotocol.com/v2/pkp/minting
 */
const authNeededCallback = async (params: AuthCallbackParams) => {
  const response = await litNodeClient.signSessionKey({
    sessionKey: params.sessionKeyPair,
    statement: params.statement,
    authMethods: [],
    pkpPublicKey: PKP_PUBLIC_KEY,
    expiration: params.expiration,
    resources: params.resources,
    chainId: 1,
  });
  return response.authSig;
};

const sessionSigs = await litNodeClient
  .getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    resourceAbilityRequests: resourceAbilities,
    authNeededCallback,
  })
  .catch((err) => {
    console.log("error while attempting to access session signatures: ", err);
    throw err;
  });

const pkpWallet = new PKPEthersWallet({
  pkpPubKey: PKP_PUBLIC_KEY,
  rpc: POLYGON_MUMBAI_RPC_URL,
  controllerSessionSigs: sessionSigs,
});

// a smart account signer you can use as an owner on ISmartContractAccount
export const litSigner: SmartAccountSigner = new WalletClientSigner(
  createWalletClient({ transport: custom(pkpWallet.rpcProvider) }), // JsonRpcProvider instance,
  "lit" // signerType
);
```

## Next Steps

Continue learning about [Lit's severless signing](../../sdk/serverless-signing/conditional-signing.md) capabilities. 

Explore [Account Kit](https://accountkit.alchemy.com/).
