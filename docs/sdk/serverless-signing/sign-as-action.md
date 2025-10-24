import FeedbackComponent from "@site/src/pages/feedback.md";

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Signing as an Action

## Overview

Lit Actions can sign data using their own cryptographic identity derived from their IPFS CID. This allows actions to sign as themselves (not using a [PKP](../../user-wallets/pkps/overview)), enabling autonomous agent behavior, action-to-action authentication, and verifiable computation results.

The Lit Action's keypair is deterministically derived from: `keccak256("lit_action_" + actionIpfsCid)`, so the same Lit Action IPFS CID always generates the same keypair across all Lit nodes.

## Prerequisites

- Basic understanding of [Lit Actions](../serverless-signing/quick-start)
- Knowledge of [Session Signatures](../authentication/session-sigs/intro)

## Complete Code Example

The complete code example is available in the [Lit Developer Guides Code Repository](https://github.com/LIT-Protocol/developer-guides-code/tree/master/sign-as-action/nodejs). There you can find a Node.js implementation of this example code.

## Signing with `signAsAction`

### Example Lit Action

The [`signAsAction`](https://naga.actions-docs.litprotocol.com/#signasaction) method allows a Lit Action to sign data using its own cryptographic identity. The signature is deterministically generated based on the Lit Action's IPFS CID.

:::note
On Datil networks, the `signingScheme` must be `EcdsaK256Sha256`.
:::

```jsx
const _signAsActionLitAction = async () => {
  const signature = await Lit.Actions.signAsAction({
    toSign,
    sigName,
    signingScheme,
  });
  Lit.Actions.setResponse({ response: signature });
};

const signAsActionCode = `(${_signAsActionLitAction.toString()})();`;
```

### Executing the Lit Action

To execute the Lit Action, use the `executeJs` method with the following parameters:

```ts
const litActionSignature = await litNodeClient.executeJs({
  sessionSigs,
  code: signAsActionCode,
  jsParams: {
    toSign: message, // Uint8Array - the message to sign
    sigName: "sig",
    signingScheme: "EcdsaK256Sha256",
  },
});
```

The response will contain a signature object with `r`, `s`, and `v` values that can be used for verification.

## Verifying with `verifyActionSignature`

### Example Lit Action

The [`verifyActionSignature`](https://naga.actions-docs.litprotocol.com/#verifyactionsignature) method verifies that a signature was created by a specific Lit Action. This enables action-to-action authentication and verifiable computation.

```jsx
const _verifyActionSignatureLitAction = async () => {
  const result = await Lit.Actions.verifyActionSignature({
    signingScheme,
    actionIpfsCid,
    toSign,
    signOutput,
  });
  Lit.Actions.setResponse({ response: JSON.stringify(result) });
};

const verifyActionCode = `(${_verifyActionSignatureLitAction.toString()})();`;
```

### Executing the Verification

To verify a signature, execute the Lit Action with the original message, the signature output from the `signAsAction` execution, and the IPFS CID of the action that created the signature:

```ts
const response = await litNodeClient.executeJs({
  sessionSigs,
  code: verifyActionCode,
  jsParams: {
    actionIpfsCid: "Qm...", // IPFS CID of the action that created the signature
    toSign: message, // Same Uint8Array that was originally signed by the signAsAction Lit Action
    signOutput: signatureString, // The signature output from the signAsAction Lit Action
    signingScheme: "EcdsaK256Sha256",
  },
});
```

The response will contain a boolean indicating whether the signature is valid.

## Use Cases

- **Oracle Attestations**: A price oracle Lit Action can sign market data it fetches, allowing other contracts to verify the data came from the specific oracle action
- **Multi-Action Workflows**: A data processing Lit Action can verify signatures from a data collection Lit Action before processing the data, creating secure pipelines
- **Reputation Systems**: Lit Actions can build verifiable execution histories by signing their outputs, enabling trustless reputation tracking

## Summary

This guide demonstrates how to use Lit Actions to sign data with their own cryptographic identity and verify those signatures. This powerful feature enables autonomous agent behavior and action-to-action authentication.

If you'd like to learn more about the utility functions available to Lit Actions, check out the [Lit Actions SDK](https://actions-docs.litprotocol.com/), or our checkout the other [Advanced Topics](https://developer.litprotocol.com/category/advanced-topics-1).

<FeedbackComponent/>
