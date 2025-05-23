
# Communicating with Lit Nodes

This section explains how communications with Lit nodes are secured when performing signing, encryption, and private compute operations within Lit Actions.

## Secure Communication Channels
All interactions between users and Lit nodes are encrypted using SSL/TLS. This ensures that data sent to the nodes — whether for signing, decryption, or executing a Lit Actions — is protected from interception or tampering during transmission. Each node's SSL certificate is stored within its Trusted Execution Environment (TEE), making it computationally infeasible for node operators or external parties to access or manipulate them.

When you send a request — either performing signing, decryption, or executing a Lit Action — it is:

* Encrypted in transit: Secured by SSL/TLS until it reaches the node.
* Decrypted only inside the TEE: Processed in its clear form within the TEE, where hardware-enforced security prevents access by node operators or others.

## Node-to-Node Communication
When Lit nodes communicate with one another to execute user requests, these node-to-node communications are also secured using SSL.

Before communicating with one another, the nodes perform a handshake process to verify:

* Staking verification: Confirms the node is staking the requisite protocol tokens.
* Attestation check: Ensures the node is running untampered, correct code within its TEE.
* Network membership: Validates the node is part of the active node operator set.

Only after successful verification do nodes transmit data, ensuring sensitive information is never exposed to untrusted or compromised nodes.

## Are Requests Publicly Visible?
A common question is whether requests sent to the Lit network, including sensitive data, are publicly visible or retrievable. The answer is **no**:

* Encrypted transmission: All requests are encrypted via SSL/TLS, preventing interception.
* Secure processing: Data is only decrypted and processed inside the TEE, never stored or logged in clear text outside it.
* No public broadcast: Requests are not broadcast in a way that makes them fetchable by anyone. Nodes only share data with other verified nodes via secure channels.

This holds true for all network operations, including signing, decryption, and Lit Action execution. It means that neither node operators nor any external parties can see or access the contents of any request. This includes any sensitive data passed into the `jsParams` of [Lit Actions](../sdk/serverless-signing/overview.md), such as environment variables like API or private keys.

## Complete Request Lifecycle
The following is the complete request lifecycle when communicating with the Lit nodes:

1. A user sends a request to N nodes, where N must be at or above the threshold (> two-thirds of the network), with their associated [authentication material](../sdk/authentication/session-sigs/intro.md).

2. Each node independently verifies the user's auth material, ensuring they are authorized to perform a given operation. After the verification check is complete, they each run the requested operation (signing, decryption, or Lit Action execution.)

3. In the case of interactive requests — such as ECDSA signing with [Programmable Key Pairs](../user-wallets/pkps/overview.md) — the nodes communicate with one another to complete those operations as needed.

4. All operations are driven by the user - a node can not ask another node to sign or participate unless the user has also asked the other node to perform the same operation. This means that a matching "pending request" from the requesting user must be present on **all** nodes participating in interactive operations.

## Active Nodes
The following node operators are active on the [Datil Mainnet Beta](../connecting-to-a-lit-network/mainnets.md):
- Hypha Co-Op
- Cheqd
- Imperator
- 01nodes
- Zerion
- Thunderhead
- HireNodes
- CMT Digital
- Lit Protocol (managed by the Lit Protocol development company)

Interested in running a node? [Get in touch](https://forms.gle/n4WKtsyxaduEz8dDA). 
