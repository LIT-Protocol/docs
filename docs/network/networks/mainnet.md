import FeedbackComponent from "@site/src/pages/feedback.md";

# Mainnet

## Overview

:::info
**STATE OF THE NETWORK**

Lit V0, the Habanero Mainnet, is now live and available for teams building apps in production. Habanero supports [ID encrypt](../../sdk/access-control/encryption.md), [user wallets](../../sdk/wallets/intro.md), and [serverless signing](../../sdk/serverless-signing/overview.md). 
:::

Main networks should be used by applications that are currently live in production, supporting the storage of live assets. Mainnet keys are persistent and will not be deleted. 

You can set your Lit Network in the [LitNodeClient config of the Lit SDK](../../sdk/installation.md), by passing the network name to the `litNetwork` parameter.

<div class="testnet-networks-table">

| Name | Description | Supported Algorithms | Supported Features | Status | SDK Version | Development status | Contracts |
| ---- | ----------- | -------------------- | ------------------ | ------ | ----------- | -------------------- | --------------- |
| Jalapeno | Centralized alpha network. Persistent, keys will not be deleted. | BLS | Encryption | [Live](https://jalapeno-status.litprotocol.com/) | V1, V2 | Deprecated.  Do not build new apps that use this network. | n/a |
| Habanero | Decentralized mainnet. Persistent, keys will not be deleted. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Live | V4+ | Good to use | [habanero](https://github.com/LIT-Protocol/networks/tree/main/habanero) | 

</div>

## Token Usage
If you'd like to use Habanero, you'll need some 'testLPX' tokens to pay for network fees and [gas](../rollup.mdx) when minting PKPs. Habanero uses a test token for payments and gas that holds no real world value. You can acquire some tokens from the verified [faucet](https://faucet.litprotocol.com/).

## Migration
In order to connect to the Habanero mainnet network, you'll need to ensure your application is compatible with the v3 version of the Lit SDK. This means if you were previously building on Jalapeno or Serrano using the v2 SDK, you'll need to update your app to use v3. 

Upgrading to the v3 SDK can be done by following the [migration guide](../../sdk/migrations/3.0.0/overview.md), or checking out the related [blog post](https://spark.litprotocol.com/cayenne-network-release-lit-js-sdk-v3/) on Spark.

If your app currently has users in production (on the v1 or v2 SDK), we recommend upgrading internally while keeping users on the current branch until after Habanero is live and fully functional. Once you've upgraded to v3 and Habanero is stable, you’ll just need to perform the necessary migration tasks dependent on the Lit tooling that you’re using:
- If you’re using Lit for encryption (AKA decentralized access control): Perform re-encryption with Habanero keys.
- If you’re building with PKPs (AKA user wallets): Re-mint PKPs on Habanero with the same auth methods.

<FeedbackComponent/>
