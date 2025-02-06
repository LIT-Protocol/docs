# How to Configure LAW for Users

## Setup

This page will guide you through how you can configure Lit Agent Wallets (LAWs) for your users.

In this setup, we will be creating Agent Wallets, permissioning the tools, delegatees, policies, and transferring the underlying Programmable Key Pair (PKP) ownership of the Agent Wallet to the user.

### Adding Delegatees

As the developer, you will first need to add the delegatees to the Agent Wallet. These are the wallets, that once you have transferred ownership of the Agent Wallet, they will be able to execute intent on behalf of the user.

For more information on delegatees, please refer to the [delegatees docs](./delegatee/overview.md).

### Adding Tools

Next, you will need to add the tools that the Agent Wallet will be able to execute. This may be custom tools, or the tools requested by the user. 

For more information on tools, please refer to the [Admin tools docs](./admin/tools.md) and the [delegatee tool docs](./delegatee/tools.md).

### Adding Policies

Once adding the tools and delegatees, you can define policies for the tools and delegatees. Each delegatee has an individual policy for each tool, which means that some delegatees can have increased or decreased permissions compared to others.

For more information on policies, please refer to the [Admin policies docs](./admin/policies.md) and the [delegatee policies docs](./delegatee/policies.md).

### Transfer Ownership

Once the delegatees and tools have been added, you can transfer the ownership of the Agent Wallet to the user. For this, you will use the [transferPkpOwnership](./admin/overview.md#transferring-ownership-of-the-agent-wallet) method. This will send the PKP NFT to the user's wallet address, completely removing the developer's access to the Agent Wallet's Admin permissions.