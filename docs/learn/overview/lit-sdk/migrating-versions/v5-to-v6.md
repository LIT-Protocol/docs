---
sidebar_position: 3
---

import FeedbackComponent from "@site/src/pages/feedback.md";

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrating from Lit JS SDK Version v5 to v6

## Breaking Changes and Important Updates

The most significant change in version 6 is the consolidation of `authSig` and `sessionSigs`. In most functions, the client-side generated `authSig` is no longer accepted as an argument, as seen in commonly used functions like `executeJs` and `pkpSign`. Instead, `authSig` is used to generate `sessionSigs` to authenticate with the Lit nodes.

:::note

The migration from `authSig` to `sessionSigs` **does not affect** `encryption`/`decryption` features within [Access Control Conditions](../access-control/intro.md). Only features related to [PKPs (Programmable Key Pairs)](../../user-wallets/pkps/overview.md) will require session authentication.

:::

## Per-Package Changes

### @lit-protocol/lit-node-client

#### executeJs

- **v5**: Optional use of `authSig` or `sessionSigs`, but one must be provided.
- **v6**: `sessionSigs` is **strictly required**.

```ts
// v5
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const res = await litNodeClient.executeJs({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import { SessionSigsMap } from '@lit-protocol/types';

const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const res = await litNodeClient.executeJs({
  sessionSigs,
  // Other parameters...
});
```

#### pkpSign

- **v5**: Optional `authSig` or `sessionSigs`, but one must be provided.
- **v6**: `sessionSigs` is **strictly required**.

```ts
// v5
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const res = await litNodeClient.pkpSign({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import { SessionSigsMap } from '@lit-protocol/types';

const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const res = await litNodeClient.pkpSign({
  sessionSigs,
  // Other parameters...
});
```

#### decryptToString

- **v5**: Optional `authSig` or `sessionSigs`, but one must be provided.
- **v6**: `sessionSigs` is **strictly required**.

```ts
// v5
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const decryptedString = await LitJsSdk.decryptToString({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { SessionSigsMap } from '@lit-protocol/types';

const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const decryptedString = await LitJsSdk.decryptToString({
  sessionSigs,
  // Other parameters...
});
```

#### encryptToJson

- **v5**: Optional `authSig` or `sessionSigs`, but one must be provided.
- **v6**: **No authentication material needed**.

```ts
// v5
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const encryptedJsonStr = await LitJsSdk.encryptToJson({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import * as LitJsSdk from '@lit-protocol/lit-node-client';

const encryptedJsonStr = await LitJsSdk.encryptToJson({
  // Other parameters...
});
```

#### decryptFromJson

- **v5**: Optional `authSig` or `sessionSigs`, but one must be provided.
- **v6**: `sessionSigs` is **strictly required**.

```ts
// v5
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const decryptedFile = await LitJsSdk.decryptFromJson({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { SessionSigsMap } from '@lit-protocol/types';

const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const decryptedFile = await LitJsSdk.decryptFromJson({
  sessionSigs,
  // Other parameters...
});
```

#### encryptFileAndZipWithMetadata

- **v5**: Optional `authSig` or `sessionSigs`, but one must be provided.
- **v6**: **No authentication material needed**.

```ts
// v5
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const encryptedData = await LitJsSdk.encryptFileAndZipWithMetadata({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import * as LitJsSdk from '@lit-protocol/lit-node-client';

const encryptedData = await LitJsSdk.encryptFileAndZipWithMetadata({
  // Other parameters...
});
```

#### decryptZipFileWithMetadata

- **v5**: Optional `authSig` or `sessionSigs`, but one must be provided.
- **v6**: `sessionSigs` is **strictly required**.

```ts
// v5
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { AuthSig, SessionSigsMap } from '@lit-protocol/types';

const authSig: AuthSig = {}; // Your AuthSig
const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const decryptedData = await LitJsSdk.decryptZipFileWithMetadata({
  authSig: authSig,
  sessionSigs: sessionSigs,
  // Other parameters...
});
```

```ts
// v6
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { SessionSigsMap } from '@lit-protocol/types';

const sessionSigs: SessionSigsMap = {}; // Your SessionSigs

const decryptedData = await LitJsSdk.decryptZipFileWithMetadata({
  sessionSigs,
  // Other parameters...
});
```

### @lit-protocol/constants

#### Getting Lit Supported Curves

- **v5**: Use `SIGTYPE`.
- **v6**: Use `LIT_CURVE`.

