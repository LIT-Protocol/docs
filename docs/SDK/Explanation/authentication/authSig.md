---
sidebar_position: 2
---

# Auth Signatures

An `AuthSig` is a cryptographic signature that validates the ownership of a specific public key.

## Format of an `AuthSig`

You can use any signature compliant with EIP-4361, also known as Sign in with Ethereum (SIWE), for the `AuthSig`. However, the signature must be presented in an `AuthSig` object formatted like so:

```json
{
	"sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
	"derivedVia": "web3.eth.personal.sign",
	"signedMessage": "localhost wants you to sign in with your Ethereum account:\n0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a\n\nThis is a test statement.  You can put anything you want here.\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gzdlw7mR57zMcGFzz\nIssued At: 2022-04-15T22:58:44.754Z",
	"address": "0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a"
}
```

In the `AuthSig` data structure:

- `sig` is the signature produced by signing the `signedMessage`
- `derivedVia` is the method used to derive the signature (e.g., "web3.eth.personal.sign")
- `signedMessage` is the original message that was signed
- `address` is the public key address that was used to create the signature

You can refer to the `AuthSig` type definition in the [Lit JS SDK V2](https://js-sdk.litprotocol.com/interfaces/auth_browser_src.authsig.html).

## Obtaining an `AuthSig`

There are various authentication methods to obtain an `AuthSig`:

- Externally-Owned Account
- Smart Contract
- Social Login (e.g, Google, Discord)
- WebAuthn

The next sections will cover each of these methods and showcase how to use the Lit SDK to build these authentication flows.