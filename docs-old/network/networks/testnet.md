import FeedbackComponent from "@site/src/pages/feedback.md";

# Testnets

Test networks are designed for early-stage application development, for development and testing pre-production. Storing assets with real world value on these networks is highly discouraged and keys may be deleted. All test networks may be deprecated in the future. 

You can set your Lit Network in the [LitNodeClient config of the Lit SDK](../../connecting-to-a-lit-network/connecting), by passing the network name to the `litNetwork` parameter.

<div class="testnet-networks-table">

| Name | Description | Supported Algorithms | Supported Features | Status | SDK Version | Development status  | Contracts |
| ---- | ----------- | -------------------- | ------------------ | ------ | ----------- | -------------------- | --------- |
| Serrano | Centralized test network. Keys are persistent. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | [Live](https://serrano-status.litprotocol.com/) | V1, V2 | Deprecated.  Do not build new apps that use this network. | [serrano](https://github.com/LIT-Protocol/networks/tree/main/serrano) |
| Cayenne | Centralized test network. Keys are not persistent and will be deleted.  This network does not enforce payment and can be used for free, for testing. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Not Live | V4+ | Deprecated. Do not build new apps that use this network.| [cayenne](https://github.com/LIT-Protocol/networks/tree/main/cayenne) |
| Manzano | Decentralized test network. No persistency guarantees.  Mirrors Habanero code and configuration.  Payment is enforced. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Live | V4+ | Deprecated. Do not build new apps that use this network | [manzano](https://github.com/LIT-Protocol/networks/tree/main/manzano) 
| Datil-dev | Centralized test network. Keys are not persistent and will be deleted. This network does not enforce payment and can be used for free, for testing. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Live | V6+ | Good to use | [datil-dev](https://github.com/LIT-Protocol/networks/tree/main/datil-dev) |
 
</div>

<FeedbackComponent/>
