---
sidebar_position: 1
---

# Introduction

You can use Lit to encrypt and store any static content. This could be a file, a string, or anything that won't change. You have to store the content and metadata yourself (on IPFS, Arweave, or even somewhere centralized), but Lit will store who is allowed to decrypt it and enforce this (aka key management).

The below Replit is a full-fledged **React** application that encrypts & decrypt a **file** using Lit SDK. For best experience please open the web app in a new tab.

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@lit/Encrypt-and-Decrypt-a-File/#encrypt_and_decrypt_file/src/App.js"></iframe>

This example will show you how to encrypt and decrypt data using Lit Protocol's JS SDK on the client side.

## Setting up your main class

At the top of your file, instantiate your Lit Node client like so:

```js
const client = new LitJsSdk.LitNodeClient();
const chain = "ethereum";
```

Create a Lit class and set the litNodeClient.

```js
class Lit {
  private litNodeClient

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }
}

export default new Lit()
```
