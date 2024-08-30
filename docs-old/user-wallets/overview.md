import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# Introduction to User Wallets

<StateOfTheNetwork/>

:::info
Need some `testLPX` test tokens to mint a PKP on Chronicle? Use the faucet: https://chronicle-yellowstone-faucet.getlit.dev
:::

## Introduction

The Lit Protocol offers two novel ways of managing private keys with [Programmable Key Pairs (PKPs)](./pkps/overview.md) and [Wrapped Keys](./wrapped-keys/overview.md). Either of these methods can be used to provide users of your application with a seamless, secure, and non-custodial onboarding and asset management experience.

When used to build a wallet, both PKPs and Wrapped Keys can make onboarding into and interacting with web3 significantly simpler and more secure. You can hook up web2-style authentication (i.e. Google OAuth, Passkeys, etc) to these keys to abstract away the complexities of seed phrases and self-custody. Since both PKPs and Wrapped Keys leverage the decentralized Lit network, you don't have to worry about the inherent risks associated with key custodians, ensuring no one but your user can control their wallet and manage the assets within.

## PKPs vs. Wrapped Keys

Programmable Key Pairs (PKPs) and Wrapped Keys are both solutions offered by Lit for managing private keys, but they serve different purposes and have distinct characteristics.

PKPs are ECDSA public/private key pairs created by the Lit network using Distributed Key Generation (DKG). Each Lit node holds a share, and more than two-thirds of these shares must be collected to execute a given action (i.e. signing a transaction).

Wrapped Keys are private keys that are encrypted and stored using Lit's Wrapped Keys backend service. They can be initialized by [importing](./wrapped-keys/importing-key) or [storing](./wrapped-keys/storing-wrapped-key-metadata) an existing private key, or can be [generated](./wrapped-keys/generating-wrapped-key) within a Lit node's trusted execution environment (TEE), meaning the clear text private key never exists outside of a single Lit node's TEE.

### PKPs

- Generated and managed through Distributed Key Generation (DKG) across the Lit network
- Rely on threshold cryptography and Multi-Party Computation (MPC) for generation and usage
- Support specific cryptographic curves (e.g. `secp256k1` used by Ethereum)
- Keys never exist in full on any single node, reducing the risk of compromise
- Ideal for applications requiring high security on supported blockchains
- Can be controlled by [Lit Actions](../sdk/serverless-signing/overview.md), enabling advanced use cases and key management

#### Why Use Them

- **Enhanced Security:** PKPs leverage MPC and threshold cryptography, providing a higher level of security as the key is never fully reconstructed on a single node
- **Distributed Trust:** The key generation and management process is distributed across the network, reducing single points of failure

### Wrapped Keys

- Generated within a single Lit node's TEE, or imported from an existing private key
- Encrypted via the MPC Lit network, and stored within Lit's private Dynamo DB instance
- Support a wider range of cryptographic curves, enabling interaction with more blockchains
- Allow for private key import and export, providing flexibility for users with existing keys
- Fully decrypted within a single node's TEE when used
- Can be controlled by [Lit Actions](../sdk/serverless-signing/overview.md), enabling advanced use cases and key management

#### Why Use Them

- **Blockchain Compatibility:** Wrapped Keys support signing with curves not currently supported by PKPs, allowing interaction with a broader range of blockchains
- **Key Import/Export:** Users can import existing private keys or export keys for use in other systems, offering greater flexibility and interoperability
- **Legacy System Integration:** Wrapped Keys may be easier to integrate with existing systems that expect traditional private key management

### Security Considerations

While Wrapped Keys offer flexibility, they have different security characteristics compared to PKPs:

- Wrapped Keys are fully decrypted within a single node's TEE during use, relying on the security of the sealed TEE
- PKPs, in contrast, leverage the more robust security of the MPC network, never existing in full on any single node

In summary, PKPs offer a highly secure solution for supported blockchains, while Wrapped Keys provide greater flexibility and compatibility at the cost of a slightly different security model. The choice between them depends on the specific requirements of your application, the blockchains you need to interact with, and your security priorities.

## Resources and Examples

### PKPs

- [Overview](./pkps/overview.md)
- [Quick Start Guide](./pkps/quick-start.md)
- [Seed-Phraseless Onboarding](./pkps/minting/via-social.md)
- [Use a PKP as a Signer on a Smart Account](https://spark.litprotocol.com/account-abstraction-and-mpc/)
- [Working with Claimable Keys](./pkps/claimable-keys/intro.md)

### Wrapped Keys

- [Overview](./wrapped-keys/overview.md)
- [Generating a Wrapped Key](./wrapped-keys/generating-wrapped-key.md)
- [Importing an Existing Private Key](./wrapped-keys/importing-key.md)
- [Signing Transactions](./wrapped-keys/sign-transaction.md)

<FeedbackComponent/>
