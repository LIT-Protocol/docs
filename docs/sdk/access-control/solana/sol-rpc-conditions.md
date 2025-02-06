---
sidebar_position: 4
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Access Control Conditions Examples

The following examples demonstrate additional Solana RPC Conditions you can use to control access to your application. After [authenticating a Sign-in With Solana (SIWS) message](../../authentication/authenticating-siws.md), you can use these Solana RPC Conditions to check if the authenticated Solana public key meets certain conditions.

:::note
You can use Solana RPC Conditions in the same way you would use EVM conditions, but you should pass a `solRpcConditions` array instead of a `accessControlConditions` or `evmContractConditions` array.
:::

## Must possess an NFT in a Metaplex collection

In this example, we are checking if the user owns one or more NFTs in the Metaplex collection with address `FfyafED6kiJUFwEhogyTRQHiL6NguqNg9xcdeoyyJs33`. The collection must be verified. Note that "balanceOfMetaplexCollection" is not a real Solana RPC call. It is a custom RPC call that is specific to Lit Protocol.

```js
var solRpcConditions = [
  {
    method: "balanceOfMetaplexCollection",
    params: ["FfyafED6kiJUFwEhogyTRQHiL6NguqNg9xcdeoyyJs33"],
    pdaParams: [],
    pdaInterface: { offset: 0, fields: {} },
    pdaKey: "",
    chain,
    returnValueTest: {
      key: "",
      comparator: ">",
      value: "0",
    },
  },
];
```

## Must possess at least 0.1 SOL

In this example, we are checking if the user's wallet contains more than 0.1 SOL. The parameter of ":userAddress" will be automatically substituted with the user's wallet address which was verified by checking the message signed by their wallet.

```js
var solRpcConditions = [
  {
    method: "getBalance",
    params: [":userAddress"],
    pdaParams: [],
    pdaInterface: { offset: 0, fields: {} },
    pdaKey: "",
    chain: "solana",
    returnValueTest: {
      key: "",
      comparator: ">=",
      value: "100000000", // equals 0.1 SOL
    },
  },
];
```

## Must possess a balance of a specific token (Fungible or NFT)

This example checks if the user owns at least 1 token with address `FrYwrqLcGfmXrgJKcZfrzoWsZ3pqQB9pjjUC9PxSq3xT`. This is done by deriving the user's token account address for the token contract with the user's wallet address, validated via the message signed by the user's wallet. Then, `getTokenAccountBalance` is run on the user's token account address and the result is checked against the `returnValueTest`. Note that "balanceOfToken" is not a real Solana RPC call. It is a custom RPC call that is specific to Lit Protocol.

```js
var solRpcConditions = [
  {
    method: "balanceOfToken",
    params: ["FrYwrqLcGfmXrgJKcZfrzoWsZ3pqQB9pjjUC9PxSq3xT"],
    pdaParams: [],
    pdaInterface: { offset: 0, fields: {} },
    pdaKey: "",
    chain,
    returnValueTest: {
      key: "$.amount",
      comparator: ">",
      value: "0",
    },
  },
];
```

## A specific token account balance

This is useful if you already know the token account address and want to check the balance of that account. Note that putting the user's wallet address in here will NOT work, because the user's wallet owns the token account, which is a separate on-chain account that owns the token itself. In this example, we re checking the token account `E7aAccig7X3X4pSWjf1eqqUJkV3EbzG6DrtyM2gbuuhH`.

```js
var solRpcConditions = [
  {
    method: "getTokenAccountBalance",
    params: ["E7aAccig7X3X4pSWjf1eqqUJkV3EbzG6DrtyM2gbuuhH"],
    pdaParams: [],
    pdaInterface: { offset: 0, fields: {} },
    pdaKey: "",
    chain: "solana",
    returnValueTest: {
      key: "amount",
      comparator: ">",
      value: "0",
    },
  },
];
```

## Get a Program Derived Address (PDA) and use that as a parameter in a RPC call

The condition below will derive a PDA using pdaParams, pdaInterface, and pdaKey. The PDA is then used as a parameter in the getBalance RPC call.

```js
[
  {
    method: "getBalance(getPDA)",
    params: [],
    pdaParams: [
      "chatGL6yNgZT2Z3BeMYGcgdMpcBKdmxko4C5UhEX4To",
      "delegate-wallet",
      ":userAddress",
    ],
    pdaInterface: { offset: 8, fields: { owner_wallet: 32 } },
    pdaKey: "owner_wallet",
    chain: "solana",
    returnValueTest: {
      key: "",
      comparator: ">=",
      value: "100000000", // equals 0.1 SOL
    },
  },
];
```

<FeedbackComponent/>
