---

slug: /learn/overview/how-it-works

---

import FeedbackComponent from "@site/src/pages/feedback.md";

# How Lit Protocol Works

Building upon the foundational concepts introduced in the [What is Lit Protocol](../what-is-lit) page, this section delves deeper into the technical architecture and components that make Lit Protocol function under the hood.

Lit Protocol combines advanced cryptography, confidential hardware, and peer-to-peer networking to provide a decentralized platform for key management and secure computation. Below, we explore the core components and mechanisms that enable these capabilities.

## The Lit Nodes

At the heart of Lit Protocol are the **Lit Nodes**, which are independently operated servers that collectively form the Lit Network. These nodes perform the computational and cryptographic operations necessary for the protocol's functionality.

### Trusted Execution Environments (TEEs)

Each Lit Node runs within a **Trusted Execution Environment (TEE)** provided by [AMD's SEV-SNP](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/solution-briefs/amd-secure-encrypted-virtualization-solution-brief.pdf) technology. TEEs offer a secure area within a computer's processor, ensuring that code and data loaded inside are protected. This allows for:

- **Confidentiality:** Data processed inside the TEE is encrypted and cannot be accessed by the node operator or any external entity.
- **Integrity:** The code running inside the TEE cannot be tampered with, ensuring that nodes execute the correct software.
- **Remote Attestation:** TEEs provide mechanisms for verifying that the code running within them is genuine and has not been altered.

By leveraging TEEs, Lit Protocol ensures that even though nodes are operated by independent parties, the computations they perform are secure and confidential.

### Threshold Cryptography and Distributed Key Generation (DKG)

Lit Protocol employs **Threshold Cryptography** to manage cryptographic keys in a decentralized manner. Here's how it works:

- [Distributed Key Generation (DKG)](https://docs.google.com/document/d/1eaSk6822d4B-bJtMiiGp4n9N4qZPnwWaEZOy-Xs8AK0/edit#heading=h.2q2y8wxw6nj8): Instead of a single entity generating a private key, the network collectively generates key pairs without any single node ever knowing the entire private key. Each node only ever has access to a **key share**, which is essentially a fragment of the overall private key.
- **Threshold Operations:** To perform cryptographic operations such as signing or decryption, a threshold number of nodes (two-thirds of the network) must collaborate. Each node uses its key share to produce a partial result which is then combined with the results from other nodes to produce the final signature/decryption key.

**Benefits of Threshold Cryptography:**

- **Security:** Even if some nodes are compromised, the private key remains secure as long as the threshold is not reached.
- **Decentralization:** Eliminates single points of failure and central authority control over private keys.
- **Fault Tolerance:** The network can continue functioning even if some nodes are offline or unresponsive.

### JavaScript Execution Environment with Deno

Each Lit Node contains a JavaScript execution environment powered by [Deno](https://deno.com/), a JavaScript runtime. This environment allows developers to write and deploy [Lit Actions](../../lit-actions/overview.md) which enable powerful and secure decentralized compute similar to, but more capable than, Ethereum smart contracts.

Coupled with the secure and private execution environment provided by TEEs, Lit Actions are immutable and private. Once deployed, Lit Actions cannot be tampered with, and only their execution and the data they consume remain in the confines of the TEE.

## The Lit Network

The Lit Network is a decentralized network composed of Lit Nodes operated by various participants, including integration partners, investors, and professional node operators. The network's design ensures robustness, security, and resistance to censorship.

### Node Operators and Staking

To maintain the network's integrity and incentivize proper behavior, node operators are required to:

- **Stake Tokens:** Operators must stake tokens (currently a test token while the Lit Protocol is in Mainnet Beta) to join the active set of nodes. Staking provides economic security and aligns incentives.
- **Maintain Compliance and Performance:** Nodes must run the approved software stack and meet hardware requirements, including the use of AMD SEV-SNP technology. Operators are expected to maintain high uptime and performance.
- **Follow Protocol Rules:** Operators must adhere to the protocol's consensus mechanisms and operational guidelines.

### Node Operator List

Current node operators include:

- **Lit Protocol (our node)**
- [Hypha](https://hypha.coop/)
- [Thunderhead](https://thunderhead.xyz/)
- [Terminal3](https://www.terminal3.io/)
- [Imperator](https://www.imperator.co/)
- [01node](https://01node.com/)
- [Cheqd](https://cheqd.io/)

Operators joining after launch:

- [HireNodes](https://hirenodes.io/)
- [ETHGlobal](https://ethglobal.com/)
- [Zerion](https://zerion.io/)

### The Lit Protocol Token

The Lit Protocol Token is the native utility token for the network and serves multiple functions:

- **Staking:** Node operators stake the token to secure their participation and align economic incentives.
- **Incentives and Rewards:** Operators receive the token as compensation for providing services and maintaining the network.
- **Payment for Services:** Developers use the token to pay for network services, such as executing Lit Actions, decryption operations, and signing data with [Programmable Key Pairs (PKPs)](../../signing-data/pkps.md).

:::info

**Note:** The Lit Protocol token **is not yet live**. Currently, a test token (tstLPX) is used during the Mainnet Beta phase. The official token will be released when the v1 network launches later this year. Subscribe to updates [here](https://spark.litprotocol.com/).

Developers can claim test tokens from the [verified faucet](https://chronicle-yellowstone-faucet.getlit.dev/).

:::

## How Lit Protocol Enables Secure and Private Operations

### Secure Key Management Without Custodians

Lit Protocol provides a decentralized alternative to traditional key management solutions, which often rely on centralized custodians or require users to manage their own private keys.

- **Non-Custodial Key Generation:** Users can have keys generated and managed securely without any single entity controlling the full private key.
- **Flexible Authentication Methods:** Lit allows for key generation using traditional Web2 authentication methods like social OAuth (e.g. Google, Facebook, X (Twitter)). This enables seamless user onboarding by leveraging familiar login mechanisms while maintaining decentralized key management.
- **Threshold Signatures:** Operations like signing and decryption require collaboration among multiple nodes, enhancing security.
- **Access Control Policies:** Developers can define complex [access control conditions](../../encryption-access-control/overview.md) based on various conditions, enabling fine-grained control over who can access certain data or perform specific actions.

### Confidential Computing with TEEs

The use of TEEs ensures that computations are performed securely and privately:

- **Data Privacy:** Sensitive data processed within a TEE remains confidential, as it cannot be accessed by external parties or the node operator.
- **Code Integrity:** The code executing within the TEE is protected from tampering, ensuring consistent and trustworthy operations.
- **Verification:** Clients can verify that nodes are running the correct code within a TEE through remote attestation mechanisms.

### Decentralized Compute with Lit Actions

Lit Actions enable powerful decentralized computation capabilities:

- **Serverless Execution:** Developers can deploy code without managing infrastructure, as the network handles execution.
- **Scalable and Efficient:** Lit Actions are executed across the network, providing scalability and redundancy.
- **Interoperability:** Ability to interact with multiple blockchains and external data sources, facilitating complex workflows.
- **Privacy-Preserving:** Computations are performed within TEEs, protecting sensitive logic and data.

<FeedbackComponent/>
