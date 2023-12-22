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

[Lit Protocol's AA signer](https://accountkit.alchemy.com/smart-accounts/signers/guides/lit.html) is a complete solution for powering AA with a Lit signer.

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

<TabItem value="yarn">

```js
yarn add @lit-protocol/pkp-ethers@cayenne
```

</TabItem>

</Tabs>

Install the `LitNodeClient` package:

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```js
npm i @lit-protocol/lit-node-client@cayenne
npm i @lit-protocol/crypto@cayenne
npm i @lit-protocol/auth-helpers@cayenne
```

</TabItem>

<TabItem value="yarn">

```js
yarn add @lit-protocol/lit-node-client@cayenne
yarn add @lit-protocol/crypto@cayenne
yarn add @lit-protocol/auth-helpers@cayenne
```
</TabItem>
</Tabs>


Install the `Alchemy AA signer` package:

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```js
npm i @alchemy/aa-signers
```

</TabItem>

<TabItem value="yarn">

```js
yarn add @alchemy/aa-signers
```
</TabItem>
</Tabs>

### 2. Get A Programmable Key Pair (PKP)

Get some testLIT test tokens from Lit's [Chronicle network](../../network/rollup.mdx).

To obtain a PKP, [read more within the Lit docs](../../sdk/wallets/intro.md). 

To obtain an Auth Method [read about our authentication methods](../../sdk/authentication/session-sigs/auth-methods/).

For Authentication

### 3. Create a SmartAccountAuthenticator

Next, setup the `LitSigner`

```js
import { LitSigner } from "@alchemy/aa-signers";
import { LitAuthMethod } from "@alchemy/aa-signers/lit-protocol";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";

const API_KEY = "<YOUR ALCHEMY API KEY>";
const POLYGON_MUMBAI_RPC_URL = `${polygonMumbai.rpcUrls.alchemy.http[0]}/${API_KEY}`;
const PKP_PUBLIC_KEY = "<YOUR PKP PUBLIC KEY>";

const litSigner = new LitSigner<LitAuthMethod>({
  pkpPublicKey: PKP_PUBLIC_KEY,
  rpcUrl: POLYGON_MUMBAI_RPC_URL,
  network: "cayenne"
});
```

:::note

You may pass your own instance of `LitNodeClient` to `LitSigner` as `inner` if not an instance will be created.

:::


### 4. Use SmartAccountSigner with LightAccount
We can link the `SmartAccountSigner` to a `LightSmartContractAccount` from `aa-accounts`:

```js
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { polygonMumbai } from "viem/chains";
import { createLitSigner } from "./lit";
const chain = polygonMumbai;

const provider = new AlchemyProvider({
  apiKey: "ALCHEMY_API_KEY",
  chain,
}).connect(
  (rpcClient) =>
    new LightSmartContractAccount({
      chain,
      owner: litSigner,
      factoryAddress: getDefaultLightAccountFactoryAddress(chain),
      rpcClient,
    })
);
```

### 5. Authenticating with the Lit Signer
Before the `AlchemyProvider` can use the `LitSigner` we must `authenticate`

To provide authentication `context` [read about our authentication methods](../../sdk/authentication/session-sigs/auth-methods/). 

```js
litSigner.authenticate({
  context: "<your auth method or session signatures>"
});
```

## Next Steps

Explore [Lit Alchemy AA signer documentation](https://accountkit.alchemy.com/packages/aa-signers/lit-protocol/introduction.html).
