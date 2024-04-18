# Testnet



:::info
[Manzano Testnet](testnet) is now live. Check out the [docs on migration](../migration-guide) to learn how you can start building on Manzano today. 
:::

Test networks are designed for early-stage application development, for development and testing pre-production. Storing assets with real world value on these networks is highly discouraged and keys may be deleted. All test networks may be deprecated in the future. 

When building on Lit, you'll need some tokens [for gas](../rollup.mdx) and to pay for network services. All Lit networks currently use a test token for payments and gas ('testLPX'). These tokens hold no real world value and should be used exclusively for developing apps that use and interact with the Lit network. Tokens should only be acquired from the verified [faucet](https://faucet.litprotocol.com/).

You can set your Lit Network in the [LitNodeClient config of the Lit SDK](../../sdk/installation.md), by passing the network name to the `litNetwork` parameter.

<div class="testnet-networks-table">

| Name | Description | Supported Algorithms | Supported Features | Status | SDK Version | Development status  | Contracts |
| ---- | ----------- | -------------------- | ------------------ | ------ | ----------- | -------------------- | --------- |
| Serrano | Centralized test network. Keys are persistent. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | [Live](https://serrano-status.litprotocol.com/) | V1, V2 | Deprecated.  Do not build new apps that use this network. | [serrano](https://github.com/LIT-Protocol/networks/tree/main/serrano) |
| Cayenne | Centralized test network. Keys are not persistent and will be deleted.  This network does not enforce payment and can be used for free, for testing. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | [Live](https://cayenne-status.litprotocol.com/) | V4+ | Good to use | [cayenne](https://github.com/LIT-Protocol/networks/tree/main/cayenne) |
| Manzano | Decentralized test network. No persistency guarantees.  Mirrors Habanero code and configuration.  Payment is enforced. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Live | V4+ | Good to use | [manzano](https://github.com/LIT-Protocol/networks/tree/main/manzano) |
 
</div>

## Token Usage
If you'd like to use Manzano, you'll need some 'testLPX' tokens to pay for network fees and [gas](../rollup.mdx) when minting PKPs. Manzano uses a test token for payments and gas that holds no real world value. You can acquire some tokens from the verified [faucet](https://faucet.litprotocol.com/).