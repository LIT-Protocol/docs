# Authentication

To use Lit Protocol, you must generate and present signatures to the nodes in order to authenticate successfully. Currently, there are two ways of doing so - wallet signatures and session signatures.

## Wallet Signatures

We currently support providing a wallet signature to the SDK function like so:

```javascript
const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  accessControlConditions,
  symmetricKey,
  authSig,
})
```

We **do not** recommend using this method of authentication as they are on the deprecation path and it is insecure.

Read more about wallet signatures [here](/SDK/Explanation/authentication/authSig).

## Session Signatures (recommended)

We currently support providing a session signature to the SDK function like so:

```javascript
const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  accessControlConditions,
  symmetricKey,
  sessionSigs,
});
```

This is the **recommended** method of authenticating against the Lit Protocol nodes as it is more secure and provides a better end-user experience.

Read more about session signatures [here](/SDK/Explanation/authentication/sessionSigs).
