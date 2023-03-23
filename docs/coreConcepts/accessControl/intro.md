---
sidebar_position: 1
---

# Introduction to Decentralized Access Control
Lit Protocol provides decentralized access control but what does that actually mean?
With Lit Protocol, you can set on-chain conditions like "user must hold an NFT" and then the network will provision signatures and decryption keys for users that meet those conditions.

What makes this process decentralized is that no node in the network is the custodian of the entire private key. The SDK provides mechanisms for the client-side encryption of arbitrary data. Alice starts by generating a symmetric key and encrypts some content with it. She then encrypts the symmetric key to the Lit Network using the shared BLS key. Finally, Alice sets rules for under what conditions or who the network should provision the symmetric key to. When Bob attempts to access the content encrypted by Alice, the network will first check that he meets the required conditions (by prompting him to sign a message with his wallet). Once Lit verifies that the conditions are met, the symmetric key can be decrypted by Bob and he can unlock the content.  


## On-chain conditions and credentials are things like:
* User is a member of a DAO
* User holds an NFT in a collection
* User holds at least 0.1 ETH
* The result of any smart contract function call
* User owns a specific wallet address
* Using boolean operations (AND + OR) for any of the above

## Features

- Supports many EVM chains and Solana. Full list [here](/support/supportedChains).
- Supports many standard contracts, with plans to support any RPC call soon. If you need to interact with a contract that we don't support yet, ask us, and we will implement it.
- Boolean conditions. "And" or "Or" are currently supported.
- Updateable conditions. Only the creator can update the condition.
- Permanent conditions. When a condition is stored as permanent, it becomes impossible to update it, forever.
- Use your favorite storage solution including IPFS/Filecoin, Arweave, Sia, Storj, or even use centralized storage.

## Tools for Access Control Condition

- The [Lit Share Modal v3](https://github.com/LIT-Protocol/lit-share-modal-v3) is a tool for creating access control conditions for securing content with Lit Protocol. 

- The [Access Control Conditions Debugger](https://lit-accs-debugger.vercel.app/) is a tool to verify if the given access control conditions follow the correct [schemas](https://github.com/LIT-Protocol/lit-accs-validator-sdk/tree/main/src/schemas). 
