---
sidebar_position: 5
---

# Example Projects

## [IPFS x Lit](https://github.com/debbly/IPFS-lit)

This is a guide that walks through an application that stores an image on IPFS and encrypts/decrypts that image url using Lit.

## Cloudflare x Lit

- Use a Cloudflare worker to protect any URL with Lit Protocol: https://github.com/LIT-Protocol/cloudflare-litgate-js

- Use Lit Protocol to gate a video or livestream with Cloudflare: https://github.com/LIT-Protocol/lit-cloudflare-frontend and a corresponding tool to deploy a working cloudflare worker to your own cloudflare account: https://litgateway.com/apps/cloudflare

## Ceramic x Lit

- Lit protocol integration with Ceramic to store encrypted data on Ceramic: https://github.com/LIT-Protocol/CeramicIntegration and a corresponding example implementation of that integration: https://github.com/LIT-Protocol/CeramicIntegrationExample

https://github.com/debbly/IPFS-lit

## Gating dynamic and interactive content inside a React app

This example code shows how to lock an entire React app behind a Lit JWT.

https://github.com/LIT-Protocol/lit-locked-react-app-minimal-example

## Node JS encryption and decryption of static content. Also a good example of how to use the Lit JS SDK entirely serverside with a Hotwallet.

https://github.com/LIT-Protocol/lit-demo-simple-string-encrypt-nodejs

## Minimal JWT verification example to gate dynamic content on a server

This repo is a minimal example to:

- Mint an NFT (client side)
- Provision access to a resource (a web url) behind ownership of that NFT (client side)
- Request a signed JWT from the Lit network to access that resource (client side)
- Verify the signature on that JWT (server side)

https://github.com/LIT-Protocol/lit-minimal-jwt-example

## NextJS Minimal JWT Example

This repo is a minimal example to:

- Provision access to a resource (a web url) behind ownership of that NFT (client side)
- Request a signed JWT from the Lit network to access that resource (client side)
- Verify the signature on that JWT (server side)

Below is a [Replit project](https://replit.com/@lit/NextJS-x-Lit-Token-Gating#pages/index.js).

<iframe frameborder="0" width="100%" height="500px" className="repls" style={{display: "none"}} src="https://replit.com/@lit/NextJS-x-Lit-Token-Gating#pages/index.js"></iframe>

## Minting HTML NFTs

An example that showcases the ability to mint an HTML NFT with locked content that only the NFT owner can decrypt or see.

https://github.com/LIT-Protocol/MintLIT

## Access Control Conditions Modal Example

- An example of how to use the Access Control Conditions Modal: https://github.com/LIT-Protocol/lit-access-control-conditions-modal-example

## Lit AuthSig - server side, no access to MetaMask

- An example of how to create a Lit AuthSig (aka a wallet signature) on the server side, where you don't have access to MetaMask: https://github.com/LIT-Protocol/hotwallet-signing-example

## Access Control List Smart Contract to create an authorization system

- An example of an ACL smart contract that you could easily use with Lit's EVM Custom Contract Conditions to create a flexible and powerful authorization system: https://github.com/masaun/ACL-smart-contract
