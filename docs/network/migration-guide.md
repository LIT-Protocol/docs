
# Lit v0 Migration Guide

The launch of Lit v0 introduces the [Habanero Mainnet Beta](../network/networks/mainnet.md) and the [Manzano Testnet](../network/networks/testnet.md). 

The keys created and managed on the Habanero Mainnet Beta are ready to be used for deploying production-level applications and user experiences. This means that sending, receiving, and managing real world assets IS now supported. Any keys that are created on the v0 network are persistent, will not be deleted, and will eventually be migrated to the v1 network when it is released later this year.

If you are currently in early-stage research and development, you should be using the Manzano Testnet. Sending, receiving, and managing real world assets on Manzano is NOT recommended. 

In order to deploy to Habanero or Manzano, you’ll first need to make sure you're using the v3 SDK. If you haven’t yet upgraded to v3, you can do so following these [upgrade instructions](../migration/overview.md). Once you've upgraded, the next step will be to connect to the appropriate network branch in your SDK config, either [Habanero](../network/networks/mainnet.md) or [Manzano](../network/networks/testnet.md).

Once your application is using v3, you can follow the following migration guide to learn how to perform re-encryption (if you're using [access control](../sdk/access-control/intro.md)) or re-mint PKPs (if you're building with [user wallets](../sdk/wallets/intro.md)) on Habanero. 

## Migrating From Jalapeno

Jalapeno only supports encryption / decryption use cases, so this guide will only focus on that use case. The migration path for Jalapeno involves performing re-encryption.

You can learn more about re-encryption at the end of this guide.

If you’re migrating from Jalapeno to Habanero, it’s important to remember that they have different, incompatible Lit JS SDK versions.  Jalapeno only works with version 2.x.x and Habanero only works with 3.x.x. You will therefore need to decrypt with the v2 sdk and then re-encrypt with the v3 sdk. 

## Migrating From Cayenne

### For encryption / decryption use cases

Cayenne and Habanero have different root keys, so you’ll need to re-encrypt your user’s content in order to migrate to Habanero

You can learn more about re-encryption at the end of this guide.

You can use the same v3 SDK for both Cayenne and Habanero, but note that you will need 2 instances of the SDK, one connected to each network.  

### For PKP Signing / Lit Actions use cases

Since Habanero has new root keys, you will need to re-mint any PKPs on Habanero.  To do this, you can loop over all your old users and simply mint a new PKP on Habanero with the exact same auth methods.  At this point, your users could use both the old network PKP and the new network PKP with the same auth methods.  

However, the ETH address of each PKP will be different. Your users may have things tied to the old PKP ETH address, like assets stored there, or AA wallets that see that PKP as authorized signer. So the next step is to migrate these items.  

In the case of assets, like ETH or Tokens or NFTs, you must have the user send these to their new PKP wallet address. Once they have sent their assets, the migration is complete.

In the case of AA wallets, you would change the authorized signer from the old PKP wallet address to the new PKP wallet address. Once you’ve done this, the migration is complete.

We have an example script here that will perform the re-minting for you: https://github.com/LIT-Protocol/PKP-Migrate

## Performing re-encryption

Re-encryption is simply, decrypting the content, then encrypting it again.  In the case of a migration from an old Lit Network to Habanero, you would connect to the old network, decrypt the user’s data, and then connect to Habanero and encrypt it again.

Since in many cases, only the end user themselves can actually decrypt the content, you may adopt a system where you migrate each user when they use the system. You may start sending traffic from new users that *don’t* have any existing content to Habanero, immediately.  You may want to track which network each user is using in your user DB, and then upon login, look this up to decide which network to talk to.

You may follow the docs on [encryption](../sdk/access-control/encryption.md) to learn how to decrypt and re-encrypt your data. 

## Installing and Initializing the Lit SDK

To connect to the Habanero network, you'll need to import the Lit SDK using the following command:

<Tabs
defaultValue="general"
values={[
{label: 'general', value: 'general'},
{label: 'server side with nodejs', value: 'server-side'},
]}>
<TabItem value="general">

Install the `@lit-protocol/lit-node-client` package, which can be used in both browser and Node environments:

```sh
yarn add @lit-protocol/lit-node-client
```

Use the **Lit JS SDK V3**:

:::note
Both the Habanero and Manzano networks can be accessed using the '@beta' tag below. You'll need to specify the network you want to connect to ('habanero' or 'manzano') when initializing your node client config.
:::

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client@beta";
```

</TabItem>

<TabItem value="server-side">

Install the `@lit-protocol/lit-node-client-nodejs`, which is for Node environments only:

```sh
yarn add @lit-protocol/lit-node-client-nodejs
```

Use the **Lit JS SDK V3**:

:::note
Both the Habanero and Manzano networks can be accessed using the '@beta' tag below. You'll need to specify the network you want to connect to ('habanero' or 'manzano') when initializing your node client config.
:::

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs@beta";
```

</TabItem>
</Tabs>

:::note
You should use **at least Node v16.16.0** because of the need for the **webcrypto** library.
:::

## Connection to the Lit Network

The SDK requires an active connection to the Lit nodes to perform most functions (notably, a connection to the Lit nodes is not required if you are just verifying a JWT).

In web apps, this is typically done on first page load and can be shared between all your pages. In NodeJS apps, this is done when when the server starts.

Calling `connect()` on the `litNodeClient`` returns a promise that resolves when you are connected to the Lit network.

### SDK installed via NodeJS / serverside usage

In this example stub, the litNodeClient is stored in a global variable `app.locals.litNodeClient` so that it can be used throughout the server. `app.locals` is provided by [Express](https://expressjs.com/) for this purpose. You may have to use what your own server framework provides for this purpose, instead.

> Keep in mind that in the server-side implementation, the client class is named `LitNodeClientNodeJs`.

`client.connect()` returns a promise that resolves when you are connected to the Lit network.

```js
app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: "habanero",
  checkNodeAttestation: true 
});
await app.locals.litNodeClient.connect();
```

### SDK installed for client side usage

Within a file (in the Lit example repos it will likely be called `lit.js`), set up your Lit object.

`client.connect()` will return a promise that resolves when you are connected to the Lit Network.

```js
const client = new LitJsSdk.LitNodeClient({
  litNetwork: 'habanero',
  checkNodeAttestation: true 
});

await client.connect();
```

Read more about using the Lit SDK, testing, and error handling [here](../sdk/tests.md).
