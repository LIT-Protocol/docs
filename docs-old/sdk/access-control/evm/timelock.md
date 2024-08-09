---
sidebar_position: 4
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Timelock Example

## Timelock (Time-based Access Control)

This will get the latest block from your blockchain of choice, and compare it to the unix timestamp that was specified in the `returnValueTest`. In this example, the user will be able to unlock after unix timestamp `1651276942`. Make sure to pass the unix timestamp as a string.

```js
var accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "timestamp",
    chain: "ethereum",
    method: "eth_getBlockByNumber",
    parameters: ["latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1651276942"
    },
  },
];
```

<FeedbackComponent/>
