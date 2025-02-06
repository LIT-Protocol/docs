---
sidebar_position: 3
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# POAP Examples

## Must possess a POAP with a specific name

This is an integration with https://poap.xyz

It checks that a user holds a specific POAP. Enter the POAP name in the final returnValueTest value. In this example the POAP is "Burning Man 2021".

This actually performs two checks, so there are two access control conditions tested. The first checks that the name of any of the user's POAPs is a match to the returnValueTest value and uses the xDai chain. The second does the same but with ethereum. Since POAPs live on both xDai and Ethereum chains both need to be checked, separated by an 'or' operator. **Both conditions should be identical other than the chain.**

You may use "contains" or "=" for the final returnValueTest comparator. For example, if there are POAPs issued every year for Burning Man, with names in the format of "Burning Man 2021" and "Burning Man 2022" but you just want to check that the user holds any Burning Man POAP, you could use "contains" "Burning Man" and all Burning Man POAPs would pass the test. If you wanted to check for a specific year like 2021, you could use "=" "Burning Man 2021"

```js
var accessControlConditions = [
  {
    contractAddress: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    standardContractType: "POAP",
    chain: "xdai",
    method: "tokenURI",
    parameters: [],
    returnValueTest: {
      comparator: "contains",
      value: "Burning Man 2021",
    },
  },
  {"operator": "or"},
  {
    contractAddress: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    standardContractType: "POAP",
    chain: "ethereum",
    method: "tokenURI",
    parameters: [],
    returnValueTest: {
      comparator: "contains",
      value: "Burning Man 2021",
    },
  },
];
```

## Must possess a POAP with a specific POAP Event ID

This is an integration with https://poap.xyz

It checks that a user holds a specific POAP. Enter the POAP id number in the final returnValueTest value. In this example the POAP ID is "37582".

This actually performs two checks, so there are two access control conditions tested. The first checks that the event ID of any of the user's POAPs is a match to the returnValueTest value and uses the xDai chain. The second does the same but with ethereum. Since POAPs live on both xDai and Ethereum chains both need to be checked, separated by an 'or' operator. **Both conditions should be identical other than the chain.**

```js
var accessControlConditions = [
  {
    contractAddress: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    standardContractType: "POAP",
    chain: "xdai",
    method: "eventId",
    parameters: [],
    returnValueTest: {
      comparator: "=",
      value: "37582",
    },
  },
  {
    operator: "or",
  },
  {
    contractAddress: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
    standardContractType: "POAP",
    chain: "ethereum",
    method: "eventId",
    parameters: [],
    returnValueTest: {
      comparator: "=",
      value: "37582",
    },
  },
];
```

<FeedbackComponent/>
