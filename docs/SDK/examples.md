---
sidebar_position: 5
---

# Example Projects

### Gating dynamic and interactive content inside a React app

This example code shows how to lock an entire React app behind a Lit JWT.

https://github.com/LIT-Protocol/lit-locked-react-app-minimal-example

### Client side encryption / decryption of static content

This file contains a working implementation of the functions needed to use Lit for encrypting / decrypting static content

https://github.com/debbly/IPFS-lit/blob/main/src/lib/lit.js

### Node JS encryption and decryption of static content

https://github.com/LIT-Protocol/lit-demo-simple-string-encrypt-nodejs

### Minimal JWT verification example to gate dynamic content on a server

This repo is a minimal example to:

- Mint an NFT (client side)
- Provision access to a resource (a web url) behind ownership of that NFT (client side)
- Request a signed JWT from the Lit network to access that resource (client side)
- Verify the signature on that JWT (server side)

https://github.com/LIT-Protocol/lit-minimal-jwt-example

### Minting HTML NFTs

An example that showcases the ability to mint an HTML NFT with locked content that only the NFT owner can decrypt or see.

https://github.com/LIT-Protocol/MintLIT

### Using the Lit JS SDK entirely serverside

This shows how to use the Lit JS SDK to provision access to a resource, and then request access to it, entirely on the server side.

https://github.com/LIT-Protocol/lit-only-serverside-sdk-example

## Other Examples

- Use a Cloudflare worker to protect any URL with Lit Protocol: https://github.com/LIT-Protocol/cloudflare-litgate-js

- Use Lit Protocol to gate a video or livestream with cloudflare: https://github.com/LIT-Protocol/lit-cloudflare-frontend and a corresponding tool to deploy a working cloudflare worker to your own cloudflare account: https://litgateway.com/apps/cloudflare

- Lit protocol integration with Ceramic to store encrypted data on Ceramic: https://github.com/LIT-Protocol/CeramicIntegration and a corresponding example implementation of that integration: https://github.com/LIT-Protocol/CeramicIntegrationExample

- An example of how to use the Access Control Conditions Modal: https://github.com/LIT-Protocol/lit-access-control-conditions-modal-example

- An example of how to create a Lit AuthSig (aka a wallet signature) on the server side, where you don't have access to metamask: https://github.com/LIT-Protocol/hotwallet-signing-example

- AN example of an ACL smart contract that you could easily use with Lit's EVM Custom Contract Conditions to create a flexible and powerful authorization system: https://github.com/masaun/ACL-smart-contract