```ts
// v5
import { SIGTYPE } from '@lit-protocol/constants';

export enum SIGTYPE {
  BLS = 'BLS',
  EcdsaK256 = 'K256',
  EcdsaCaitSith = 'ECDSA_CAIT_SITH',
  EcdsaCAITSITHP256 = 'EcdsaCaitSithP256',
}
```

```ts
// v6
import { LIT_CURVE } from '@lit-protocol/constants';

export enum LIT_CURVE {
  BLS = 'BLS',
  EcdsaK256 = 'K256',
  EcdsaCaitSith = 'ECDSA_CAIT_SITH',
  EcdsaCAITSITHP256 = 'EcdsaCaitSithP256',
}
```

### @lit-protocol/pkp-ethers

#### Using PKP as an Ethers Signer

- **v5**: Requires `controllerAuthMethods`, `controllerAuthSig`, `pkpPubKey`, `rpc`, and `litNetwork`.
- **v6**: Requires `controllerSessionSigs`, `litNodeClient`, and `pkpPubKey`.

```ts
// v5
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';

const pkpEthersWallet = new PKPEthersWallet({
  controllerAuthMethods,
  controllerAuthSig,
  pkpPubKey,
  rpc,
  litNetwork: globalThis.LitCI.network,
});
```

```ts
// v6
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';

const pkpEthersWallet = new PKPEthersWallet({
  controllerSessionSigs,
  litNodeClient,
  pkpPubKey,
});
```

## Enhancements, Fixes, and Additions

### signSessionKey

In the `signSessionKey` parameters, three optional arguments have been added for [custom authentication](../../user-wallets/pkps/advanced-topics/auth-methods/custom-auth.md). These arguments allow you to use your PKP to [conditionally sign](../serverless-signing/conditional-signing.md) (via custom Lit Action code) the session key on the Lit nodes. This function is typically used as the callback for the `authNeededCallback` parameter of `getSessionSigs`.

For simplicity, we introduced `getPkpSessionSigs`, which uses `signSessionKey` under the hood.

#### Parameters for `signSessionKey`

Here's the `AuthCallbackParams` interface for the `props`:

```ts
// v5
const response = await this.signSessionKey({
  sessionKey: props.sessionKey,
  statement: props.statement || 'Some custom statement.',
  authMethods: [...params.authMethods],
  pkpPublicKey: params.pkpPublicKey,
  expiration: props.expiration,
  resources: props.resources,
  chainId: 1,
  resourceAbilityRequests: props.resourceAbilityRequests,
});
```

```ts
// v6
const response = await this.signSessionKey({
  sessionKey: props.sessionKey,
  statement: props.statement || 'Some custom statement.',
  authMethods: [...params.authMethods],
  pkpPublicKey: params.pkpPublicKey,
  expiration: props.expiration,
  resources: props.resources,
  chainId: 1,
  resourceAbilityRequests: props.resourceAbilityRequests,

  // Optional fields for custom authentication
  ...(props.litActionCode && { litActionCode: props.litActionCode }),
  ...(props.ipfsId && { ipfsId: props.ipfsId }),
  ...(props.jsParams && { jsParams: props.jsParams }),
});
```

### getPkpSessionSigs

Instead of creating a callback for the `authNeededCallback` parameter in the `getSessionSigs` function, you can now use `getPkpSessionSigs`, which simplifies the process by handling the session key signing internally.

```ts
import { EthWalletProvider } from '@lit-protocol/lit-auth-client';

// Prepare the parameters
const authMethod = await EthWalletProvider.authenticate({
  signer: YOUR_WALLET_SIGNER,
  litNodeClient,
});

const authMethodOwnedPkpPublicKey = '0x...';

const resourceAbilityRequests = [
  {
    resource: new LitPKPResource('*'),
    ability: LitAbility.PKPSigning,
  },
  {
    resource: new LitActionResource('*'),
    ability: LitAbility.LitActionExecution,
  },
];

// Get PKP session signatures
const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
  pkpPublicKey: authMethodOwnedPkpPublicKey,
  authMethods: [authMethod],
  resourceAbilityRequests: resourceAbilityRequests,
});
```

#### Custom Authentication with Lit Actions

For custom authentication, you can set custom JavaScript code to be executed as a Lit Action.

