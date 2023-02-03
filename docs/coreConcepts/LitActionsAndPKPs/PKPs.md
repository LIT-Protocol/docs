---
sidebar_position: 3
---

# Programmable Key Pairs (PKPs)

:::note

PKPs are still heavily in development and things may change.

Need some Polygon Mumbai Tokens to mint a PKP? Fill out this form: https://forms.gle/hcvh7VbS83DokBSE9

**PKP Minting is live!**
Mint one here: https://explorer.litprotocol.com/mint-pkp

:::


## What are Programmable Key Pairs (PKPs)?

Each PKP is a valid ECDSA key-pair generated collectively by the Lit nodes through a process called Distributed Key Generation (DKG). This allows the Lit Nodes to generate a new public/private keypair where nobody knows the whole private key. Instead, each node only holds a share of the private key. These signature shares must be combined above the threshold (currently 2/3 of the nodes) to produce the final signature.

The catch is that only those with authorized access have the ability to combine these shares. Authorized access refers to the particular "auth method" used to generate the PKP in the first place, such as a wallet signature or oAuth token. More on this below.

## How do I create a PKP?

You can mint an NFT from our PKP contract on Polygon Mumbai [here](https://explorer.litprotocol.com/mint-pkp). This is an ERC-721 NFT and the owner of it is the root owner of the PKP. The NFT owner can grant the ability to use the PKP to sign and decrypt data to both other users (via their wallet address) and also to Lit Actions. They also have the ability to assign additional authentication methods, described below.

## Do I need a wallet in order to use a PKP?

Not necessarily! In order to sign with a PKP, you must present some form of authorization to the Lit nodes. We refer to this as an [auth sig](/sdk/explanation/LitActions/authHelpers) in the docs. This may be a user's wallet address, Google OAuth, Discord login, and more. 

By continuing to work to support additional methods of authorization for PKPs (such as SMS and Apple Passkey, among others), we hope to facilitate a more frictionless onboarding experience for non-crypto-natives and enable intuitive methods for social recovery and wallet abstraction. 

Check out this [proof of concept](https://spark.litprotocol.com/wallet-abstraction-with-google-oauth/) on how to mint a Programmable Key Pair and execute an on-chain transaction with nothing but a Google account, no private keys or seed phrases in sight!

## What blockchains do PKPs support?

Any blockchain or cryptographic system that utilizes [ECDSA](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) for digital signatures. This includes Ethereum and most EVM chains, Bitcoin, and Cosmos. View all supported chains [here.](/Support/supportedChains#programmable-key-pairs)

## What can I use PKPs for?

Each PKP is a valid ECDSA wallet, custodied collectively by the Lit nodes (AKA an [MPC wallet](https://medium.com/1kxnetwork/wallets-91c7c3457578)). This means you can use your PKP as a wallet when interacting with a [host of web3 applications](https://spark.litprotocol.com/connecting-lit-pkps-with-dapps/), using it to read and write data across Lit's supported blockchains.

You can also use a PKP as an asset "vault", sending a mix of BTC and ETH NFTs to it, and then selling them as a bundle by selling the NFT that controls the PKP on OpenSea. The buyer of that NFT would then have full permission to sign and decrypt data with the PKP, since they are now the owner of the controlling NFT. This means that the buyer could also withdraw the BTC and NFTs stored within, if desired.

This functionality is essentially securely trading a private key, which has been impossible until now. This also breaks soulbound NFTs, because now you can securely trade the underlying private key that owns the soulbound tokens.
