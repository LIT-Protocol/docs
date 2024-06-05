---
sidebar_position: 1
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Walletless Signatures

With Lit Protocol, you can seamlessly onboard users into web3 using familiar authentication flows like social login and passkeys. The Lit SDK simplifies the process of generating and presenting signatures derived from authentication methods that don't require users to have an existing web3 wallet. Currently, Lit Protocol supports the following non-wallet authentication methods:

- [Social Login (e.g., Google, Discord)](../../wallets/auth-methods/lit-auth-methods/social-login)
- [WebAuthn](../../wallets/auth-methods/lit-auth-methods/web-authn)
- [Email / SMS](../../wallets/auth-methods/lit-auth-methods/email-sms)

:::info
Support for one-time passcodes (OTPs) through email and SMS is now live!
:::

By utilizing PKP authentication methods, you can build frictionless and secure experiences in the decentralized web without the complexities of private key management and without trusting a centralized custodian with your data.
<FeedbackComponent/>
