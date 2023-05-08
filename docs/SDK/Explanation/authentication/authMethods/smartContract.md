---
sidebar_position: 2
---

# Smart Contract

In general, smart contracts can't produce an `AuthSig` since they don't possess a private key. However, you can generate an `AuthSig` for smart contracts using [EIP1271](https://eips.ethereum.org/EIPS/eip-1271), a standard for verifying signatures when the account is a smart contract.

## How it works

The Lit nodes call the `isValidSignature(bytes32 _hash, bytes memory _signature)` function for the contract at the `authSig.address`. Where `bytes32 _hash` is the bytes32 representation of the `authSig.signedMessage` and `authSig.sig` is passed as the `bytes _signature` argument. The authSig is validated based on the returned result of the contract's `isValidSignature` function.

Please read the [EIP1271](https://eips.ethereum.org/EIPS/eip-1271) docs to understand the `isValidSignature` function.

## See it in action!

Below is the complete [**React** project](https://replit.com/@lit/Smart-Contract-Authsig-EIP1271#smart-contract-authsig/src/App.js).

<iframe frameborder="0" width="100%" height="500px" className="repls" style={{display: "none"}} src="https://replit.com/@lit/Smart-Contract-Authsig-EIP1271#smart-contract-authsig/src/App.js"></iframe>

