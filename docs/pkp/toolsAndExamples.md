---
sidebar_position: 6
---

# Initial Implementations

## Swap Playground
Uniswap trade interface for Programmable Key Pairs (PKPs). 
This is a demo to create actions that developers can copy and paste to use for their own projects. After an action is created, the swap can be executed.
![Lit Swap Interface](/img/lit_swap.png)

Check it out here: https://lit-swap-playground.netlify.app/

## Ceramic Signer

This package can be used to sign Ceramic transactions with a PKP using Lit Actions: https://github.com/LIT-Protocol/key-did-provider-secp256k1

### Example Application

You can find an example implementation (a React app) of talking to Ceramic and signing with Lit Actions / PKPs here: https://github.com/LIT-Protocol/lit-action-ceramic-signing-demo

## Sling Protocol

An SDK for automating DEX interactions using PKPs and Lit Actions. Example functionality includes frictionless swaps with signature abstraction
and on-chain limit orders. This project was funded by our Grants program: https://github.com/Sling-Protocol/pkp-dex-sdk

## Conditional Signing

Conditionally signed response using Lit Actions.
Displays the returned JSON if Ether balance >= Min balance entered AND if you signed the transaction within 2 mins of the set time.

Below is the complete [**React** project](https://replit.com/@lit/Lit-Actions-Conditional-Signing#lit-actions_sign_api_response/src/App.js).

<iframe frameborder="0" width="100%" height="500px" className="repls" style={{display: "none"}} src="https://replit.com/@lit/Lit-Actions-Conditional-Signing#lit-actions_conditional_signing/src/App.js"></iframe>

## Weather API Signing

Signed Response from Weather API. Within a Lit Action, the example project calls the Weather API and then signs the weather response.

Below is the complete [**React** project](https://replit.com/@lit/Lit-Actions-Return-signed-API-reponse#lit-actions_sign_api_response/src/App.js).

<iframe frameborder="0" width="100%" height="500px" className="repls" style={{display: "none"}} src="https://replit.com/@lit/Lit-Actions-Return-signed-API-reponse#lit-actions_sign_api_response/src/App.js"></iframe>
