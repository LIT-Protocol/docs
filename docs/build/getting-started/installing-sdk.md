import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<!-- omit in toc -->
# Installing the SDK

The Lit JavaScript SDK is available as a set of packages that can be installed with either `npm` or `yarn`.

<!-- omit in toc -->
## Table of Contents

- [Prerequisites](#prerequisites)
  - [Node.js](#nodejs)
  - [Browser](#browser)
- [Commonly Used Packages](#commonly-used-packages)
  - [@lit-protocol/lit-node-client](#lit-protocollit-node-client)
  - [@lit-protocol/contracts-sdk](#lit-protocolcontracts-sdk)
  - [@lit-protocol/constants](#lit-protocolconstants)
  - [ethers.js@v5](#ethersjsv5)

## Prerequisites

### Node.js

The minimum required version of Node.js is `v19.9.0` because of the requirement for `crypto` support.

### Browser

Setting up the Lit SDK in a browser environment is very similar to using it in Node.js, but there are a few differences. One key difference is the need for polyfills. These may include the `buffer`, `crypto`, `vm`, and `stream` libraries, but exactly which ones you need depends on the framework you're using.

To resolve these issues, an example of polyfilling for Vite can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/starter-guides/browser/vite.config.ts).

## Commonly Used Packages

Below are the most commonly used Lit SDK packages:


### [@lit-protocol/lit-node-client](https://v6-api-doc-lit-js-sdk.vercel.app/modules/lit_node_client_src.html)

Connects to a Lit Network and provides methods for interacting with the network, such as getting session signatures and performing encryption/decryption.

This package is almost always required for any project using Lit.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install @lit-protocol/lit-node-client
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/lit-node-client
```

</TabItem>
</Tabs>

### [@lit-protocol/contracts-sdk](https://v6-api-doc-lit-js-sdk.vercel.app/modules/contracts_sdk_src.html)

Provides a set of interfaces and helper functions for interacting with the contracts that are deployed on the Lit Chronicle blockchain.

This package is useful for minting Programmable Key Pairs (PKPs), and managing their permitted Authentication Methods.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install @lit-protocol/contracts-sdk
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/contracts-sdk
```

</TabItem>
</Tabs>

### [@lit-protocol/constants](https://v6-api-doc-lit-js-sdk.vercel.app/modules/constants_src.html)

A package containing useful constants for use across the SDK.

Some useful constants include:

- `LitNetwork`: An object containing the correct chain identifier for each available Lit Network.
  - For the purposes of a hackathon, you should be using `LitNetwork.DatilDev`.
- `LIT_RPC`: An object containing the RPC URLs for each available Lit blockchain network.
  - For the purposes of a hackathon, you should be using `LIT_RPC.CHRONICLE_YELLOWSTONE`.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install @lit-protocol/constants
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/constants
```

</TabItem>
</Tabs>

---

### [ethers.js@v5](https://docs.ethers.org/v5/)

A popular library for interacting with Ethereum-based blockchains. Lit uses version `v5` of ethers.js.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install install ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add install ethers@v5
```

</TabItem>
</Tabs>
