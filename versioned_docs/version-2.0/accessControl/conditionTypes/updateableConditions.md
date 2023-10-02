---
sidebar_position: 3
---

# Updateable Conditions

Lit Protocol supports updating conditions by the creator of those conditions. This works for static and dynamic content.

To create an updateable condition, pass `permanent: false` when storing conditions in Lit:

```js
const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  accessControlConditions,
  symmetricKey,
  authSig,
  chain,
  permanent: false,
});
```

## Permanent Conditions

By default, conditions are permanent. You can either omit the `permanent` property when saving a condition or set it to `true`.

## How to update a condition

The main idea here is that you just store the new condition in the same way you stored it originally. It differs slightly between updating an encryption condition (static content) vs a signing condition (dynamic content).

### Static Content

To update the conditions of some static content, simply pass in the `encryptedSymmetricKey` instead of a `symmetricKey`. The `encryptedSymmetricKey` is hashed to create the "primary key" in Lit Protocol DB that represents the condition, so therefore you must pass it so that the Protocol knows which condition to update.

For example:

```js
const newAccessControlConditions = [
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

const newEncryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  accessControlConditions: newAccessControlConditions,
  encryptedSymmetricKey,
  authSig,
  chain,
  permanent: false,
});
```

Note that in the above example, you may throw away `newEncryptedSymmetricKey` because it is identical to the `encryptedSymmetricKey` you passed in and presumably already saved somewhere.

### Dynamic Content

For dynamic content, there is nothing special you have to do or pass in. Simply store the signing condition again and the protocol will update it for you. Make sure you pass in the identical `resourceId` as you did when you stored the condition.

```js
const newAccessControlConditions = [
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

const saved = await litNodeClient.saveSigningCondition({
  accessControlConditions: newAccessControlConditions,
  chain,
  authSig,
  resourceId,
});
```
