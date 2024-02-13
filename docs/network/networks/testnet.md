# Testnet

Test networks are designed for early-stage application development, for development and testing pre-production. Storing assets with real world value on these networks is highly discouraged and keys may be deleted. All test networks may be deprecated in the future. 

When building on Lit, you'll need some tokens [for gas](../rollup.mdx) and to pay for network services. All Lit networks currently use a test token for payments and gas ('testLPX'). These tokens hold no real world value and should be used exclusively for developing apps that use and interact with the Lit network. Tokens should only be acquired from the verified [faucet](https://faucet.litprotocol.com/).

You can set your Lit Network in the [LitNodeClient config of the Lit SDK](../../sdk/installation.md), by passing the network name to the `litNetwork` parameter.


| Name | Description | Supported Algorithms | Supported Features | Status | SDK Version | Deprecation timeline | Contracts |
| ---- | ----------- | -------------------- | ------------------ | ------ | ----------- | -------------------- | --------- |
| Serrano | Centralized test network. Keys are persistent. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | [Live](https://serrano-status.litprotocol.com/) | V1, V2 | ~ July 2024 | [serrano](https://github.com/LIT-Protocol/networks/tree/main/serrano) |
| Cayenne | Centralized test network. Keys are not persistent and will be deleted. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | [Live](https://cayenne-status.litprotocol.com/) | V3 | TBD | [cayenne](https://github.com/LIT-Protocol/networks/tree/main/cayenne) |
| Manzano | Decentralized test network. No persistency guarantees. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Coming Soon | V3 | TBD | [manzano](https://github.com/LIT-Protocol/networks/tree/main/manzano) |