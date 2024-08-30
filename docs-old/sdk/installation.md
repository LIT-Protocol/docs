import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

<StateOfTheNetwork/>

Ensure you have the following requirements in place:

1. Operating System: Linux, Mac OS, or Windows.
2. Development Environment: You'll need an Integrated Development Environment (IDE) installed. We recommend Visual Studio Code.
3. Languages: The Lit JS SDK supports JavaScript. Make sure you have the appropriate language environment set up.
4. Internet Connection: A stable internet connection is required for installation, updates, and interacting with the Lit nodes.

## Installing And Importing The SDK

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

Use the **Lit JS SDK**:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client";
```

</TabItem>

<TabItem value="server-side">

Install the `@lit-protocol/lit-node-client-nodejs`, which is for Node environments only:

```sh
yarn add @lit-protocol/lit-node-client-nodejs
```

Use the **Lit JS SDK**:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
```

</TabItem>
</Tabs>

:::note
You should use **at least Node v19.9.0** because of the need for **crypto** support.
:::

## Connection to the Lit Network

The SDK requires an active connection to the Lit nodes to perform most functions (notably, a connection to the Lit nodes is not required if you are just verifying a JWT).

In web apps, this is typically done on first page load and can be shared between all your pages. In NodeJS apps, this is done when when the server starts.

Calling `connect()` on the `litNodeClient` returns a promise that resolves when you are connected to the Lit network.

### SDK installed via NodeJS / serverside usage

In this example stub, the litNodeClient is stored in a global variable `app.locals.litNodeClient` so that it can be used throughout the server. `app.locals` is provided by [Express](https://expressjs.com/) for this purpose. You may have to use what your own server framework provides for this purpose, instead.

> Keep in mind that in the server-side implementation, the client class is named `LitNodeClientNodeJs`.

`app.locals.litNodeClient.connect()` returns a promise that resolves when you are connected to the Lit network.

```js
import { LitNetwork } from "@lit-protocol/constants";

app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: LitNetwork.Datil,
});
await app.locals.litNodeClient.connect();
```

The litNodeClient listens to network state, and those listeners will keep your Node.js process running until you explicitly disconnect from the Lit network.
To stop the litNodeClient listeners and allow node to exit gracefully, call:

```js
await app.locals.litNodeClient.disconnect();
```

### SDK installed for client side usage

Within a file (in the Lit example repos it will likely be called `lit.js`), set up your Lit object.

`client.connect()` will return a promise that resolves when you are connected to the Lit Network.

```js
import { LitNetwork } from "@lit-protocol/constants";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: LitNetwork.Datil,
});

await client.connect();
```

:::note
To avoid errors from Lit nodes due to stale `authSig`, make sure to clear the local storage for `authSig` before reconnecting or restarting the client. One way to do this is to disconnect the client first and then reconnect.
:::

The client listens to network state, and those listeners will keep your client running until you explicitly disconnect from the Lit network. To stop the client listeners and allow the browser to disconnect gracefully, call:

```js
await client.disconnect();
```

## Debug Logging and Lit Node Client configuration

The `LitNodeClient` object has a number of config params you can pass, documented here: [API Docs](https://v6-api-doc-lit-js-sdk.vercel.app/)

For example, to turn off logging, you could set `debug` to `false` like this: `const client = new LitJsSdk.LitNodeClient({debug: false})`

<FeedbackComponent/>
