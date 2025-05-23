# Connecting to a Lit Network

After installing the Lit SDK, you can connect an instance of [LitNodeClient](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClient.html) to a Lit network. This is done by setting the `litNetwork` property when instantiating an instance of `LitNodeClient`:

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";

const litNodeClient = new LitNodeClient({
    // Change this to the Lit SDK Network Identifier you want to connect to
    litNetwork: LIT_NETWORK.DatilDev,
});
await litNodeClient.connect();
```

## Available Lit Networks

:::warning
With the release of [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone) and the Datil networks, the [Chronicle](./lit-blockchains/chronicle) based Lit networks: `habanero`, `manzano`, and `cayenne` have been deprecated.

If you are currently using these networks, please review the [Migrating to Datil](./migrating-to-datil) guide to migrate your application and Lit assets to a Datil network.
:::

### Mainnets

| Name       | Lit SDK Network Identifier | Doc Page Link                | Network is Live           |
|------------|----------------------------|------------------------------|---------------------------|
| Datil | `datil`               | [Link](./mainnets#datil)| ✅                        |
| Habanero   | `habanero`                 | n/a                          | ⚠️ Deprecated |

### Testnets

| Name       | Lit SDK Network Identifier | Doc Page Link                 | Network is Live           |
|------------|----------------------------|-------------------------------|---------------------------|
| Datil-test | `datil-test`               | [Link](./testnets#datil-test) | ✅                        |
| Datil-dev  | `datil-dev`                | [Link](./testnets#datil-dev)  | ✅                        |
| Manzano    | `manzano`                  | n/a                           | ⚠️ Deprecated |
| Cayenne    | `cayenne`                  | n/a                           | ⚠️ Deprecated |
