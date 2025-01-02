---
sidebar_position: 1
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Unified Access Control Conditions

You can mix and match EVM Basic Conditions, EVM Custom Contract Conditions, Solana RPC Conditions, and Cosmos Conditions in the same array. Use the `unifiedAccessControlConditions` parameter to specify the conditions on any of the LitNodeClient methods.

For each condition, you must add a `conditionType` field that specifies the type of condition. The `conditionType` field can be one of the following:

- For [EVM Basic Conditions](../../access-control/evm/basic-examples), also known as classic "Access Control Conditions", use the string `evmBasic`
- For [EVM Custom Contract Conditions](../../access-control/evm/custom-contract-calls), use the string `evmContract`
- For [Solana RPC Conditions](../../access-control/other-chains/sol-rpc-conditions), use the string `solRpc`
- For [Cosmos or Kyve Conditions](../../access-control/other-chains/cosmos-conditions), use the string `cosmos`

## Passing Wallet AuthSigs for unified access control conditions

All requests to the LitNodeClient API require an AuthSig to be present. The AuthSig is a signature of a message signed by the user's wallet, used to authenticate the request. In the case of unified access control conditions, you may pass an AuthSig for each chain ecosystem that you are using. Meaning, you can pass an EVM wallet signature and a Solana wallet signature at the same time. You can do this by passing an object as the `authSig` parameter with keys of `ethereum` for all EVM chains and `solana` for all Solana chains, an example of which you can see below:

```js
// first, obtain auth sigs from both chains
var solAuthSig = await LitJsSdk.checkAndSignAuthMessage({
  chain: "solana",
});

var ethAuthSig = await LitJsSdk.checkAndSignAuthMessage({
  chain: "ethereum",
});

var cosmosAuthSig = await LitJsSdk.checkAndSignAuthMessage({
  chain: "cosmos",
});

var kyveAuthSig = await LitJsSdk.checkAndSignAuthMessage({
  chain: "kyve",
});

// now, when you want to use the auth sigs, pass them as an object, with the key being the chain name.
await litNodeClient.encryptString({
  unifiedAccessControlConditions,
  authSig: {
    cosmos: cosmosAuthSig,
    kyve: kyveAuthSig,
    solana: solAuthSig,
    ethereum: ethAuthSig, // note that the key here is "ethereum" for any and all EVM chains.  If you're using Polygon, for example, you should still have "ethereum" here.
  },
  dataToEncrypt: "blah",
});
```

## Combining all 4 types of conditions

In this example, we use the `unifiedAccessControlConditions` parameter to combine all 3 types of conditions with "or" operators. The user must meet at least one of the conditions:

- Possess at least 0.1 SOL on Solana
- Possess at least 0.00001 ETH on Ethereum
- Possess at least 1 ERC1155 token with id 8 and at contract 0x7C7757a9675f06F3BE4618bB68732c4aB25D2e88 on Polygon
- Possess at least 1 ATOM on Cosmos

```js
var unifiedAccessControlConditions = [
  {
    conditionType: "solRpc",
    method: "getBalance",
    params: [":userAddress"],
    chain: "solana",
    pdaParams: [],
    pdaInterface: { offset: 0, fields: {} },
    pdaKey: "",
    returnValueTest: {
      key: "",
      comparator: ">=",
      value: "100000000", // equals 0.1 SOL
    },
  },
  { operator: "or" },
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000", // equals 0.00001 ETH
    },
  },
  { operator: "or" },
  {
    conditionType: "evmContract",
    contractAddress: "0x7C7757a9675f06F3BE4618bB68732c4aB25D2e88",
    functionName: "balanceOf",
    functionParams: [":userAddress", "8"],
    functionAbi: {
      type: "function",
      stateMutability: "view",
      outputs: [
        {
          type: "uint256",
          name: "",
          internalType: "uint256",
        },
      ],
      name: "balanceOf",
      inputs: [
        {
          type: "address",
          name: "account",
          internalType: "address",
        },
        {
          type: "uint256",
          name: "id",
          internalType: "uint256",
        },
      ],
    },
    chain: "polygon",
    returnValueTest: {
      key: "",
      comparator: ">",
      value: "0",
    },
  },
  { operator: "or" },
  {
    conditionType: "cosmos",
    path: "/cosmos/bank/v1beta1/balances/:userAddress",
    chain: "cosmos",
    returnValueTest: {
      key: "$.balances[0].amount",
      comparator: ">=",
      value: "1000000", // equals 1 ATOM
    },
  },
];
```

## Supported Comparators for Return Value Test

Below is a list of supported comparators that can be specified in the `returnValueTest.comparator` field within the `unifiedAccessControlConditions` parameter. These comparators are utilized for performing return value tests on Lit Action conditions.

- `>` (Greater Than)
- `<` (Less Than)
- `>=` (Greater Than or Equal To)
- `<=` (Less Than or Equal To)
- `=` (Equal To)
- `!=` (Not Equal To)
- `contains` (Contains the specified value)
- `!contains` (Does not contain the specified value)

<FeedbackComponent/>
