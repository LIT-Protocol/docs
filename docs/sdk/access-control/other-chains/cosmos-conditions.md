---
sidebar_position: 5
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Cosmos Examples

:::danger

Cosmos access control currently is missing various security properties due to the Cosmos communities lack of a standard on a signed message format.  You should not use Cosmos access control for anything mission critical in it's current form.  Any Cosmos signature that is valid will allow auth via Cosmos.  This means, if a given wallet has ever made a Cosmos txn, it's possible to auth as that wallet by taking the signature from the chain and presenting it to Lit for auth.  If you're building on Cosmos, please reach out, so we can work on a standard signed message format to solve this problem.

:::

:::info
Cosmos Access Control Conditions are supported only by Auth Sigs not Session Sigs (read more about the difference between the two approaches [here](../../authentication/overview.md)).
:::

Cosmos Access Control conditions work a little different than EVM access control conditions. Cosmos conditions let you make a Cosmos or KYVE RPC call, and then filter and parse the response. This is useful for checking the balance of an account, checking the owner of an account, or checking the number of tokens a user has.

Note that Cosmos Conditions can only be used via the `unifiedAccessControlConditions` parameter.

## Must possess at least 1 ATOM

In this example, we are checking if the user's wallet contains more than 1 ATOM. The parameter of ":userAddress" will be automatically substituted with the user's wallet address which was verified by checking the message signed by their wallet.

```js
var unifiedAccessControlConditions = [
  {
    conditionType: "cosmos",
    path: "/cosmos/bank/v1beta1/balances/:userAddress",
    chain,
    returnValueTest: {
      key: "$.balances[0].amount",
      comparator: ">=",
      value: "1000000", // equals 1 ATOM
    },
  },
];
```

## A specific wallet address

In this example, we are checking that the user is in possession of a specific wallet address `cosmos1vn6zl0924yj86jrp330wcwjclzdharljq03a8h`. The parameter of ":userAddress" will be automatically substituted with the user's wallet address which was verified by checking the message signed by their wallet.

```js
var unifiedAccessControlConditions = [
  {
    conditionType: "cosmos",
    path: ":userAddress",
    chain,
    returnValueTest: {
      key: "",
      comparator: "=",
      value: "cosmos1vn6zl0924yj86jrp330wcwjclzdharljq03a8h",
    },
  },
];
```

# Other Cosmos SDK Chains

Want to use a Cosmos chain that you don't see on the list already? Ask us in Discord and we can usually add it for you.

## KYVE Network

## Must be on the KYVE funders list

This example checks if the user is a current KYVE funder. The parameter of ":userAddress" will be automatically substituted with the user's wallet address which was verified by checking the message signed by their wallet. Pay special attention to the "key" in the returnValueTest. The key is a JSONPath that pulls out all the funder addresses.

```js
var unifiedAccessControlConditions = [
  {
    conditionType: "cosmos",
    path: "/kyve/registry/v1beta1/funders_list/0",
    chain: "kyve",
    returnValueTest: {
      key: "$.funders.*.account",
      comparator: "contains",
      value: ":userAddress",
    },
  },
];
```

## Juno Network

## A specific wallet address

In this example, we are checking that the user is in possession of a specific wallet address `juno1vn6zl0924yj86jrp330wcwjclzdharljkajxqt`. The parameter of ":userAddress" will be automatically substituted with the user's wallet address which was verified by checking the message signed by their wallet.

```js
var unifiedAccessControlConditions = [
  {
    conditionType: "cosmos",
    path: ":userAddress",
    chain: "juno",
    returnValueTest: {
      key: "",
      comparator: "=",
      value: "juno1vn6zl0924yj86jrp330wcwjclzdharljkajxqt",
    },
  },
];
```

<FeedbackComponent/>
