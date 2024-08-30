---
sidebar_position: 5
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Sign In With Ethereum Parameters

A EIP-4631 compliant Sign in with Ethereum message is signed by the user's wallet and presented with every request to the Lit Nodes. This signed message is used to authenticate the user's wallet, but you can also create access control conditions based on the content of this message. Specifically, you can create access control conditions based on the Domain and Resources parameters of the Sign in with Ethereum message. You can learn more about Sign in with Ethereum here: [https://docs.login.xyz/](https://docs.login.xyz/).

## Domain

This will check the domain of the Sign in with Ethereum message and compare it to the domain specified in the `returnValueTest`. In this case, the domain must match "localhost:3050". This condition is useful to prevent signature reuse across domains. You can use the "AND" operator with Boolean Logic to add this condition to any other condition which will prevent using signatures from other domains.

```js
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "SIWE",
    chain: "ethereum",
    method: "",
    parameters: [":domain"],
    returnValueTest: {
      comparator: "=",
      value: "localhost:3050",
    },
  },
];
```

## Resources

This will check the resources field of the Sign in with Ethereum message and compare it to the resource specified in the `returnValueTest`. In this case, the resources array must contain `ipfs://someTestId`.

```js
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "SIWE",
    chain: "ethereum",
    method: "",
    parameters: [":resources"],
    returnValueTest: {
      comparator: "contains",
      value: "ipfs://someTestId",
    },
  },
];
```

## Using SIWE params in Custom Contract Calls

See the [Custom Contract Calls](../evm/custom-contract-calls.md) page for more information on how to use SIWE params in custom contract calls.

<FeedbackComponent/>
