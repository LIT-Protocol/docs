---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

:::note
💡 **Important**

`lit-js-sdk` is now deprecated. If you are using `lit-js-sdk`, you should migrate to the new **Lit JS SDK V2** for continued support and new features. Check out the migration guide [here](../../SDK/Explanation/migration).
:::

## Installing and Importing V2 SDK

<Tabs
defaultValue="browser"
values={[
{label: 'browser', value: 'browser'},
{label: 'script tag with all dependencies included', value: 'script-tag'},
{label: 'server side with nodejs', value: 'server-side'},
]}>
<TabItem value="browser">

Install the `@lit-protocol/lit-node-client` package, which can be used in both browser and Node environments:

```sh
yarn add @lit-protocol/lit-node-client
```

Use the **Lit JS SDK V2**:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client";
```

</TabItem>
	
<TabItem value="script-tag">

```js
<script src="https://cdn.jsdelivr.net/npm/@lit-protocol/lit-node-client-vanilla/lit-node-client.js"></script>
```

If you decide to import the SDK with the script tag, we provide a web-ready package with the dependencies you need. You can use the SDK functions via `LitJsSdk_litNodeClient`, for example `LitJsSdk_litNodeClient.encryptString()`
</TabItem>

<TabItem value="server-side">

Install the `@lit-protocol/lit-node-client-nodejs`, which is for Node environments only:

```sh
yarn add @lit-protocol/lit-node-client-nodejs
```

Use the **Lit JS SDK V2**:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
```

</TabItem>
</Tabs>

:::note
You should use **at least Node v16.16.0** because of the need for the **webcrypto** library.
:::

## Connection to the Lit Network

The SDK requires an active connection to the Lit nodes to perform most functions (notably, a connection to the Lit nodes is not required if you are just verifying a JWT). In web apps, this is typically done on first page load and can be shared between all your pages. In NodeJS apps, this is done when when the server starts.

### SDK installed via yarn or the script tag (browser usage)

<Tabs
defaultValue="yarn"
values={[
{label: 'yarn / NPM', value: 'yarn'},
{label: 'script tag', value: 'script'},
]}>
<TabItem value="yarn">

```js
const client = new LitJsSdk.LitNodeClient();
await client.connect();
window.litNodeClient = client;
```

In the **yarn / NPM** example:

:::note

`client.connect()` will return a promise that resolves when you are connected to the Lit Network. You may also listen for the `lit-ready` event.

In the code examples we make the `litNodeClient` available as a global variable so that it can be used throughout the web app.

:::

</TabItem>
<TabItem value="script">

```js
function litJsSdkLoaded() {
  var litNodeClient = new LitJsSdk_litNodeClient();
  litNodeClient.connect();
  window.litNodeClient = litNodeClient;
}
```

In the **script tag** example:

If you're using the script tag, you can put your own connection code in a `litJsSdkLoaded()` function and call it yourself with `onload=litJsSdkLoaded()`.

</TabItem>
</Tabs>

### SDK installed via yarn / NPM (NodeJS / serverside usage)

In this example, we store the litNodeClient in a global variable `app.locals.litNodeClient` so that it can be used throughout the server. `app.locals` is provided by Express for this purpose. You may have to use what your own server framework provides for this purpose, instead.

```js
app.locals.litNodeClient = new LitJsSdk.LitNodeClient({
  alertWhenUnauthorized: false,
});
await app.locals.litNodeClient.connect();
```

:::note
`client.connect()` will return a promise that resolves when you are connected to the Lit Network.
:::

### SDK installed via yarn / NPM (client side usage)

Within a file (we like to call ours `lit.js`), set up your Lit object.

```js
const client = new LitJsSdk.LitNodeClient()

class Lit {
  private litNodeClient
  async connect() {
    await client.connect()
    this.litNodeClient = client
  }
}
export default new Lit()
```

## Listening for the lit-ready event

To listen for the "lit-ready" event which is fired when the network is fully connected:

```js
document.addEventListener(
  "lit-ready",
  function (e) {
    console.log("LIT network is ready");
    setNetworkLoading(false); // replace this line with your own code that tells your app the network is ready
  },
  false
);
```

## Debug Logging and Lit Node Client configuration

The `LitNodeClient` object has a number of config params you can pass, documented here: https://js-sdk.litprotocol.com/classes/lit_node_client_src.LitNodeClientNodeJs.html#config

For example, to turn off logging, you could set `debug` to `false` like this: `const client = new LitJsSdk.LitNodeClient({debug: false})`
