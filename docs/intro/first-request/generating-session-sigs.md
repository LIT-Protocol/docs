# Generating Session Signatures

Before you can interact with the Lit network and start sending requests, you need to start a session using Session Signatures. This guide will walk you through creating your first session using the Lit SDK.

:::info
For a dedicated guide on Session Signatures, please see the detailed explanation [here](../../sdk/authentication/session-sigs/intro).
:::

## What is a Session?

A Session is like a temporary pass that allows you to interact with the Lit network securely. It's a way to prove your identity and prove that you have the permissions to perform actions on the network, without having to sign every request with your private key.

When you initiate a session by making a request to the Lit network using the Lit SDK, the SDK generates a Session Keypair, which consists of a public key and a private key:

- **Session Private Key**: This key is kept secure and is used to sign your requests to the Lit network.
- **Session Public Key**: This key is shared with the Lit network to establish your session.

## How Session Signatures Are Generated

Session Signatures are generated by the Lit nodes and they are a result of each node attesting to the fact that you have the permissions to perform actions with the requested resources on the Lit network.

Here's an overview of how they're generated:

1. **Session Keypair Generation**: You initiate a session by sending a request to the Lit network through the Lit SDK.
2. **Authentication**: The Lit nodes receive your request and first authenticate your identity—confirming that you are who you claim to be.
3. **Authorization**: The nodes then authorize you by checking if you have the necessary permissions to access the requested Lit resources and perform the desired actions with those resources.
4. **Generating the Session Signature**: Once your identity is verified and you’re authorized, the Lit nodes sign the session public key. This signed public key is the Session Signature.
5. **Using the Session Signature**: The Lit SDK collects these Session Signatures and packages them into an object. You attach this object to any subsequent requests you make to the Lit network. This Session Signatures object serves as proof that you are authorized to make your requests.

## Requesting Session Signatures

The Lit SDK has multiple methods for generating Session Signatures:

- [`getSessionSigs`](../../sdk/authentication/session-sigs/get-session-sigs)
    - This function is the simplest way to get Session Signatures, at the minimum only requiring an Ethereum wallet and the `LitNodeClient`. It will enable specific capabilities for your session keypair using the resources you specify in the `AuthSig`.
- [`getPkpSessionSigs`](../../sdk/authentication/session-sigs/get-pkp-session-sigs)
    - This function uses the [signSessionKey](https://v7-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#signSessionKey) function to sign the session public key using the PKP, which will generate an `AuthSig`. Once the `AuthSig` has been created, it is then signed by the session keypair. Signing the `AuthSig` with the session keypair creates the Session Signatures.
- [`getLitActionSessionSigs`](../../sdk/authentication/session-sigs/get-lit-action-session-sigs)
    - This function is the same as `getPkpSessionSigs`, but executes the given Lit Action to determine authorization.

The best method to use depends on your use case.

### Storing Session Signatures

#### Node.js

If you're using Node.js, the Session Signatures will be stored wherever the [storageProvider](https://v7-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.LitNodeClientConfig.html#storageProvider) is configured to store them. If no `storageProvider` is provided, the Session Signatures will not be stored.

#### Browser

If you're executing within a browser environment, the Session Signatures will be stored in the browser's local storage. To clear the cached Session Keypair, you can use the `disconnectWeb3` function (imported from the `@lit-protocol/auth-browser` package) as covered [here](./connecting-to-lit#browser-environment).

### Session Capabilities

Session Signatures are used to grant access to specific resources on the Lit network. The resources you can request for your session can be found [here](https://v7-api-doc-lit-js-sdk.vercel.app/variables/constants_src.LIT_ABILITY.html).

### Table

| Resource                        | Requires Session Signatures |
| ------------------------------- | --------------------------- |
| Lit Action Execution            | ✅                           |
| Minting a PKP                   | ❌                           |
| PKP Signing                     | ✅                           |
| Encryption Access Control       | ❌                           |
| Decryption Access Control       | ✅                           |
| Signing Access Control          | ✅                           |
| Capacity Credits Authentication | ✅                           |

### Restricting Session Signatures

To restrict the usage of Session Signatures and define the length of their validity, you can use the `expiration` parameter. This parameter is a string that represents the ISO 8601 date and time when the Session Signatures will expire. Having the Session Signatures expire in 10 minutes would look like:

```tsx
expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString()
```
