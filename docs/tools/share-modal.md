---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Share Modal

The Lit Share Modal is a tool for creating access control conditions for securing content with Lit Protocol.

- Secure content based on wallet address, token/NFT holdings, POAP ownership, or DAO membership.
- Create multiple paths for unlocking content by using AND/OR operators.
- Set your most used tokens/NFTs as defaults for quick and easy access.

![Share Modal Image](../../static/img/shareModalCover.png)

For an in-depth explanation of how to use the share modal, please follow the [README.md](https://github.com/LIT-Protocol/lit-share-modal-v3#readme).

## Installation

<Tabs
defaultValue="yarn"
values={[
{label: 'yarn', value: 'yarn'},
{label: 'npm', value: 'npm'},
]}>
<TabItem value="yarn">

```js
yarn add lit-share-modal-v3
```

</TabItem>
<TabItem value="npm">

```js
npm install --save lit-share-modal-v3
```
</TabItem>
</Tabs>

## Usage in React

Use this UI library to allow users to setup custom blockchain based access control. This library can be used in any React app.

https://github.com/LIT-Protocol/lit-share-modal-v3

A playground for experimenting with the modal is available here: https://lit-share-modal-v3-playground.netlify.app/.


## Usage in Vanilla JS (No React)

A version of this library without React will be available soon.

[//]: # (To use this library without React, you can use the following package, which wraps the react library up in vanilla JS.)

[//]: # ()
[//]: # (https://github.com/LIT-Protocol/lit-share-modal-v2-vanilla-js)

## Usage in Next.js

If you are using NextJS, the CSS injection will not work. Set the `injectCSS` prop to false, and import the CSS file directly from `node_modules/lit-share-modal-v3/dist/ShareModal.css` in `_app.tsx` or `_app.jsx`.
More information is available in the docs.  https://github.com/LIT-Protocol/lit-share-modal-v3.

