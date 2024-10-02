# Authenticating with Lit
After connecting, sending requests to the Lit network requires authentication. This authentication is necessary to ensure that the Lit network can identify your session and only grant you access to the resources you're authorized to access.

## Session Signatures
Lit uses session signatures to authenticate your session. A detailed description of session signatures can be found [here](../session-sigs/overview.md).

### Generating Session Signatures
The Lit SDK has multiple methods for generating session signatures:

- [`getSessionSigs`](../session-sigs/generating-a-session/using-auth-sig.md)
- [`getPkpSessionSigs`](../session-sigs/generating-a-session/using-pkp.md)
- ['getLitActionSessionSigs`](../session-sigs/generating-a-session/using-lit-action.md)

The best method to use depends on your use case. This example will use `getSessionSigs`.

### Storing Session Signatures
If you're using Node.js, the session signatures will be stored wherever the `storageProvider` is configured to store them. If no `storageProvider` is provided, the session signatures will not be stored.

If you're using a browser environment, the session signatures will be stored in the browser's local storage. To clear the cached session signatures, you can use the `disconnectWeb3()` function.

### Session Capabilities
Session signatures are used to grant access to specific resources on the Lit network. The resources you can request for your session can be found [here](https://v6-api-doc-lit-js-sdk.vercel.app/enums/types_src.LitAbility.html).

### Table
TBD

### Restricting Session Signatures
To restrict the usage of session signatures and define the length of their validity, you can use the `expiration` parameter. This parameter is a string that represents the ISO 8601 date and time when the session signature will expire. Having the session signatures expire in 10 minutes would look like:

```tsx
expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString()
```

