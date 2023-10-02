---
sidebar_position: 3
---

# Authenticate with SessionSigs

Once you have obtained `SessionSigs`, you can replace where you provide an `AuthSig` with the `SessionSigs` object. Below are some examples using the Lit SDK.

## Making Signing Requests

```javascript
var unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

// Retrieving a signature
let jwt = await litNodeClient.getSignedToken({
  unifiedAccessControlConditions,
  sessionSigs,
});
```

## Making Encryption Requests

```javascript
var unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];
const chain = "ethereum";

// encrypt
const { ciphertext, dataToEncryptHash } =
  await LitJsSdk.zipAndEncryptString(
    {
      unifiedAccessControlConditions,
      chain,
      sessionSigs,
      dataToEncrypt: "this is a secret message",
    },
    litNodeClient,  
  );

sessionSigs = await LitJsSdk.getSessionSigs({
  chain,
  litNodeClient,
  resourceAbilityRequests: []
});

const decryptedFiles = await LitJsSdk.decryptToZip(
  {
    unifiedAccessControlConditions,
    chain,
    sessionSigs,
    ciphertext,
    dataToEncryptHash,
  },
  litNodeClient,
);
const decryptedString = await decryptedFiles["string.txt"].async(
  "text"
);
console.log("decrypted string", decryptedString);
```