```ts
import { EthWalletProvider } from '@lit-protocol/lit-auth-client';

// Prepare the parameters
const authMethod = await EthWalletProvider.authenticate({
  signer: YOUR_WALLET_SIGNER,
  litNodeClient,
});

const authMethodOwnedPkpPublicKey = '0x...';

const resourceAbilityRequests = [
  {
    resource: new LitPKPResource('*'),
    ability: LitAbility.PKPSigning,
  },
  {
    resource: new LitActionResource('*'),
    ability: LitAbility.LitActionExecution,
  },
];

// Custom Lit Action code (base64 encoded)
const customAuthLitActionCode = Buffer.from(
  `
  // Works with an AuthSig AuthMethod
  if (Lit.Auth.authMethodContexts.some(e => e.authMethodType === 1)) {
    LitActions.setResponse({ response: "true" });
  } else {
    LitActions.setResponse({ response: "false" });
  }
  `
).toString('base64');

// Get PKP session signatures with custom authentication
const litActionSessionSigs = await litNodeClient.getPkpSessionSigs({
  pkpPublicKey: authMethodOwnedPkpPublicKey,
  authMethods: [authMethod],
  resourceAbilityRequests: resourceAbilityRequests,
  litActionCode: customAuthLitActionCode,
  jsParams: {
    publicKey: authMethodOwnedPkpPublicKey,
    sigName: 'custom-auth',
  },
});
```

### Crafting SIWE Messages

To simplify the creation of SIWE (Sign-In with Ethereum) messages, version 6 introduces helper functions.

#### `createSiweMessage`

This versatile function allows users to generate any type of SIWE message. All optional fields are pre-filled with default values, but it's recommended to customize these values for production use.

```ts
import { createSiweMessage } from '@lit-protocol/auth-helper';

const toSign = await createSiweMessage({
  walletAddress: '0xYourWalletAddress',
  nonce: await litNodeClient.getLatestBlockhash(),
  // Other optional parameters...
});
```

#### `createSiweMessageWithRecaps`

This function requires `uri`, `expiration`, and `resources` arguments and is commonly used as a callback argument for the `authNeededCallback` parameter in the `getSessionSigs` function for EOA (Externally Owned Account) wallets.

```ts
import { createSiweMessageWithRecaps } from '@lit-protocol/auth-helper';

const toSign = await createSiweMessageWithRecaps({
  uri: callbackParams.uri,
  expiration: callbackParams.expiration,
  resources: callbackParams.resourceAbilityRequests,
  walletAddress: '0xYourWalletAddress',
  nonce: await litNodeClient.getLatestBlockhash(),
  litNodeClient: litNodeClient,
});
```

### Generating an AuthSig

#### `generateAuthSig`

While `authSig` is mainly used to generate `sessionSigs` in version 6, you can utilize the `generateAuthSig` function to ensure the structure of the `authSig` object is correct.

```ts
import { generateAuthSig, createSiweMessageWithRecaps } from '@lit-protocol/auth-helper';

const wallet = ethers.Wallet.createRandom();
const preparedSiweMessage = await createSiweMessageWithRecaps({
  // Parameters...
});

const authSig = await generateAuthSig({
  signer: wallet,
  toSign: preparedSiweMessage,
});
```

## Clarifications

### createCapacityDelegationAuthSig

There has been some confusion regarding the parameters for `createCapacityDelegationAuthSig`, particularly `capacityTokenId`, `delegateeAddresses`, and `uses` when delegating [Capacity Credits](../serverless-signing/quick-start.md).

:::note

Payment for usage of the Lit Network is currently only required on the `datil` and `datil-test` networks. If you're using the `datil-dev` network, payment is **not** required.

:::

Below is a table detailing the expected behaviors of each parameter:

| Parameter            | Provided with Values                                                                                                                              | Not Provided                                                                                                                | Provided but Empty Array                                                                         |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `capacityTokenId`    | Scopes the delegation to specific NFTs identified by the IDs in the array. Only the NFTs with these IDs are considered.                           | All NFTs owned by the user are eligible under the delegation. The delegation applies universally to all NFTs the user owns. | N/A                                                                                              |
| `delegateeAddresses` | Restricts the use of the delegation to the addresses listed in the array. Only users with these addresses can utilize the delegated capabilities. | The delegation is universally applicable to anyone. There are no restrictions on who can use the delegated capabilities.    | No one is allowed to use the delegated capabilities since no valid user addresses are specified. |
| `uses`               | Sets a limit on the number of times the delegation can be used. The function enforces this limit and prevents use beyond it.                      | There is no limit on the number of times the delegation can be used. The capability can be used indefinitely.               | An empty value for `uses` effectively disables the delegation, as no uses are possible.          |

<FeedbackComponent/>