---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

## Installing and Importing

<Tabs
defaultValue="browser"
values={[
{label: 'browser', value: 'browser'},
{label: 'script tag with all dependencies included', value: 'script-tag'},
{label: 'server side with nodejs', value: 'server-side'},
]}>
<TabItem value="browser">
Install the SDK:

```sh
yarn add @lit-protocol/sdk-browser
```

Use the SDK:

```js
import LitJsSdk from "@lit-protocol/sdk-browser";
```

</TabItem>
	
<TabItem value="script-tag">

```js
<script
  onload="LitJsSdk.litJsSdkLoadedInALIT()"
  src="https://jscdn.litgateway.com/index.web.js"
></script>
```

If you decide to import the SDK with the script tag, we provide a web-ready package with all dependencies included at build/index.web.js.
You can use all the SDK functions via LitJsSdk, for example `LitJsSdk.encryptString()`
</TabItem>
<TabItem value="server-side">

Install the SDK:

```sh
yarn add @lit-protocol/sdk-nodejs
```

Use the SDK:

```js
import LitJsSdk from "@lit-protocol/sdk-nodejs";
```

:::note

You should use at least Node v16 because of the need for the webcrypto library.  
You can use Node v14 (and possibly lower) if you import a global webcrypto polyfill like @peculiar/webcrypto and define the global `crypto` object in your code.

:::

</TabItem>
</Tabs>

<!-- ### For React

First, add `lit-js-sdk` to your react app

```js
yarn add lit-js-sdk
```

If you are using `create-react-app ≥ 5` you may be see this error:

```js
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
```

This is because NodeJS polyfills are no longer included in the node modules.

You will need to install this NPM package to rewrite your app

```js
yarn add react-app-rewired --dev
```

and the following for polyfills:

```js
yarn add --dev react-app-rewired process crypto-browserify stream-browserify stream-http buffer path-browserify
```

Then, in the root of your project, create `config-overrides.js` with the following content:

```js
const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "path": require.resolve("path-browserify")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    return config;
}
```

Finally, you will need to change your `react-scripts` to `react-app-rewired` in your `package.json`

```js
"scripts": {
	"start": "react-app-rewired start",
	"build": "react-app-rewired build",
	"test": "react-app-rewired test",
	"eject": "react-app-rewired eject"
},
```

The missing modules are now included, your app should be working with `import LitJsSdk from 'lit-js-sdk';` -->

## Connection to the Lit Network

The SDK requires an active connection to the LIT nodes to perform most functions (notably, a connection to the LIT nodes is not required if you are just verifying a JWT). In web apps, this is typically done on first page load and can be shared between all your pages. In NodeJS apps, this is done when when the server starts.

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

In the code examples we make the litNodeClient available as a global variable so that it can be used throughout the web app.

:::

</TabItem>
<TabItem value="script">

```js
function litJsSdkLoaded() {
  var litNodeClient = new LitJsSdk.LitNodeClient();
  litNodeClient.connect();
  window.litNodeClient = litNodeClient;
}
```

In the **script tag** example:

If you're using the script tag with `onload='LitJsSdk.litJsSdkLoadedInALIT()'` then the SDK will connect to the Lit Network and put a connected LitNodeClient into `window.litNodeClient` for you. Alternatively, you can put your own connection code in the `litJsSdkLoaded()` function and call it yourself with `onload=litJsSdkLoaded()`.

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

The LitNodeClient object has a number of config params you can pass, documented here: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#litnodeclient

For example, to turn off logging in the JS SDK, you could set debug to false like this: `const client = new LitJsSdk.LitNodeClient({debug: false})`
