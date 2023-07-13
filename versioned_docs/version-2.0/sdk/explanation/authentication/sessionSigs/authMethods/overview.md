---
sidebar_position: 1
---

# Walletless Signatures

With Lit Protocol, you can seamlessly onboard users into web3 using familiar authentication flows like social login and passkeys. The Lit SDK simplifies the process of generating and presenting signatures derived from authentication methods that don't require users to have an existing web3 wallet. Currently, Lit Protocol supports the following non-wallet authentication methods:

- [Social Login (e.g., Google, Discord)](/SDK/Explanation/authentication/sessionSigs/authMethods/socialLogin)
- [WebAuthn](/SDK/Explanation/authentication/sessionSigs/authMethods/webAuthn)
- [Email / SMS](/SDK/Explanation/authentication/sessionSigs/authMethods/email-sms)

Support for one-time passcodes (OTPs) through email and SMS is coming soon.

By utilizing PKP authentication methods, you can build frictionless and secure experiences in the decentralized web without the complexities of private key management.

:::note

Generating `SessionSigs` using various authentication methods is still in active development, so things may change. To stay up-to-date, always use the latest version of the Lit SDK and connect to the `serrano` testnet.

:::