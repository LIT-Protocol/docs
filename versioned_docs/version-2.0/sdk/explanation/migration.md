---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrating to V2

`lit-js-sdk` is now considered deprecated and will only receive security updates. It is strongly recommended to migrate to the new **Lit JS SDK V2** for continued support and new features.

The **Lit JS SDK V2** has been entirely revamped from the earlier `lit-js-sdk` and completely rewritten in TypeScript. This latest V2 SDK is much more modular and easier to use, and has a noticeably smaller bundle size.

## Installing the V2 SDK

:::note
You should use **at least Node v16.16.0** because of the need for the **webcrypto** library.
:::

Get started with **Lit JS SDK V2** by installing the package best suited for your environment.

Browser & Node environments:

```bash
npm install @lit-protocol/lit-node-client
```

Node environment:

```bash
npm install @lit-protocol/lit-node-client-nodejs
```

If you already have `lit-js-sdk` in your app, all you need to do is remove the old package and then update any import statement to reference the new SDK like so:

```bash
import * as LitJsSdk from '@lit-protocol/lit-node-client';
```

If you are using TypeScript, be sure to install the `@lit-protocol/types` package. Check out the list of available packages [here]([https://github.com/LIT-Protocol/js-sdk/tree/master#packages](https://github.com/LIT-Protocol/js-sdk/tree/master#packages)).

## Notable Changes

**Lit JS SDK V2** includes some breaking changes from the latest version of the old `lit-js-sdk`.

### Updating Imports

Some methods have been moved to separate packages and must be accessed from those packages. Below are lists of methods underneath their respective packages.

 `@lit-protocol/crypto` 

- decryptWithSymmetricKey
- encryptWithSymmetricKey
- importSymmetricKey
- generateSymmetricKey

`@lit-protocol/misc-browser` 

- fileToDataUrl
- injectViewerIFrame
- downloadFile

`@lit-protocol/access-control-conditions`

- hashUnifiedAccessControlConditions

`@lit-protocol/misc` 

- getVarType
- checkType
- convertLitActionsParams
- decimalPlaces

Constants have been moved to `@lit-protocol/constants`, which include:

- LIT_CHAINS
- LIT_SVM_CHAINS
- LIT_COSMOS_CHAINS
- ALL_LIT_CHAINS

The following types are now declared in `@lit-protocol/types`:

- LITChain
- LITEVMChain
- LITSVMChain
- LITCosmosChain
- CallRequest

<br/>

### Changed Methods

**signAndSaveAuthMessage**

<table>
<tr>
<td> Old V1 </td> <td> New V2 </td>
</tr>
<tr>
<td>

```js
import * as LitJsSdk from 'lit-js-sdk';

const authSig = await LitJsSdk.signAndSaveAuthMessage({
  // ...
});
```

</td>
<td>

```js
import { ethConnect } from '@lit-protocol/auth-browser';

const authSig = await ethConnect.signAndSaveAuthMessage({
  // ...
});
```

Note: You can also import `cosmosConnect` and `solConnect` for Cosmos and Solana respectively.

</td>
</tr>
</table>
<br/>

**disconnectWeb3**

<table>
<tr>
<td> Old V1 </td> <td> New V2 </td>
</tr>
<tr>
<td>

```js
import * as LitJsSdk from 'lit-js-sdk';

LitJsSdk.disconnectWeb3();
```

</td>
<td>

```js
import { ethConnect } from '@lit-protocol/auth-browser';

ethConnect.disconnectWeb3();
```

</td>
</tr>
</table>
<br/>


**executeJs**

`authSig` is a required parameter.

**getSignedToken**

This method accepts `iat` and `exp` as optional parameters.

**saveEncryptionKey**

The optional `permanent` parameters are now type `number`.

**saveSigningCondition**

The optional `permanent` parameters are now type `number`.

**signSessionKey**

The parameter `chain` is now `chainId` and type `number`.

<br/>

### Changed Types

**AccessControlCondition** is now either `AccsRegularParams` or `AccsDefaultParams` and referenced in `AccessControlConditions`.

<br/>

**EVMContractCondition** is now `AccsEVMParams` and referenced in `EvmContractConditions`.

<br/>

**SolRpcCondition** is now `AccsSOLV2Params` , which now includes more properties like `pdaKey`, `pdaInterface`, and `pdaParams`. `AccsSOLV2Params` is referenced in `SolRpcConditions`.

<br/>

**CosmosCondition** is now `ConditionItem`.

<br/>

**ResourceId** is now `JsonSigningResourceId`.

<br/>

### Deprecated Methods

These methods are no longer supported:

- signPKPTransaction
- sendPKPTransaction
- findLITs
- sendLIT
- createHtmlLIT
- mintLIT
- unlockLitWithKey
- toggleLock
- encryptWithPubKey
- decryptWithPrivKey
- lookupNameServiceAddress
- metadataForFile
- configure

## Changelog

Changes to the **Lit JS SDK V2** will be tracked in the [changelog](https://github.com/LIT-Protocol/js-sdk/blob/master/CHANGELOG.md).