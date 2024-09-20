import FeedbackComponent from "@site/src/pages/feedback.md";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Mainnets

Lit mainnets are designed for late-stage development and production deployment. If you are storing assets with real world value, it should be done on the mainnets and not the testnets.

While mainnets may be deprecated in the future, assets will be transferable to new networks.


## Overview of Lit Mainnets

| Name  | Lit Blockchain                                                   | Description                                                                                                                                 | Minimum Lit SDK Version | Lit SDK Network Identifier | Requires Payment |
|-------|------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------------------|------------------|
| Datil | [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone) | Decentralized mainnet designed for production deployment. Guaranteed real world asset transferability to new mainnets. Payment is enforced. | `6.x.x`                | `datil`                    | ✅                |

## The Datil Network

The Lit network, **Datil**, utilizes the Lit blockchain: **Chronicle Yellowstone**. It's a decentralized mainnet designed for production deployment, and is superseding the Habanero mainnet. Like Habanero, usage of the network **requires** [payment for usage of the network](../../../paying-for-lit/overview.md).

If your application is currently deployed on Lit networks: Cayenne, Manzano, and/or Habanero, please refer to [this migration guide](./migrating-to-datil) to learn how to migrate to the new Datil networks.

### Lit SDK Version Compatibility

The minimum version of the Lit SDK that supports `datil` is the latest `6.x.x` release. You can install the latest SDK version from NPM, which includes this support by default:

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

:::info

If you are coming from version `5` of the Lit SDK, there are no breaking changes to the API in version `6`. Therefore, code written for Habanero should work seamlessly on Datil. If you encounter any issues after migrating to Datil, please reach out to us on [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.

:::

### Connecting to Datil

To connect to Datil, please follow the [Connecting to a Lit Network](../../../../build/getting-started/connecting-to-lit) guide, using `datil` as the `litNetwork` property when instantiating an instance of the `LitNodeClient`:

```ts
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNetwork } from "@lit-protocol/constants";

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.Datil,
});
await litNodeClient.connect();
```

<FeedbackComponent/>
