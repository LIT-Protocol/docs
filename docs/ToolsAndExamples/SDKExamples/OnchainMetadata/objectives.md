---
sidebar_position: 1
---

# Objectives

* To encrypt an input value **(NFT description)** using Lit SDK & minting an NFT using that value as one of its metadata.
* Upon fetching, the NFTs show their metadata (image & name) to all the users. But, show the decrypted metadata (NFT description) to **only** users with more than 0.1 MATIC in their wallet, using Lit SDK.

## Tech Stack

* Lit SDK- encrypting & decrypting the input description
* Hardhat- local Ethereum development environment
* Ethers.js- interacting with our deployed NFT smart contract
* Polygon Mumbai network- where we deploy our NFT smart contract
* Metamask- crypto wallet to connect to our DApp

## Project Replit

Below is the complete **React** project:
https://replit.com/@lit/Encrypt-and-Decrypt-On-chain-NFT-Metadata#encrypt_and_decrypt_on-chain_nft_metadata/src/App.js

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@lit/Encrypt-and-Decrypt-On-chain-NFT-Metadata#encrypt_and_decrypt_on-chain_nft_metadata/src/App.js"></iframe>