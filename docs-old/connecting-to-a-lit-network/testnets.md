import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testnets

Test networks are designed for early-stage application development. Storing assets with real world value on these networks is **highly discouraged** and minted PKPs may be deleted. All test networks may be deprecated in the future.

Here is an overview of the Lit testnets:

| Name       | Lit Blockchain                                                   | Description                                                                                                                                                                         | Minimum Lit SDK Version | Lit SDK Network Identifier | Requires Payment |
|------------|------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------------------|------------------|
| Datil-test | [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone) | Centralized testnet designed for pre-production development. No persistency guarantees. Payment is enforced.                                                                        | `^6.2.2`                | `datil-test`               | ✅                |
| Datil-dev  | [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone) | Centralized testnet designed for early-stage development. Keys are not persistent and will be deleted. This network does not enforce payment and can be used for free, for testing. | `^6.2.2`                | `datil-dev`                | ❌                |
| Cayenne    | [Chronicle](./lit-blockchains/chronicle)                         | Centralized testnet designed for early-stage development. Keys are not persistent and will be deleted. This network does not enforce payment and can be used for free, for testing. | `^4.0.0`                | `cayenne`                  | ❌                |
| Manzano    | [Chronicle](./lit-blockchains/chronicle)                         | Decentralized test network. No persistency guarantees. Mirrors Habanero code and configuration. Payment is enforced.                                                                | `^4.0.0`                | `manzano`                  | ✅                |

## Datil-test

The Lit network, Datil-test, utilizes the Lit blockchain: Chronicle Yellowstone. It's a centralized testnet designed for pre-production development, and is superseding the Manzano testnet. Like Manzano, usage of the network **does** require payment using [Capacity Credits](../sdk/capacity-credits).

If you are currently on one of the Lit networks that utilize the Chronicle blockchain (i.e. Cayenne, Manzano, and/or Habanero), please refer to [this guide](./migrating-to-datil) to learn how to migrate to Chronicle Yellowstone.

The minimum version of the Lit SDK that supports `datil-test` is `6.2.2`, and the latest SDK version will be installed from NPM by default:

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

There were no breaking changes to the API for `v6` of the Lit SDK, so the code you were using for Habanero should work without issue on Datil-test. If you do run into issues after migrating to Datil-test, please reach out to us on our [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.

To connect to Datil-test, please follow the [Connecting to a Lit Network](./connecting) guide using `datil-test` for the `litNetwork` property when instantiating an instance of the `LitNodeClient`.

## Datil-dev

The Lit network, Datil-dev, utilizes the Lit blockchain: Chronicle Yellowstone. It's a centralized testnet designed for early-stage development, and is superseding the Cayenne testnet. Like Cayenne, usage of the network does **not** require payment using [Capacity Credits](../sdk/capacity-credits).

If you are currently on one of the Lit networks that utilize the Chronicle blockchain (i.e. Cayenne, Manzano, and/or Habanero), please refer to [this guide](./migrating-to-datil) to learn how to migrate to Chronicle Yellowstone.

The minimum version of the Lit SDK that supports `datil-dev` is `6.2.2`, and a latest SDK version will be installed from NPM by default:

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

There were no breaking changes to the API for `v6` of the Lit SDK, so the code you were using for Cayenne should work without issue on Datil-dev. If you do run into issues after migrating to Datil-dev, please reach out to us on our [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.

To connect to Datil-dev, please follow the [Connecting to a Lit Network](./connecting) guide using `datil-dev` for the `litNetwork` property when instantiating an instance of the `LitNodeClient`.
