---
sidebar_position: 3
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Custom Contract Calls

This page defines how to create access control conditions (referred to as `evmContractConditions` in the code) based on any smart contract call on an EVM (Ethereum) compatible network. You may pass any function ABI, and define the `returnValueTest` under which access should be granted.

## Must have at least 1 share in a given MolochDAOv2.1 DAO

```js
const evmContractConditions = [
  {
    contractAddress: "0xb71a679cfff330591d556c4b9f21c7739ca9590c",
    functionName: "members",
    functionParams: [":userAddress"],
    functionAbi: {
      constant: true,
      inputs: [
        {
          name: "",
          type: "address",
        },
      ],
      name: "members",
      outputs: [
        {
          name: "delegateKey",
          type: "address",
        },
        {
          name: "shares",
          type: "uint256",
        },
        {
          name: "loot",
          type: "uint256",
        },
        {
          name: "exists",
          type: "bool",
        },
        {
          name: "highestIndexYesVote",
          type: "uint256",
        },
        {
          name: "jailed",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    chain: "xdai",
    returnValueTest: {
      key: "shares",
      comparator: ">=",
      value: "1",
    },
  },
];
```

## Must possess at least one ERC1155 token with a given token id

```js
var evmContractConditions = [
  {
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
    chain,
    returnValueTest: {
      key: "",
      comparator: ">",
      value: "0",
    },
  },
];
```

## Using SIWE params in Custom Contract Calls

You can use a SIWE resource parameter in an access control condition. Below is an example of using a SIWE param for a tokenId of "8", indicated with the `litParam:tokenId:<value>` param in a custom contract call. This means that anywhere that ":litParam:tokenId" appears in the `functionParams`, it will be substituted with the number "8" from the SIWE resource parameter. Note that the actual value of the SIWE param needs to be base64url encoded. The nodes will base64url decode the value before substituting it into the `functionParams`.

Creating the AuthSig with the SIWE param:

```
 let tokenId = "8";
// base64url encode the param
let encodedSiweResource = LitJsSdk.uint8arrayToString(
  LitJsSdk.uint8arrayFromString(tokenId, "utf8"),
  "base64url"
);
const authSig = await LitJsSdk.checkAndSignAuthMessage({
  chain,
  resources: [`litParam:tokenId:${encodedSiweResource}`],
});
```

Creating the evmContractCondition:

```
var evmContractConditions = [
  {
    contractAddress: "0x7C7757a9675f06F3BE4618bB68732c4aB25D2e88",
    functionName: "balanceOf",
    functionParams: [":userAddress", ":litParam:tokenId"],
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
    chain,
    returnValueTest: {
      key: "",
      comparator: ">",
      value: "0",
    },
  },
];
```

## Encoding arrays in functionParams

The following condition uses a function that accepts an array of bytes32 objects. To pass these objects, you should remove the 0x prefix from the hex string. You can view the function being called in this example for reference here: https://gnosisscan.io/address/0xc7BA08FB2546cA2198F6C69e5c4B15252D90A347#code

```js
var evmContractConditions = [
  {
    contractAddress: "0xc7BA08FB2546cA2198F6C69e5c4B15252D90A347",
    functionName: "sumBytes32",
    functionParams: [
      "[0000000000000000000000000000000000000000000000000000000000000002,0000000000000000000000000000000000000000000000000000000000000003]",
    ],
    functionAbi: {
      name: "sumBytes32",
      inputs: [{ internalType: "bytes32[]", name: "vals", type: "bytes32[]" }],
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      constant: true,
      stateMutability: "view",
    },
    chain: "xdai",
    returnValueTest: { key: "", comparator: "=", value: "5" },
  },
];
```

<FeedbackComponent/>
