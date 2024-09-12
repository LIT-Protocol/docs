import FeedbackComponent from "@site/src/pages/feedback.md";

# Decrypting within a Lit Action

## Overview

Decryption with Lit can be performed either client-side by an authorized user or within a Lit Action.

Using decryption within a Lit Action is useful for performing operations over sensitive data, where the data itself remains private within the confines of each Lit node's Trusted Execution Environment (TEE). You can learn more about Lit's architecture [here](../../resources/how-it-works#sealed-and-confidential-hardware.md).

Lit Actions have two methods for decrypting data: `decryptToSingleNode` and `decryptAndCombine`. The former reduces the execution scope of the Lit Action to a single node and decrypts the data there. The latter collects each Lit node's decryption share, combines them, and then decrypts the data on a single node. The key difference between the two is that `decryptToSingleNode` only uses the decryption share of a single Lit node, while `decryptAndCombine` uses all of the decryption shares of all Lit nodes.

When `decryptToSingleNode` is used, the execution scope being reduced to a single Lit node means that any behavior that requires multiple nodes (i.e. console logs, `signAndCombineEcdsa`) will encounter a timeout error.

The following example demonstrates how to encrypt an API key client-side, then decrypt and use it within a Lit Action to query the block number on Base.

## Prerequsites
- Knowledge of [SessionSigs](../authentication/session-sigs/intro)
- Basic understanding of [Lit Actions](../serverless-signing/quick-start)
- Intermediate understanding of Lit [Encryption and Decryption](../access-control/quick-start)

## Complete Code Example
The complete code example is available in the [Lit Developer Guides Code Repository](https://github.com/LIT-Protocol/developer-guides-code/tree/master/decrypt-api-key-in-action/nodejs).

### Example Lit Action

The `decryptAndCombine` function uses the `accessControlConditions` to specify who and under what conditions the data can be decrypted. The `ciphertext` and `dataToEncryptHash` are the encrypted data and the hash of the data that was encrypted.

We set the `authSig` to null as a way to tell the Lit Action runtime to use the `authSig` which was provided to the node when you call `executeJs`. It will use the AuthSig within the session signatures. 

Then our decrypted API key is used to query the blocknumber on Base.

```tsx
const _litActionCode = async () => {
  try {
    const apiKey = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: "ethereum",
    });

    const fullUrl = url + apiKey;

    const resp = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber",
        params: [],
      }),
    });

    let data = await resp.json();

    if (data.result) {
      data.result = parseInt(data.result, 16);
    }

    Lit.Actions.setResponse({ response: JSON.stringify(data) });
  } catch (e) {
    Lit.Actions.setResponse({ response: e.message });
  }
};

export const litActionCode = `(${_litActionCode.toString()})();`;
```

## Summary

This guide demonstrates how to use Lit Actions to decrypt data within a Lit Action.

If you'd like to learn more about Lit Actions, check out the [Lit Actions SDK](https://actions-docs.litprotocol.com/), or our [Advanced Topics](https://developer.litprotocol.com/category/advanced-topics-1) section on Lit Actions.