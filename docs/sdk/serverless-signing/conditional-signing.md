import FeedbackComponent from "@site/src/pages/feedback.md";

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Conditional Signing

## Overview
Lit Actions inherit the powerful condition checking ability that Lit Protocol utilizes for [access control](../access-control/intro). You can easily check on or off-chain conditions inside of Lit Actions to generate proofs and condition-based transaction automations.

The below example will check if the user has at least 1 Wei on Ethereum, only returning a signature if they do.

## Prerequisites

- Knowledge of [SessionSigs](../authentication/session-sigs/intro)
- Knowledge of how to [generate an AuthSig](../migrations/6.0.0.md#generate-an-authsig)
- Basic understanding of [Lit Actions](../serverless-signing/quick-start)

## Complete Code Example

The complete code example is available in the [Lit Developer Guides Code Repository](https://github.com/LIT-Protocol/developer-guides-code/tree/master/conditional-signing). There is both a browser and Node.js implementation of the code.

### Example Lit Action

This function performs a condition check on the authenticated user's Ethereum balance (the user who signed the Sign-in With Ethereum [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) message to create the `AuthSig`), returning a boolean. This is then used to determine whether or not the PKP will sign `dataToSign` or not.

The below example will check if the user has at least 1 Wei on Ethereum, only returning a signature if they do. It uses the [`checkConditions`](https://actions-docs.litprotocol.com/#checkconditions) function from the [Lit Actions SDK](https://actions-docs.litprotocol.com/). This performs a conditional check on the user's Ethereum balance, checking the balance of the wallet address that signed the Sign-in With Ethereum [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) when creating the `AuthSig`, which is passed in as an argument to the Lit Action. The boolean returned will be used to determine whether the wallet will be used to sign `dataToSign` or not. 

:::note
The `toSign` data is required to be an array of 8-bit integers. An example of this is shown below:

```ts
dataToSign: ethers.utils.arrayify(ethers.utils.keccak256([1, 2, 3, 4, 5])),
```
:::

:::info
In the below code example, `sigShare` is a magic value within a Lit Action that will be automatically returned for you.
:::

```jsx
const _litActionCode = async () =>  {
  try {
    // test an access control condition
    const testResult = await Lit.Actions.checkConditions({
      conditions,
      authSig,
      chain,
    });

    if (!testResult) {
      LitActions.setResponse({ response: "address does not have 1 or more Wei on Ethereum Mainnet" });
      return;
    }

    const sigShare = await LitActions.signEcdsa({
      toSign: dataToSign,
      publicKey,
      sigName: "sig",
    });
  } catch (error) {
    LitActions.setResponse({ response: error.message });
  }
};

const litActionCode = `(${_litActionCode.toString()})();`;
```

## Summary
This guide demonstrates how to use Lit Actions to conditionally sign a message or transaction.

If you'd like to learn more about Lit Actions, check out the [Lit Actions SDK](https://actions-docs.litprotocol.com/), or our [Advanced Topics](https://developer.litprotocol.com/category/advanced-topics-1) section on Lit Actions.

<FeedbackComponent/>
