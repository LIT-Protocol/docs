---
sidebar_position: 1
---
# Introduction
*Estimated time to complete: 1 hour*

* Encrypting on-chain meta-data (an **NFT description**) using the Lit SDK.
* Upon fetching, the NFTs show their metadata (image & name) to all the users. But, show the decrypted metadata (NFT description) to **only** users with more than 0.1 MATIC in their wallet, using the Lit SDK.

## Table of Contents

* [Setup the Project](/ToolsAndExamples/SDKExamples/OnchainMetadata/setup)
* [Encrypt & Decrypt](/ToolsAndExamples/SDKExamples/OnchainMetadata/encryptDecrypt)
* [NFT Smart Contract](/ToolsAndExamples/SDKExamples/OnchainMetadata/smartContract)
* [Lit SDK on the Frontend](/ToolsAndExamples/SDKExamples/OnchainMetadata/frontend)
* [Deploy to Polygon Mumbai network](/ToolsAndExamples/SDKExamples/OnchainMetadata/polygonMumbai)

## Tech Stack

* [Lit SDK](/SDK/intro) - encrypting & decrypting the input description
* [Hardhat](https://hardhat.org/) - local Ethereum development environment
* [Ethers.js](https://docs.ethers.io/v5/) - interacting with our deployed NFT smart contract
* [Polygon Mumbai network](https://faucet.polygon.technology/) - where we deploy our NFT smart contract
* [OpenZeppelin](https://www.openzeppelin.com/) - library for smart contracts for the Ethereum network
* [Metamask](https://metamask.io/) - crypto wallet to connect to our DApp

## Project Replit

Below is the complete [**React** project](
https://replit.com/@lit/Encrypt-and-Decrypt-On-chain-NFT-Metadata#encrypt_and_decrypt_on-chain_nft_metadata/src/App.js).

For the best experience please open the web app in a new tab.

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@lit/Encrypt-and-Decrypt-On-chain-NFT-Metadata#encrypt_and_decrypt_on-chain_nft_metadata/src/App.js"></iframe>