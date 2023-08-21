---
sidebar_position: 1
---

# Introduction

:::note

Lit Actions are still heavily in development and things may change. We're grateful for [feedback](https://forms.gle/4UJNRcQspZyvsTHt8) on how to improve the docs and examples!

To start developing with Lit Actions, check out examples [here](../LitActions/helloWorld). For an in-depth review of the functionality provided by the Lit Actions SDK, take a look at our [API docs](https://actions-docs.litprotocol.com/).

:::

## Quick Start

Ready to jump right in? Quickly learn how you can integrate Lit Actions into your own application:

1. Guide: [Hello World with Lit Actions](../LitActions/helloWorld)
2. Guide: [Using Lit Actions for Access Control](https://spark.litprotocol.com/using-lit-actions-for-access-control/)
3. Tool: [GetLit CLI](../LitActions/getlitCli)
4. Example Implementation: [Fetching Off-Chain Data in a Lit Action](../LitActions/workingWithActions/usingFetch)
5. Example Implementation: [Conditional Signing with Lit Actions](../LitActions/workingWithActions/conditionalSigning)

## Overview

Lit Actions are JavaScript programs that can be used to specify signing and authentication logic for [PKPs](../pkp/intro). When used in conjunction with PKPs, Lit Actions are functionally serverless functions with their own private key-pair. Together these tools can be used to write data to blockchains and other state machines.

Every Lit Action gets executed across Lit’s threshold cryptography network in parallel, meaning the result of each program is independently verified by each node. Once a threshold of nodes have verified the result (more than two-thirds of network participants), the signing or decryption logic defined therein can be executed.

A trivial example would be a Lit Action and associated PKP that checks if a number is prime, only returning a signature if the number is prime. Each node will execute the Lit Action with a submitted input and verify that it meets the required conditions. If it does, the node will provision an independent key share. Only after more than two-thirds of these shares have been collected can the complete signature be formed.

## Features

1. [Blockchain Agnostic](../resources/supportedChains#programmable-key-pairs): Lit Actions can be used to write data to blockchains using PKPs.
2. Immutable: Once a Lit Action has been published, it cannot be modified.
3. Atomicity: Using Mint/Grant/Burn, you can atomically link a PKP to an authorized set of Lit Actions. This method guarantees that a particular PKP can only ever be used to sign data from within the approved set.
4. Off-Chain Compatibility: Lit Actions can pull in data from [off-chain sources](../LitActions/workingWithActions/usingFetch) natively, without requiring the use of a third party oracle.


## Examples and Use Cases

1. [Generating a signed Ethereum transaction](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/signTxn.js)
2. [Assigning PKP Permissions](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/pkpPermissions.js)
3. [Automating verifiable credential issuance](https://spark.litprotocol.com/krebitxlitactions/) 
4. [Executing a trade on Uniswap](https://github.com/LIT-Protocol/lit-apps/blob/master/packages/lit-actions/src/to-be-converted/wip-swap.action.mjs?ref=spark.litprotocol.com)
5. [Fetching off-chain price data](https://spark.litprotocol.com/automated-portfolio-rebalancing-uniswap/#how-it-works)
