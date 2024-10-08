---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# FAQ

## General Questions

### 1. Does the Lit SDK work with Typescript?

Yes, you can find the latest Lit JS SDK version [here](https://github.com/LIT-Protocol/js-sdk). The older JavaScript library [lit-js-sdk](https://github.com/LIT-Protocol/lit-js-sdk) has been deprecated as of March 2023.

### 2. How do I pay for using the Lit Network?

To use the Lit Network you must mint Capacity Credits, which permit you to execute a configurable number of requests per second over a given period of time. You can read the docs on payments here: https://developer.litprotocol.com/v3/concepts/capacity-credits-concept.

<br />

## Auth Sigs & Session Sigs

### 1. Can I use checkAndSignAuthMessage in a backend project?

The `checkAndSignAuthMessage` function can only be used in browser environments as it will prompt a Metamask (or other crypto wallet) popup for you to sign & generate the Authsig. If you are building a backend project, you have to use hot wallet signing to generate the AuthSig. You can learn how to do so following this project: https://github.com/LIT-Protocol/hotwallet-signing-example/blob/main/sign.mjs

### 2. My AuthSig was working before but now I get the error: Error getting auth context: Signature is not valid

We are enforcing compliance with [EIP-55](https://eips.ethereum.org/EIPS/eip-55) so it is now necessary to use a SIWE message if you’re using hot wallet signing.

### 3. Why don’t I get a MetaMask popup for signing?

The auth signature is stored in your browser's local storage for convenience. You can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html) to delete it from local storage.

### 4. How would this work if we wanted to use a custodial wallet instead?

With a custodial wallet, there is no need to store the signature. The reason it's stored is to prevent the user from having to sign the MetaMask popup a dozen times if they're doing a dozen operations. If you are using a custodial wallet, there is no MetaMask popup, so you can just create the signature fresh each time.

<br />

## PKPs & Lit Actions

### 1. What is the difference between authorization and authentication?

Authentication refers to the specific credential(s) (i.e a wallet address, Google oAuth, or Discord account) that get programmatically "assigned" to a PKP and have the ability to control the underlying key-pair. Read more about authentication [here](../user-wallets/pkps/advanced-topics/auth-methods/overview).

Authorization refers to the use of an auth signature, which is always required when making a request to the Lit Network, whether it be decrypting some piece of content or sending a transaction with a PKP. You can read more about auth sigs [here](../../docs/sdk/authentication/overview).

### 2. Is it possible to define an access control condition that requires a signature generated by a Lit Action?

Yes this is possible. You can follow the docs on Lit Actions Conditions to get started with this You can read more about auth sigs here: https://developer.litprotocol.com/v3/sdk/authentication/overview functionality: https://developer.litprotocol.com/v3/sdk/access-control/lit-action-conditions.

### 3. How to get the BTC address for a PKP?

There are 2 ways of getting the BTC address associated with a PKP. First, you may get it from the [PKP Explorer](https://explorer.litprotocol.com/pkps). If you want that programmatically you may use the public key of the PKP to get the BTC address as demonstrated below:

```js
import * as bitcoinjs from "bitcoinjs-lib";

if (publicKey.startsWith("0x")) {
  publicKey = publicKey.slice(2);
}
pubkeyBuffer = Buffer.from(publicKey, "hex");

// get the btc address from the public key
const pkpBTCAddress = bitcoinjs.payments.p2pkh({
  pubkey: pubkeyBuffer,
}).address;
```

### 4. "Internal JSON-RPC error" When attempting to mint a PKP

Make sure that you have some LPX test tokens in your wallet before minting a PKP in order to pay for gas. You can claim test tokens at the [faucet](https://chronicle-yellowstone-faucet.getlit.dev/).

### 5. “Error: Invalid arrayify value” upon passing an IPFS CID to a function (e.g. isPermittedActions) while interacting with the PKPPermissions contract?

This occurs because the expected data type for an IPFS CID in the PKPPermissions contract is bytes. You have to use the conversion function below to convert your IPFS to bytes:

```js
function getBytesFromMultihash(ipfsId) {
  const decoded = bs58.decode(ipfsId);

  return `0x${Buffer.from(decoded).toString("hex")}`;
}
```

### 6. How to import an npm package inside a Lit Action?

You have to use `esbuild` to create a bundle & use that. Check out an example [here](https://github.com/LIT-Protocol/js-serverless-function-test/tree/main/bundleTests/siwe).

### 7. I’ve permitted a Lit Action to use my PKP, do I still need to pass a valid authSig?

Yes, the AuthSig is required to authenticate with the Lit nodes in the first place. If you pass an empty object, the nodes will throw an error. You can use a global AuthSig if it’s not being used for auth directly, which will mean that it can be made available to all of your users. Alternatively you can produce an AuthSig on the fly using hot wallet signing.

### 8. What should be the value of keyType when interacting directly with the PKPNFT Contract?

The value should be `2` as it represents ECDSA signing. Currently, this is the only supported algorithm for signing with PKPs

### 9. Can I use a PKP to sign/send transactions like a regular Ethereum wallet?

Yes, please check out the [pkp-ethers package](https://github.com/LIT-Protocol/js-sdk/tree/master/packages/pkp-ethers) in the Lit SDK.

### 10. How can I use an Ethereum JSON RPC requests to sign and send transactions?

Check out this PKP x WalletConnect example [here](https://github.com/LIT-Protocol/pkp-walletconnect) to see how one can use PKP to connect to dApps and sign and send Ethereum requests using WalletConnect.

### 11. Is Web Assembly supported in Lit Actions?

No, currently Web Assembly is not supported within Lit Actions.

### 12. I am getting the following error when connecting to the Lit nodes: "Error: Unable to verify the first certificate in nodejs". What may be causing this?

If you're facing this error while using Node.js, please first verify that you don't have unnecessary firewalls on your network that are preventing you from connecting to the Lit network properly.  This is typically caused by some kind of man in the middle in your network, which could be something on your machine or something your ISP is doing.  You could try a VPN or software solution such as [https://1.1.1.1/](https://one.one.one.one/) to remove this man in the middle.  

<br />

## Access Control & Encryption

### 1. Can more than one condition be added for access control?

Yes! See [boolean logic](../sdk/access-control/condition-types/boolean-logic) for examples.

### 2. What’s the maximum number of accessControlConditions allowed at once?

30

### 3. Where can I save the ciphertext & dataToEncryptHash?

The Lit network doesn’t store any encrypted content for you. You can store these anywhere you want; in a database, in an on-chain smart contract, IPFS, anywhere else you like.

### 4. How to construct an accessControlCondition to authorize only a specific wallet address?

Check out an example [here](../sdk/access-control/evm/basic-examples#a-specific-wallet-address).

### 5. How to use a time-lock based accessControlCondition?

Check out an example [here](../sdk/access-control/evm/timelock).

<br />

## Design Patterns

### 1. How to allow only permitted users to execute a given Lit Action?

You can use the `PKPPermission.addPermittedAddress()` function to give other users permission to sign using your PKP. Any Lit Actions assigned to that PKP can then be executed by those users.

To configure other permissions, please use the contract [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/lit-node/PKPPermissions.sol).

### 2. How to allow permitted users to execute only specific Lit Actions?

You can start by assigning the PKP to itself as we don't want the PKP owner to arbitrarily change the Lit Action. Check out the docs on doing so [here](../user-wallets/pkps/advanced-topics/auth-methods/overview#sending-the-pkp-to-itself). You can also use the PKPHelper.`mintNextAndAddAuthMethods()` function to do this by passing in a specific IPFS CIDs with permission to execute.

Note that now anyone call your Lit Action, so how should one add a permitted list of users? We can store the permitted list of users, either on-chain or in the Lit Action itself and, fetch it from there. If you decide to put the access list in the Lit Action itself, you can use `conditional-signing` to check whether the provided AuthSig is permitted to execute the Lit Action. Learn more [here](../sdk/serverless-signing/conditional-signing.md).

### 3. How can I update the permitted Lit Actions/users assigned to a PKP?

Since the PKP is assigned to itself in the setup stage as described above, we can't directly permit any new users/Lit Actions. Thus we have to lay down the upgrade logic in the Lit Action itself. We can have an admin user that can satisfy the update AuthSig check & upgrade the Lit Action to a new IPFS CID which will have the new permitted addresses/code.

### 4. I want to create multiple different AuthSigs but don't want to require my users to sign multiple times?

Firstly, if you are using Lit in a browser environment, the AuthSig is stored in local storage so you don't need to sign multiple times as the stored AuthSig will be used in subsequent requests made by that user. This design pattern is specifically applicable when you want to sign different SIWE resources or messages, which is generally required when making [Custom Contract Calls](../sdk/access-control/evm/custom-contract-calls.md).

For different resources, you'll be required to sign each time since the signed message is different. One way to get around this is to use a PKP to do the signing for you. This is how it works: The user owns a PKP & uses it to sign a message in a Lit Action with `Lit.Actions.signEcdsa()` function. You can then return all of the sigShares from the Lit Action to your application. Here the user can loop through & craft AuthSigs for each returned sigShare and process the required access control operation (i.e. decryption). Another way is to return the crafted AuthSig from the Lit Action directly.

A key point to note here is that the Lit Action can only execute for 60 seconds before it times out. Hence it makes sense to reduce complexity in your Lit Actions code. If you want to create a lot of AuthSigs, you should process those in batches. This will require multiple calls to execute the Lit Action. You may also parallelize these processes using a package like [p-queue](https://www.npmjs.com/package/p-queue).

<br />

## Security & Trust Implications

### 1. What encryption algorithm does Lit uses?

The Lit network uses an identity (ID) based encryption scheme with BLS signatures to encrypt data, which means that decryption is only permitted to those who satisfy a certain identity. Read out more [here](https://developer.litprotocol.com/v3/sdk/access-control/encryption).

### 2. How does Lit handle key management?

Lit handles PKPs which are public/private key-pairs generated by the Lit Network using Distributed Key Generation (DKG), meaning no one node ever has access to the entire private key. Instead, the private key is stored in shares across the network, where each node holds a single share. Read more about this [here](https://developer.litprotocol.com/v3/resources/how-it-works#decentralized-programmable-signing-and-mpc-wallets).

### 3. What's to prevent a Lit node operator from discovering all of the key shares stored in the network and being able to use them to sign or decrypt anything?

Each node only holds a private key share. When a user wants to decrypt or sign something, they present the thing to decrypt and proof that they meet the conditions (using a wallet signature or permitted auth method). Each node independently checks that the user meets the condition with an RPC call to the applicable network. If the user meets the condition, the node uses its private key share to create a decryption os signing share. The user collects the decryption shares and accumulates them above the threshold and is then able to decrypt or sign the content.

So, you can see, the nodes don't talk to each other when decrypting the content. Each node's private key share never leaves the node.

### 4. How do new nodes that come online discover the key shares they need to help decrypt previously-encrypted data?

Right now, Datil-test and Datil are federated networks being run by named 3rd party operators. The ultimate goal is to transition to a fully permissionless network. Root keys are updated every epoch, rendering old shares functionally useless. New shares are shared with new operators through proactive secret sharing. The network uses threshold encryption with a 2/3 threshold, providing redundancy and security.

### 5. What's to prevent one person from running many Lit Protocol nodes so as to acquire sufficient key fragments across their nodes to be able to reconstitute the decryption key for some pieces of content?

In the federated network with named nodes, we know who the operators are, so a sybil attack is pretty hard. In the permissionless network, node operators must stake to run a node which means, you can do the math to figure out the cryptoeconomic guarantees depending on the number of nodes and the required stake amount, which are parameters that will be fine-tuned. Additionally, the use of SEV-SNP as a hardware requirement means node operators never have access to any of the underlying key material contained within their node.

### 6. So you need 2/3 of the entire network to decrypt or sign the content? Not 2/3 of some fixed constant number of key fragments?

Yes, those are the default parameters that the Lit Network has launched with. We are currently exploring a 'subnet' architecture which would allow developers to launch their own subnets with their desired parameters

### 7. How is performance impacted as the number of nodes in the network increases?

The network is designed to handle a large number of nodes while maintaining acceptable performance. As the network grows, subnets can be automatically created to distribute the load and improve performance.

### 8. Is the system robust against attacks?

The system is designed with several security measures to mitigate attacks and ensure the confidentiality and integrity of data. The network consists of multiple node operators, which enhances security by distributing the private keys across different nodes. This makes it difficult for an attacker to gather sufficient key fragments to decrypt data. The system employs a threshold consensus mechanism, where 2/3 of the network nodes must agree to decrypt or sign content. This provides redundancy and security against malicious actors. The use of Secure Enclave Virtualization-Secure Nested Paging (SEV-SNP) ensures that node operators do not have direct access to the underlying key shares. This hardware requirement adds an additional layer of protection to the key material.

These security measures work together to make attacks, such as running multiple nodes to acquire key fragments or decrypt data, impractical and costly to execute.

<br />

## I have a question that isn't answered here. Where can I get help?

Join our [Discord](https://litgateway.com/discord) and post your question in our forums!

<FeedbackComponent/>
