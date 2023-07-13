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

// Saving signing condition
await litNodeClient.saveSigningCondition({
  unifiedAccessControlConditions,
  sessionSigs,
  resourceId,
  chain: "litSessionSign",
});

// Retrieving a signature
let jwt = await litNodeClient.getSignedToken({
  unifiedAccessControlConditions,
  sessionSigs,
  resourceId,
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

// encrypt
const { encryptedZip, symmetricKey } =
  await LitJsSdk.zipAndEncryptString("this is a secret message");

// store the decryption conditions
const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  unifiedAccessControlConditions,
  symmetricKey,
  sessionSigs,
});

// retrieving the key:
const hashOfKey = await LitJsSdk.hashEncryptionKey({
  encryptedSymmetricKey,
});

// Create an access control condition resource
var litResource = new LitAccessControlConditionResource(hashOfKey);

sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resourceAbilityRequests: [
    resource: litResource,
    ability: LitAbility.AccessControlConditionDecryption
  ]
});

 const retrievedSymmKey = await litNodeClient.getEncryptionKey({
  unifiedAccessControlConditions,
  toDecrypt: LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  ),
  sessionSigs,
});

const decryptedFiles = await LitJsSdk.decryptZip(
  encryptedZip,
  retrievedSymmKey
);
const decryptedString = await decryptedFiles["string.txt"].async(
  "text"
);
console.log("decrypted string", decryptedString);
```