---
sidebar_position: 4
---

# Signed Chain Data

## Cross chain communication and authentication without provisioning access beforehand

If you'd like to request that the Lit Network sign the result of a smart contract function call, you can do that using the `getSignedChainDataToken` function of the LitNodeClient.

This will perform a smart contract function RPC call, sign the response, and then return a JWT. You may send this JWT to a server, or, send it into a smart contract to enable a cross-chain communication use-case. Solidity code to verify the signature is not yet available.

To call a function, you need the smart contract ABI. For this example, we will use the Chainlink price oracle smart contract.

```js
const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint80", name: "_roundId", type: "uint80" },
    ],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
```

Next, you'll need the smart contract address

```js
const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
```

Encode the call data using the `encodeCallData` function

```js
const callData = LitJsSdk.encodeCallData({
  abi: aggregatorV3InterfaceABI,
  functionName: "latestRoundData",
  functionParams: [],
});
```

Request the signed chain data token from the Lit Network. Note that this requires a connected LitNodeClient.

```js
const jwt = await litNodeClient.getSignedChainDataToken({
  callRequests,
  chain: 'ethereum',
});
```

You can then extract the various parts of the JWT, and verify the signature, using the `verifyJwt` function.

```js
const { verified, header, payload, signature } = LitJsSdk.verifyJwt({
  jwt,
});
```

The responses to the function calls live in the `payload.callResponses` array. You can decode them using the `decodeCallResult` function.

```js
const decoded = LitJsSdk.decodeCallResult({
  abi: aggregatorV3InterfaceABI,
  functionName: "latestRoundData",
  data: payload.callResponses[0],
});
```

At this point, the function call response is in the `decoded` variable. For this smart contract call, the current price of ETH in USD is in `decoded.answer` as a BigNumber.

You can now verify the signature and be certain that the smart contract function call returned that result at the time it was called (if the signature is genuine).
