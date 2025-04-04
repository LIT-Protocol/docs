# Signing within a Lit Action using EIP-191

## Overview

Lit Actions offer the ability to use [EIP-191](https://eips.ethereum.org/EIPS/eip-191?ref=blog.spruceid.com) to sign a message instead of a transaction or raw signature. This is done with the Lit Actions method [ethPersonalSignMessageEcdsa](https://actions-docs.litprotocol.com/#ethpersonalsignmessageecdsa). 

It will prepend to your message: `"\x19Ethereum Signed Message:\n"` and the length of the message, then hash and sign it according to the EIP-191 standard.

## Code Example

The complete code example is available in the [Lit Developer Guides Code Repository](https://github.com/LIT-Protocol/developer-guides-code/tree/master/eip-191-signing). There you can find a Node.js and browser implementation of this example code.

### Example Lit Action

The return value of `ethPersonalSignMessageEcdsa` (the `sigShare` variable in this example) is set to a boolean value of `true` if the signature was successfully generated, and `false` otherwise. The Lit Action will also return the complete signature as an object under the `sigName` key.

```jsx
const _litActionCode = async () => {
  try {
    const sigShare = await LitActions.ethPersonalSignMessageEcdsa({
      message: dataToSign,
      publicKey,
      sigName,
    });
    LitActions.setResponse({ response: sigShare });
  } catch (error) {
    LitActions.setResponse({ response: error.message });
  }
};

export const litActionCode = `(${_litActionCode.toString()})();`;
```
## Prerequisites

- Basic understanding of [PKPs](../../../user-wallets/pkps/overview)
- Basic understanding of [Lit Actions](../serverless-signing/quick-start)

## Summary
This guide demonstrates how to sign an EIP-191 message using Lit Actions.

If you'd like to learn more about Lit Actions, check out the [Lit Actions SDK](https://actions-docs.litprotocol.com/), or our [Advanced Topics](https://developer.litprotocol.com/category/advanced-topics-1) section on Lit Actions.

<FeedbackComponent/>
