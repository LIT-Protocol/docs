---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Glossary

## Definitions of commonly used terms and core concepts.

### **[Auth Sig](../sdk/authentication/overview.md)**

In order to use Lit Protocol, you must present a wallet signature obtained from the user. This is referred to as an 'AuthSig' in the documentation.

### **[Boneh-Lynn-Shacham (BLS) Signatures](https://medium.com/cryptoadvance/bls-signatures-better-than-schnorr-5a7fe30ea716)**

A cryptographic algorithm that can be used for both signing and encryption. BLS allows for signature aggregation and verification at scale using [Elliptic Curve cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography).

Ethereum uses the BLS signature scheme to facilitate secure cryptography within the protocol. This method allows validators to sign messages, and these resulting signatures are then aggregated and verified at scale. This enables a Proof-of-Stake system with a large number of validators to function efficiently in production.

### **[Challenge](https://en.wikipedia.org/wiki/Challenge-response_authentication)**

A (cryptographic) challenge is a piece of data that is used in challenge-response authentication schemes for a verifier to independently assert the authenticity of another entity. Unique and random challenges are used to prevent against replay attacks.

### **[Decentralized Access Control](../sdk/access-control/intro.md)**

Lit’s decentralized access control protocol allows you to encrypt information behind [on-chain conditions](../sdk/access-control/intro.md), allowing you to securely store data on the open web.

### **Digital Signature**

In cryptography, a digital signature proves that a user controls the private key associated with a particular public address. This is commonly used in the context of *authorization*. Apps can use this signature to verify a user has control over the wallet address, and provide authentication to do both web3 and arbitrary, non-web3 actions. For example, changing a profile on OpenSea requires signing in order to confirm the association between the profile owner and the wallet associated with it.

In working with the Lit network, someone will sign with their wallet when they want to mint a PKP. That is a transaction signature — where someone is sending a transaction (minting). This signature is then used as the method of authentication over the PKP and associated Lit Actions.

### **Distributed Key Generation**

A cryptographic process in which key generation requires participation from above a certain threshold of nodes, where each node only holds a **share** of the complete keypair.

### **[Elliptic Curve Digital Signature Algorithm (ECDSA)](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/)**

ECDSA is a cryptographically secure digital signature scheme, based on elliptic-curve cryptography. ECDSA is mainly used for digital signatures. A digital signature is an authentication method used where a public key pair and a digital certificate are used as a signature to verify the identity of a recipient or sender of information.

### **[Encryption](../intro/what-is-lit-protocol.md)**

