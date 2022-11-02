---
sidebar_position: 3
---

# Programmable Key Pairs (PKPs)

:::note

PKPs are still heavily in development and things may change.

Need some Polygon Mumbai Tokens to mint a PKP? Fill out this form: https://forms.gle/hcvh7VbS83DokBSE9

:::

**PKP Minting is live!**
Mint one here: https://explorer.litprotocol.com/mint-pkp

## What are Programmable Key Pairs (PKPs)?

Each PKP is generated collectively by the Lit Nodes through a process called Distributed Key Generation (DKG). This process permits the Lit Nodes to generate a new public/private keypair where nobody knows the whole private key. Each node has a share of a private key, and they can do everything with it that they could do with a traditional private key, like sign and decrypt data. Signing with a private key share produces a signature share. These signature shares must be combined above the threshold (currently 2/3 of the nodes) to produce the final signature.

## How do I create a PKP?

You can mint an NFT from our PKP contract on Polygon Mumbai [here](https://explorer.litprotocol.com/mint-pkp). This is an ERC-721 NFT and the owner of it is the root owner of the PKP. The NFT owner can grant the ability to use the PKP to sign and decrypt data to both other users (via their wallet address) and also to Lit Actions.

## Do I need a wallet in order to use a PKP?

Currently, a wallet is required in order to mint the underlying PKP NFT. This makes the wallet the sole controller of the underlying key pair. 

We are currently working on exploring other methods of authorization for PKPs, such as Apple Passkeys, Login with Google, Discord Auth, and more. This will facilitate a more frictionless onboarding experience for non-crypto-natives, as it enables methods for social recovery and wallet abstraction. 

## What blockchains do PKPs support?

Any blockchain or cryptographic system that utilizes [ECDSA](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) for digital signatures. This includes Ethereum and most EVM chains, Bitcoin, and Cosmos. View all supported chains [here.](/Support/supportedChains#programmable-key-pairs)

## What can I use PKPs for?

Since a PKP is a valid ECDSA wallet, you could send a mix of BTC and ETH NFTs to it, and then sell it as a bundle by selling the NFT that controls it on OpenSea. The buyer gets the ability to sign and decrypt data with the PKP, since they own the controlling NFT. The buyer could then withdraw the BTC and NFTs if desired.

This functionality is essentially securely trading a private key, which has been impossible until now. This also breaks soulbound NFTs, because now you can securely trade the underlying private key that owns the soulbound tokens.
