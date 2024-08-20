# Capacity Credits

Capacity Credits are a key component in paying for usage of the Lit network, specifically for operations that occur on the network itself. They allow you to reserve a specific amount of capacity (i.e. requests per second) on the network over a pre-defined period (e.g. one week).

There are two main types of payments in the Lit ecosystem:

1. **Capacity Credits:** Used for operations on the Lit network itself, such as:
    - Signing using a PKP
    - Decrypting data
    - Executing a Lit Action
2. **Lit Test Tokens:** Used for transactions on the [Chronicle Yellowstone](../connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone.md) rollup blockchain, such as minting Capacity Credits or interacting with smart contracts.

When making requests to the Lit network for operations like those listed above, you'll need to provide the token ID of an active Capacity Credit along with your request.

:::info
For an overview of what requests to the Lit network require payment, go [here](./overview.md#overview-of-what-requires-payment).
:::

Capacity Credits are NFT tokens on the Chronicle Yellowstone blockchain. They can be minted by making a transaction directly to the NFT contract or by using [the Lit Explorer](https://explorer.litprotocol.com/). To learn more about minting Capacity Credits, refer to these pages:

- [Minting via the NFT contract](./minting-capacity-credit/via-contract.md)
- [Minting via the Lit Explorer](./minting-capacity-credit/via-explorer.md)

After minting a Capacity Credit, you'll want to learn [how to delegate usage](./delegating-credit.md) of it to either your users or yourself via a Capacity Delegation Auth Sig.