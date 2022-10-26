---
sidebar_position: 3
---

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

## Must posess at least one ERC1155 token with a given token id

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
