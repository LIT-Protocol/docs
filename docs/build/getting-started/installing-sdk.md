import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Installing the SDK

The `@lit-protocol/lit-node-client` package forms the core of the Lit SDK, providing essential functionality for both Node.js and browser environments. This page guides you through its installation process.

## Installation with npm or yarn
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

## Node.js
The minimum required version of Node.js is **v19.9.0** because of the requirement for **crypto** support.

## Browser
Setting up the Lit SDK in a browser environment is very similar to using it in Node.js, but there are a few differences. One key difference is the need for polyfills. These may include the `buffer`, `crypto`, `vm`, and `stream` libraries, but exactly which ones you need depends on the framework you're using. To resolve these issues, an example of polyfilling for Vite can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/starter-guides/browser/vite.config.ts).