The process of encoding data so that it remains hidden or inaccessible to unauthorized parties, the core technology that enables privacy on the Internet. At a high level, encryption converts plaintext (i.e “this is a secret”) into “nonsense” ciphertext (”e5sVVb#bn332J”). You can read a more in-depth explanation [here](https://www.cloudflare.com/learning/ssl/what-is-encryption/).

### **[Ethereum Virtual Machine (EVM)](../sdk/access-control/evm/basic-examples.md)**

A stack-based virtual machine that executes [bytecode](https://ethereum.org/en/glossary/#bytecode). In Ethereum, the execution model specifies how the system state is altered given a series of bytecode instructions and a small tuple of environmental data. This is specified through a formal model of a virtual state machine.

### **[Externally Owned Account (EOA)](https://ethereum.org/en/developers/docs/accounts/)**

Externally owned accounts (EOAs) are accounts that are controlled by [private keys](https://ethereum.org/en/glossary/#private-key), typically generated using a [seed phrase](https://ethereum.org/en/glossary/#hd-wallet-seed). Unlike smart contracts, externally owned accounts are accounts without any code associated with them. Typically these accounts are managed with a [wallet](https://ethereum.org/en/glossary/#wallet).

### **Key Re-Share**

Re-share the private key shares to add a node to the network. The shares before and after the re-share are compatible.

### **Lit Actions**

Immutable Javascript functions stored on IPFS that can use PKPs for programmatic signing and decryption. They can be thought of as Lit’s native version of smart contracts.

### **[Multi-Party Computation (MPC)](https://eprint.iacr.org/2020/300.pdf)**

In a general sense, MPC enables multiple parties – each holding their own private data – to evaluate a computation without ever revealing any of the private data held by each party (or any otherwise related secret information).

### **Nonce**

In cryptography, a value that can only be used once. An account nonce is a transaction counter in each account, which is used to prevent replay attacks.

### **[Oracle](https://cointelegraph.com/blockchain-for-beginners/what-is-a-blockchain-oracle-and-how-does-it-work)**

An oracle is a bridge between the [blockchain](https://ethereum.org/en/glossary/#blockchain) and the real world, querying data from off-chain [APIs](https://ethereum.org/en/glossary/#api) for use in [smart contracts](https://ethereum.org/en/glossary/#smart-contract).

### **Private Key Share**

A share of a private key that can be used to decrypt and sign. Decryption creates “decryption shares” and signing creates “signature shares”. These resultant shares are combined above the threshold to produce the decrypted content or signature.

### **[Proactive Secret Sharing](https://www.youtube.com/watch?v=iOqU2DySmeU&t=594s)**

Keep the same overall private key, but change the private key shares, such that private key shares after the PSS operation are incompatible with shares from before the operation. We use PSS for adding and removing nodes from the network during an epoch transition, such that private key shares from the previous epoch are incompatible with private key shares in the next epoch.

### **Programmable Key Pairs (PKPs)**

An ECDSA keypair generated collectively by the Lit nodes. PKPs can be used to read and write data across blockchains (EVM, Cosmos, BTC), storage networks (IPFS, Ceramic), and HTTP endpoints.

### **Proof**

A proof is a particular application for a digital signature. For example, using a signature to *prove* that a particular interaction took place. Signing through Lit Actions opens up the possibilities of verifying information from external sources, such as from a Weather API. Within the Lit ecosystem this signed information is called a proof.

### **Public Key Cryptography**

The technology that underpins cryptocurrency and most of the security infrastructure on the web today. It allows you to do two main things:

1. Encrypt information so that it can only be accessed by authorized parties.
2. Sign (write) data to blockchains, databases, storage networks, and other state machines (digital signatures).

### **[Rate Limiting](https://explorer.litprotocol.com/rlis)**

By default, each Lit Action execution comes with a "free plan" that allows you to execute a limited number of requests/millisecond on the Lit nodes. To lift this limitation, you can "upgrade" your plan by minting a new [Capacity Credit](../sdk/capacity-credits) which has two customizable factors, the number of requests/millisecond and the expiry date.

### **[Session Keys](../sdk/authentication/session-sigs/intro.md)**

When the user “signs into” Lit, we generate a random session key for them. They sign that session pubkey as the “URI” of a SIWE message which creates a capability signature. There is a default expiration time of 24 hours, but this is configurable. This signature and the session key are stored in the localstorage of the browser.

When the user sends a request, the session key signs it and sends the signature with the request. The capability signature is also sent. Multiple capability signatures can be attached. Therefore, the AuthSig presented to the nodes is actually the session key AuthSig with the capability signatures attached. The SDK will use the session key to scope the AuthSig for each request to the specific resource and node being addressed, preventing replay attacks.

### **[SIWE](../sdk/authentication/auth-sig.md)**

Sign-In with Ethereum (SIWE) allows users to sign into off-chain platforms using their Ethereum wallet as a method of authentication. Lit supports the use of EIP-4631 compliant SIWE messages as a method of auth when communicating with the Lit nodes.

### **[Threshold Cryptography](../resources/how-it-works.md)**

A subfield of cryptography, where cryptographic processes -- such as key generation -- get distributed among a set of nodes.

### **[Webhooks](../tools/event-listener.md)**

Webhooks are one way that apps can send automated messages or information to other apps. Generally, it is user defined behavior executing when a predefined condition is met.

### **[Zero-Knowledge Proof (ZKP)](https://ethereum.org/en/zero-knowledge-proofs/)**

A zero-knowledge proof is a cryptographic method that allows an individual to prove that an arbitrary statement is true without requiring that they disclose any of the underlying data that the proof was generated against.

A trivial example would be proving that you are over the age of 18, without actually disclosing your birthday or any PII.

<FeedbackComponent/>
