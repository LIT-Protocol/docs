# How to Configure Agent Wallets for Users

## Overview

This guide walks you through creating and configuring a Lit Agent Wallet (LAW) and then transferring ownership of the underlying [PKP (Programmable Key Pair)](../user-wallets/pkps/overview.md) NFT to an end user. By following these steps, you (as the developer) will:

1. Add [delegatees](./delegatee/overview.md) that can act on behalf of the user.
2. Define which [tools](./admin/tools.md) the wallet can use.
3. Configure [policies](./admin/policies.md) that control permissions for each delegatee-tool pair.
4. Transfer the ownership of the PKP so the user has full control.

Once ownership is transferred, you (the developer) no longer have administrative access to the wallet.

## Prerequisites

Before you begin, ensure you have:
- An understanding of [Agent Wallets](./intro.md)
- A basic understanding of PKPs
- The user's wallet address for the final transfer

## Step-by-Step Configuration

### 1. Add Delegatees

A *delegatee* is an address that can call or execute actions on behalf of the Agent Wallet.

1. Add a delegatee using the [addDelegatee](./admin/overview.md#adding-delegatees) method.
2. Once the Agent Wallet is transferred to the user, these delegatees can still act on the user’s behalf according to the tools and policies you configure (and which the user can later modify).

For more information, refer to the [delegatees docs](./delegatee/overview.md).

### 2. Add Tools

Tools define the actions or operations the Agent Wallet can perform. Examples include:
- Transferring tokens
- Interacting with specific smart contracts
- Executing custom logic

To make a tool available to the Agent Wallet, you will use the [permitToolForDelegatee](./admin/tools.md#permitting-tools) method.

For more information on tools, refer to:
- [Admin tools docs](./admin/tools.md)
- [Delegatee tools docs](./delegatee/tools.md)
- [Custom tools docs](./new-tool.md)

### 3. Add Policies

Policies determine how each delegatee can interact with each tool. For example, you may allow one delegatee to transfer only up to a certain amount of tokens, while another has unlimited transfer privileges.

1. First set a policy with the [setToolPolicyForDelegatee](./admin/policies.md#setting-tool-policies) method. This requires the IPFS CID of the policy, which will be generated and displayed in the console when you build the repository. See the guide on making a new tool [here](./new-tool.md) for more help.
2. Specify the constraints (e.g., spending limits, specific functions allowed, time-based restrictions, etc.) with the [setToolPolicyParametersForDelegatee](./admin/policies.md#setting-parameters) method.

For more information on policies, refer to:
- [Admin policies docs](./admin/policies.md)
- [Delegatee policies docs](./delegatee/policies.md)

### 4. Transfer Ownership

Once delegatees and tools are in place, and their policies are configured, you can transfer ownership of the Agent Wallet to the user.

1. Use the [transferPkpOwnership](./admin/overview.md#transferring-ownership-of-the-agent-wallet) method to send the PKP NFT to the user’s wallet address.
2. This action removes your administrative access and grants the user full control over the Agent Wallet, including the ability to manage delegatees, tools, and policies.

## Additional Resources

- For an introduction to Lit Agent Wallets, start with [this page](./intro.md).  
- To see the available API methods for Agent Wallets, visit the [API Docs](https://agent-wallet.vercel.app/index.html).
