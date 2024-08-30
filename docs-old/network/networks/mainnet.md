import FeedbackComponent from "@site/src/pages/feedback.md";

# Mainnet

## Overview

Main networks should be used by applications that are currently live in production, supporting the storage of live assets. Mainnet keys are persistent and will not be deleted. 

You can set your Lit Network in the [LitNodeClient config of the Lit SDK](../../sdk/installation.md), by passing the network name to the `litNetwork` parameter.

<div class="mainnet-networks-table">

| Name | Description | Supported Algorithms | Supported Features | Status | SDK Version | Development status | Contracts |
| ---- | ----------- | -------------------- | ------------------ | ------ | ----------- | -------------------- | --------------- |
| Jalapeno | Centralized alpha network. Persistent, keys will not be deleted. | BLS | Encryption | [Live](https://jalapeno-status.litprotocol.com/) | V1, V2 | Deprecated.  Do not build new apps that use this network. | n/a |
| Habanero | Decentralized mainnet. Persistent, keys will not be deleted. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions) | Live | V4+ | Deprecated.  Do not build new apps that use this network. | [habanero](https://github.com/LIT-Protocol/networks/tree/main/habanero) | 
Datil | Decentralized mainnet. Persistent, keys will not be deleted. | BLS, ECDSA | Encryption, User Wallets (PKPs), Serverless Signing (Lit Actions), Wrapped Keys | Live | V6+ | Good to use | [datil](https://github.com/LIT-Protocol/networks/tree/main/datil-prod) |

</div>


<FeedbackComponent/>
