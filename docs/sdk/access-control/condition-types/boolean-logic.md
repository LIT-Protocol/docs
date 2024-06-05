---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Boolean Logic

Lit Protocol supports boolean logic when checking conditions. Use an object with the "operator" property set to "and" or "or" to combine conditions.

If you wanted to check that the user is a member of a DAO or that they hold more than 0.00001 ETH, you could use the following:

```js
const accessControlConditions = [
  {
    contractAddress: "0x50D8EB685a9F262B13F28958aBc9670F06F819d9",
    standardContractType: "MolochDAOv2.1",
    chain,
    method: "members",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: "=",
      value: "true",
    },
  },
  { operator: "or" },
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];
```

## Boolean nesting

You can also nest boolean conditions. For example, if you want to check that the user is a member of a DAO and that they either hold more than 0.00001 ETH or 10 of an ERC20 token, you can use the following:

```js
const accessControlConditions = [
  {
    "contractAddress":"0x50D8EB685a9F262B13F28958aBc9670F06F819d9",
    "standardContractType":"MolochDAOv2.1",
    "chain",
    "method":"members",
    "parameters":[
      ":userAddress"
    ],
    "returnValueTest":{
      "comparator":"=",
      "value":"true"
    }
  },
  {
    "operator":"and"
  },
  [
    {
      "contractAddress":"",
      "standardContractType":"",
      "chain",
      "method":"eth_getBalance",
      "parameters":[
        ":userAddress",
        "latest"
      ],
      "returnValueTest":{
        "comparator":">=",
        "value":"10000000000000"
      }
    },
    {
      "operator":"or"
    },
    {
      "contractAddress":"0xc0ad7861fe8848002a3d9530999dd29f6b6cae75",
      "standardContractType":"ERC20",
      "chain",
      "method":"balanceOf",
      "parameters":[
        ":userAddress"
      ],
      "returnValueTest":{
        "comparator":">",
        "value":"10"
      }
    }
  ]
]
```

<FeedbackComponent/>
