---
sidebar_position: 3
---

# State of the Network

## Jalapeno Mainnet - Default network

Right now, Lit Protocol is in an alpha mainnet state (the "Jalapeno Mainnet") and we are running all the nodes. It is unaudited and the nodes are not distributed yet. There are various security improvements to be made, and cryptoeconomic guarantees as a result of staking are not in place yet. Data is persistent and we plan to support this network in perpetuity. We are in the active process of decentralizing and working towards a decentralized mainnet release. The Jalapeno network is the default. You can also specify this network via the `litNetwork: "jalapeno"` option in your LitNodeClient config.

## Serrano Testnet

The Lit Actions and PKP network is in a testnet state. In this state, we have not implemented the ability to generate a new PKP, and a single PKP is shared by all Serrano Testnet users. We will soon lift this limitation and provide the ability to generate a new non-shared PKPs. 

The data on the Serrano Testnet is not persistent and may be erased at any time. Therefore, we do not recommend storing anything of value on the Serrano Testnet. You may use the Serrano testnet by installing the latest `serrano` tag of the lit-js-sdk and specifying `litNetwork: "serrano"` in your LitNodeClient config. You can find more info in the [Lit Actions](/coreConcepts/LitActionsAndPKPs/litActions.md) sections of the docs.
