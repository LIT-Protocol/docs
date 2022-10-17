---
sidebar_position: 2
---

# Setup

## Smart Contract

1. Install hardhat:
```
yarn add hardhat
```
2. Init hardhat to create the boilerplate for a **Basic project (with Javascript)**:
```
npx hardhat init
```
3. Install Openzepplin:
```
yarn add @openzeppelin/contracts
```
4. Test deploy the sample smart contract on 2 separate terminals:
```
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

Now that we have our hardhat working & the sample smart contract is deployed correctly, let's setup our Lit SDK which is we will use to encrypt & decrypt the metadata.

## Lit SDK

You can use Lit SDK to encrypt and store any static content. This could be a file, a string, or anything that won't change (we're gonna encrypt an input string). You have to store the content and metadata yourself (we're storing the encrypted string on a blockchain network), but Lit will store who is allowed to decrypt it and enforce this (aka key management).


1. Install Lit SDK:
```
yarn add @lit-protocol/sdk-browser
```
2. Create a Lit class which will have all the encryption & decryption functions we require:
```
import LitJsSdk from "@lit-protocol/sdk-browser";

const client = new LitJsSdk.LitNodeClient();

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }
}
```

:::note

`client.connect()` will return a promise that resolves when you are connected to the Lit Network. You may also listen for the `lit-ready` event.

In the code examples we make the litNodeClient available as a global variable so that it can be used throughout the web app.
:::