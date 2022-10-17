---
sidebar_position: 1
---

# Objectives

* To encrypt an input value **(NFT description)** using Lit SDK & minting an NFT using that value as one of its metadata.
* Upon fetching all the NFTs display their metadata (image & name) to all the users. But, display the encrypted metadata (NFT description) to **only** those users who have more than 0.1 MATIC in their wallet, using Lit SDK.

## Tech Stack

* Lit SDK- encrypting & decrypting the input description
* Hardhat- local Ethereum development environment
* Ethers.js- interacting with our deployed NFT smart contract
* Polygon Mumbai network- where we deploy our NFT smart contract
* Metamask- crypto wallet to connect to our DApp