import FeedbackComponent from "@site/src/pages/feedback.md";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
# Testnets

Test networks are designed for early-stage application development. Storing assets with real-world value on these networks is **highly discouraged**, and minted PKPs (Programmable Key Pairs) may be deleted.

:::warning

All test networks may be **deprecated** in the future.

Use one of the [mainnets](./mainnets) for longer term persistence, and for handling assets with real-world value.

:::

## Overview of Lit Testnets

| Name       | Lit Blockchain                                                      | Description                                                                                                                                                                   | Minimum Lit SDK Version | Lit SDK Network Identifier | Requires Payment |
|------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------------------|------------------|
| Datil-test | [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone.md) | Centralized testnet designed for pre-production development. No persistency guarantees. Payment is enforced.                                                                  | `6.x.x`                | `datil-test`               | ✅                |
| Datil-dev  | [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone.md) | Centralized testnet designed for early-stage development. Keys are not persistent and may be deleted. This network does not enforce payment and can be used for free testing. | `6.x.x`                | `datil-dev`                | ❌                |

:::info

If you are coming from version `5` of the Lit SDK, there are no breaking changes to the API in version `6`. Therefore, code written for Habanero should work seamlessly on Datil. If you encounter any issues after migrating to Datil, please reach out to us on [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.

:::

## The Datil-test Network

The Lit network **Datil-test** utilizes the Lit blockchain: **Chronicle Yellowstone**. It's a centralized testnet designed for pre-production development and supersedes the Manzano testnet. Like Manzano, usage of the network **requires** [payment for usage of the network](../../../paying-for-lit/overview.md).

If your application is currently deployed on Lit networks: Cayenne, Manzano, and/or Habanero, please refer to [this migration guide](./migrating-to-datil) to learn how to migrate to the new Datil networks.

### Lit SDK Version Compatibility

The minimum version of the Lit SDK that supports `datil-test` is the latest `6.x.x` release. You can install the latest SDK version from NPM, which includes this support by default:

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

### Connecting to Datil-test

To connect to Datil-test, please follow the [Connecting to a Lit Network](../../../../build/getting-started/connecting-to-lit) guide, using `datil-test` as the `litNetwork` property when instantiating an instance of the `LitNodeClient`:

```ts
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNetwork } from "@lit-protocol/constants";

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilTest,
});
await litNodeClient.connect();
```

## Datil-dev Network

The Lit network **Datil-dev** utilizes the Lit blockchain called **Chronicle Yellowstone**. It's a centralized testnet designed for early-stage development and supersedes the Cayenne testnet. Unlike Datil-test, usage of the network does **not** require payment for usage of the network.

If your application is currently deployed on Lit networks: Cayenne, Manzano, and/or Habanero, please refer to [this migration guide](./migrating-to-datil) to learn how to migrate to the new Datil networks.

### Lit SDK Version Compatibility

The minimum version of the Lit SDK that supports `datil-dev` is the latest `6.x.x` release. You can install the latest SDK version from NPM:

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

### Connecting to Datil-dev

To connect to Datil-dev, please follow the [Connecting to a Lit Network](../../../../build/getting-started/connecting-to-lit) guide, using `datil-dev` as the `litNetwork` property when instantiating an instance of the `LitNodeClient`:

```ts
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNetwork } from "@lit-protocol/constants";

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilDev,
});
await litNodeClient.connect();
```

<FeedbackComponent/>
