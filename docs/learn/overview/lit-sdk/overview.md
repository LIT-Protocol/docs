import FeedbackComponent from "@site/src/pages/feedback.md";

# Lit JavaScript SDK Overview

The [Lit JS SDK](https://github.com/LIT-Protocol/js-sdk) provides a modular and easy-to-use framework for integrating Lit Protocol's decentralized key management, encryption, compute functionalities, and more into your JavaScript or TypeScript applications.

The SDK is organized into several packages, each designed for specific functionalities. Below is an organized overview of some of the packages you're most likely to get started with.

## Core Packages

### Lit Node Client

The [@lit-protocol/lit-node-client](https://www.npmjs.com/package/@lit-protocol/lit-node-client) package is the primary client for interacting with the Lit Node API. It allows you to perform various operations such as:

- **Creating a Session**: Authenticate with the Lit Network using [Session Signatures](../../authentication/session-sigs.md).
- **Creating and Executing Lit Actions**: Write and run [Lit Actions](../../lit-actions/lit-actions-overview.md), which are serverless functions executed across the Lit Network.
- **Encrypting Data**: Securely encrypt and decrypt strings and files using Lit's [encryption functions](../../encryption-access-control/encrypting-data-with-lit).

### Lit Contracts SDK

The [@lit-protocol/contracts-sdk](https://www.npmjs.com/package/@lit-protocol/contracts-sdk) package provides interfaces to interact with Lit Protocol's smart contracts on the blockchain. It allows you to:

- **Mint and Manage Programmable Key Pairs (PKPs)**: Generate and control PKPs for decentralized key management. See [PKPs](../../signing-data/pkps.md).
- **Mint and Manage Capacity Credits**: Handle [Capacity Credits](../../paying-for-lit/capacity-credits.md) for network usage and payments.

### Wrapped Keys SDK

The [@lit-protocol/wrapped-keys](https://www.npmjs.com/package/@lit-protocol/wrapped-keys) package offers helper functions to create and manage [Wrapped Keys](../../signing-data/wrapped-keys.md). This SDK allows you to both securely import your existing keys into the Lit Network, and generate new private keys for any blockchain to sign messages and transactions within a Lit node's Trusted Execution Environment (TEE).

## Authentication and Authorization

### Lit Auth Client

The [@lit-protocol/lit-auth-client](https://www.npmjs.com/package/@lit-protocol/lit-auth-client) package simplifies PKP authentication. It offers convenient methods for:

- **Social Logins**: Authenticate users using social platforms like Google or Twitter.
- **Ethereum Wallet Sign-ins**: Authenticate using Ethereum wallets like MetaMask.

### Auth Helpers

The [@lit-protocol/auth-helpers](https://www.npmjs.com/package/@lit-protocol/auth-helpers) package provides utility functions to facilitate [authentication](../../authentication/overview.md) with the Lit Network.

## Utility Packages

### Lit Constants

The [@lit-protocol/constants](https://www.npmjs.com/package/@lit-protocol/constants) package provides a collection of constants used across other Lit SDK packages. Some of the constants you're likely to use are:

- [LIT_NETWORK](https://v6-api-doc-lit-js-sdk.vercel.app/variables/constants_src.LIT_NETWORK.html): Provides the various Lit networks that you can connect a `LitNodeClient` to.
- [LIT_RPC](https://v6-api-doc-lit-js-sdk.vercel.app/variables/constants_src.LIT_RPC.html): Provides the RPC URLs for the various Lit blockchain networks.
- [LIT_CHAINS](https://v6-api-doc-lit-js-sdk.vercel.app/variables/constants_src.LIT_CHAINS.html): Provides a list of EVM chains that Lit supports.

### Lit Types

The [@lit-protocol/types](https://www.npmjs.com/package/@lit-protocol/types) package exports various TypeScript interfaces and types related to Lit Protocol, aiding in type safety and code completion.

## Additional Resources

- **API Reference**: Detailed documentation of all SDK functions and classes is available in the [API Reference](https://v6-api-doc-lit-js-sdk.vercel.app/index.html).
- **Quick Start Guides**: A walkthrough of getting started with Lit and sending your first request to the Lit Network is available [here](../../../build/getting-started/overview).

## Community and Support

- **Discord**: Join the developer community on [Discord](https://litgateway.com/discord) to ask questions and share your projects.
- **Telegram**: Connect with the community on [Telegram](https://t.me/+aa73FAF9Vp82ZjJh).
- **GitHub Issues**: Report bugs or request features by opening an issue in this [GitHub repository](https://github.com/LIT-Protocol/Issues-and-Reports).

<FeedbackComponent/>
