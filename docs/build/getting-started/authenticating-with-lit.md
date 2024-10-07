# Authenticating with Lit
In order to send transactions on Lit, you need to authenticate with the Lit nodes. The authentication process allows you to establish an active session and ensures that you have access to the capabilities relevant to your specific use case.

## Session Signatures
Authentication is handled via Session Signatures. Session Signatures allow you to use a specific Lit "Ability" (i.e. signing a transaction) with a particular Lit "Resource" (i.e. a Programmable Key Pair). You can find a detailed explanation [here](../session-sigs/overview.md).

### Generating Session Signatures
The Lit SDK has multiple methods for generating Session Signatures:

- [`getSessionSigs`](../session-sigs/generating-a-session/using-auth-sig.md)
    - This function is the simplest way to get Session Signatures, at the minimum only requiring an Ethereum wallet and the `LitNodeClient`. It will enable specific capabilities for your session keypair using the resources you specify in the `AuthSig`.
- [`getPkpSessionSigs`](../session-sigs/generating-a-session/using-pkp.md)
    - This function uses the [signSessionKey](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#signSessionKey) function to sign the session public key using the PKP, which will generate an `AuthSig`. Once the `AuthSig` has been created, it is then signed by the session keypair. Signing the `AuthSig` with the session keypair creates the Session Signatures.
- [`getLitActionSessionSigs`](../session-sigs/generating-a-session/using-lit-action.md)
    - This function is the same as `getPkpSessionSigs`, but executes the given Lit Action to determine authorization.

The best method to use depends on your use case.

### Storing Session Signatures
If you're using Node.js, the Session Signatures will be stored wherever the `storageProvider` is configured to store them. If no `storageProvider` is provided, the session signatures will not be stored.

If you're using a browser environment, the Session Signatures will be stored in the browser's local storage. To clear the cached Session Signatures, you can use the `disconnectWeb3()` function.

### Session Capabilities
Session Signatures are used to grant access to specific resources on the Lit network. The resources you can request for your session can be found [here](https://v6-api-doc-lit-js-sdk.vercel.app/enums/types_src.LitAbility.html).

### Table
| Resource                        | Requires Session Signatures |
| ------------------------------- | --------------------------- |
| Lit Action Execution            | ✅                          |
| Minting a PKP                   | ❌                          |
| PKP Signing                     | ✅                          |
| Encryption Access Control       | ❌                          |
| Decryption Access Control       | ✅                          |
| Signing Access Control          | ✅                          |
| Capacity Credits Authentication | ✅                          |

More information on the requestable resources can be found [here](https://v6-api-doc-lit-js-sdk.vercel.app/enums/types_src.LitAbility.html#AccessControlConditionSigning).

### Restricting Session Signatures
To restrict the usage of Session Signatures and define the length of their validity, you can use the `expiration` parameter. This parameter is a string that represents the ISO 8601 date and time when the Session Signatures will expire. Having the Session Signatures expire in 10 minutes would look like:

```tsx
expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString()
```

