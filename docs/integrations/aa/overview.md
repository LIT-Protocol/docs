# Smart Contract Accounts

Learn how to use Lit Protocol with account abstraction providers to streamline how you use web3 wallets!

---

import FeedbackComponent from "@site/src/pages/feedback.md";

## Objectives
At completion of this reading you should be able to:

- Define use cases for Lit with smart contract accounts.
- Understand how to build Lit with an account abstraction (AA) provider.

---

## What is Account Abstraction?
Account abstraction references EIP-4337. AA shifts the validation of transactions from the Ethereum protocol to the smart contract level with a specific entry point. With it are abstractions for a user's account, standardized smart contract account interfaces, and gas abstraction. This is possible by separating the transaction's signature from the account address, allowing for possibilities like switching between different accounts in a single transaction.

EIP-4337 sets a standard interface for everyone to work with when creating smart contract accounts.

How AA enhances user experience:

1. Programmed security - The requirement of additional confirmations in the event of fraud detection such as two-factor authentication, additional signing with a web3 wallet, or confirmation through another smart contract.

2. Social Recovery - In [Why we need wide adoption of social recovery wallets](https://vitalik.eth.limo/general/2021/01/11/recovery.html) by Vitalik Buterin, he writes that a good wallet design needs to satisfy three key criteria: no single point of failure, low mental overhead, and maximum ease of transacting. Social recovery with AA can look like a multi-signature transaction to approve changing a signing key if an account has been compromised or lost.


## How to use Lit with Account Abstraction (AA)
1. Adding a Programmable Key Pair (PKP) as a signer to an AA wallet.

2. User Onboarding - creating a smart contract account for someone new to web3. The signer can start as an multi party computation (MPC) key authorized through a web2 account.

3. AA wallet authorization for a PKP - smart contract accounts with signing capabilities through PKPs.

4. Non-ECDSA AA wallet with a PKP wallet - allowing freedom of signature verification scheme.

5. Conditional gas payments - PKP wallet pays for gas fees when certain conditions are met.

## Account Abstraction Providers
Rather than dealing with private keys, seed phrases, and complex wallet setups, users can leverage abstraction layers to interact seamlessly with Web3 services. 

AA providers like Alchemy, Biconomy, and Pimlico are pioneering smart account technologies to abstract away blockchain complexities. Their solutions enable intuitive user experiences via features like social recovery, meta-transactions, relayer networks, and identity management. By handling cumbersome blockchain intricacies behind the scenes, account abstraction paves the way for mainstream adoption.


![AA chart with providers and offerings](/img/aa_provider_table.webp)

**Chart made by Prez Thomas in the piece ["Top 6 Account Abstraction Providers: An In-Depth Review"](https://medium.com/coinmonks/top-6-account-abstraction-providers-an-in-depth-review-3a09b9fc707c), Sept 13, 2023**

## Smart Contract Account Integrations

| Provider | Description | Link to Guide |
| --- | --- | --- |
| [Account Kit by Alchemy](https://accountkit.alchemy.com/) | Combining Lit Protocol's pkp wallet with Account Kit allows you to use your Programmable Key Pairs (PKPs) as a smart account for your users. | [guide](./alchemy-account-kit.md) |
| [Pimlico](https://www.pimlico.io/) | This how-to guide will walk you through the steps to integrate Lit Protocol's OTP sign-in with email, SMS, and Whatsapp with a smart account whose user operations are relayed and sponsored by Pimlico. | [guide](./pimlico.md) | 
| [Candide Account Abstraction](https://www.candide.dev/) | This guide will walk you through the steps to integrate Lit Protocol's Google OAuth to mint a Programmable Key Pair (PKP) and use it to enable an email/social recovery flow with Candide's account abstraction provider. | [guide](./candide.md)
| - | If you are an AA provider, reach out to the Lit development team to be included! | [Reach out to the team](https://docs.google.com/forms/d/e/1FAIpQLScBVsg-NhdMIC1H1mozh2zaVX0V4WtmEPSPrtmqVtnj_3qqNw/viewform) |


<FeedbackComponent/>
