# Authenticating with Lit
After connecting, sending requests to the Lit network requires authentication. This authentication is necessary to ensure that the Lit network can identify your session and only grant you access to the resources you're authorized to access.

## Session Signatures
Lit uses Session Signatures to authenticate your session. A detailed description of Session Signatures can be found [here](../session-sigs/overview.md).

### Generating Session Signatures
The Lit SDK has multiple methods for generating Session Signatures:

- [`getSessionSigs`](../session-sigs/generating-a-session/using-auth-sig.md)
- [`getPkpSessionSigs`](../session-sigs/generating-a-session/using-pkp.md)
- [`getLitActionSessionSigs`](../session-sigs/generating-a-session/using-lit-action.md)

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

More information on the resources can be found [here](https://v6-api-doc-lit-js-sdk.vercel.app/enums/types_src.LitAbility.html#AccessControlConditionSigning).

### Restricting Session Signatures
To restrict the usage of Session Signatures and define the length of their validity, you can use the `expiration` parameter. This parameter is a string that represents the ISO 8601 date and time when the Session Signatures will expire. Having the Session Signatures expire in 10 minutes would look like:

```tsx
expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString()
```

