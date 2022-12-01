---
sidebar_position: 2
---

# Glossary

## Definitions of commonly used terms and core concepts.

### **[Decentralized Access Control](/coreConcepts/accessControl/intro)**
Lit’s decentralized access control protocol allows you to encrypt information behind [on-chain conditions](https://developer.litprotocol.com/coreConcepts/accessControl/intro), allowing you to securely store data on the open web.
### **[Digital Signature](/coreConcepts/LitActionsAndPKPs/litActions#signing)**
In cryptography, a digital signature proves that a user controls the private key associated with a particular public address. This is commonly used in the context of *authorization*. Apps can use this signature to verify a user has control over the digital identity provided by the address, and provide authentication to do both web3 and arbitrary, non-web3 actions. For example, changing a profile on OpenSea requires signing in order to confirm the association between the profile owner the the wallet associated with it.

In working with the Lit network, someone will sign with their wallet when they want to mint a PKP. That is a transaction signature — where someone is sending a transaction (minting). This signature is then used as the method of authentication over the PKP and associated Lit Actions.
### **Distributed Key Generation**
A cryptographic process in which key generation requires participation from above a certain threshold of nodes, where each node only holds a ******share****** of the complete keypair.
### **[Encryption](/SDK/Explanation/encryption)**
The process of encoding data so that it remains hidden or inaccessible to unauthorized parties, the core technology that enables privacy on the Internet. At a high level, encryption converts plaintext (i.e “this is a secret”) into “nonsense” ciphertext (”e5sVVb#bn332J”). You can read a more in-depth explanation [here](https://www.cloudflare.com/learning/ssl/what-is-encryption/).
### **[Lit Actions](/coreConcepts/LitActionsAndPKPs/litActions#what-are-lit-actions)**
Immutable Javascript functions stored on IPFS that can use PKPs for programmatic signing and decryption. They can be thought of as Lit’s native version of smart contracts.
### **[Programmable Key Pairs (PKPs)](/coreConcepts/LitActionsAndPKPs/PKPs#what-are-programmable-key-pairs-pkps)**
An ECDSA keypair generated collectively by the Lit nodes. PKPs can be used to read and write data across blockchains (EVM, Cosmos, BTC), storage networks (IPFS, Ceramic), and HTTP endpoints.
### **[Proof](/coreConcepts/LitActionsAndPKPs/litActions#proofs)**
A proof is a particular application for a digitial signature. For example, using a signature to *prove* that a particular interaction took place. Signing through Lit Actions opens up the possibilities of verifying information from external sources, such as from a Weather API. Within the Lit ecosystem this signed information is called a proof.
### **[Public Key Cryptography](/Introduction/whatIsLitProtocol#decentralized-cryptography)**
The technology that underpins cryptocurrency and most of the security infrastructure on the web today. It allows you to do two main things:

1. Encrypt information so that it can only be accessed by authorized parties.
2. Sign (write) data to blockchains, databases, storage networks, and other state machines (digital signatures).
### **[Threshold Cryptography](/Introduction/howItWorks#threshold-cryptography)**
A subfield of cryptography, where cryptographic processes -- such as key generation -- get distributed among a set of nodes.
    