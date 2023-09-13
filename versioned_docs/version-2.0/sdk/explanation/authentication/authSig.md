---
sidebar_position: 2
---

# Wallet Signatures

An `AuthSig` is a wallet signature obtained from a user. Wallet signatures are required to communicate with the Lit Nodes and authorize requests.

## Format of an `AuthSig`

You can use any signature compliant with EIP-4361, also known as Sign in with Ethereum (SIWE), for the `AuthSig`. However, the signature must be presented in an `AuthSig` object formatted like so:

```json
{
	"sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
	"derivedVia": "web3.eth.personal.sign",
	"signedMessage": "localhost wants you to sign in with your Ethereum account:\n0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a\n\nThis is a test statement.  You can put anything you want here.\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gzdlw7mR57zMcGFzz\nIssued At: 2022-04-15T22:58:44.754Z",
	"address": "0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a"
}
```

In the `AuthSig` data structure:

- `sig` is the signature produced by signing the `signedMessage`
- `derivedVia` is the method used to derive the signature (e.g., "web3.eth.personal.sign")
- `signedMessage` is the original message that was signed
- `address` is the public key address that was used to create the signature

You can refer to the `AuthSig` type definition in the [Lit JS SDK V2](https://js-sdk.litprotocol.com/interfaces/types_src.AuthSig.html).

## Obtaining an `AuthSig` in the browser

### Using `checkAndSignAuthMessage`

The Lit SDK `checkAndSignAuthMessage()` function provides a convenient way to obtain an `AuthSig` from an externally-owned account in a browser environment.

```js
import { checkAndSignAuthMessage } from '@lit-protocol/lit-node-client';

const authSig = await checkAndSignAuthMessage({
  chain: "ethereum",
});
```

When called, `checkAndSignAuthMessage` triggers a wallet selection popup in the user's browser. The user is then asked to sign a message, confirming ownership of their crypto address. The signature of the signed message is returned as the `authSig` variable.

The function also stores the `AuthSig` in local storage, removing the need for the user to sign the message again. However, if the signature expires or becomes too old, the user may be prompted to sign the message again.

`checkAndSignAuthMessage` checks the currently selected chain in the user's wallet. If user's wallet supports it, the function sends a request to the user's wallet to change to the chain specified in the `checkAndSignAuthMessage()` function call. This ensures that the user is interacting with the correct blockchain network.

### Using `signAndSaveAuthMessage`

If you prefer to implement your own wallet selection interface, you can call the `signAndSaveAuthMessage()` function, which offers more customization. To use this function, pass in an instance of an [ethers.js `Web3Provider` object](https://docs.ethers.org/v5/api/providers/other/#Web3Provider), the wallet address, the chain ID, and the signature expiration time.

```js
import { ethConnect } from '@lit-protocol/auth-browser';

const authSig = await ethConnect.signAndSaveAuthMessage({
  web3: web3Provider,
  account: walletAddress,
  chainId: 1,
  expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
});
```

:::note
Be sure to import `cosmosConnect` and `solConnect` for Cosmos and Solana respectively.
:::

### Using EIP-1271 for Account Abstraction

In general, smart contracts can't produce an `AuthSig` since they don't possess a private key. However, you can generate an `AuthSig` for smart contracts using [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271), a standard for verifying signatures when the account is a smart contract.

Following the same data structure as above, you can format your smart contract `AuthSig` like so: 

- `sig` is the actual hex-encoded signature
- `derivedVia` must be "EIP1271" to inform the nodes that this `AuthSig` is for smart contracts
- `signedMessage` is any string that you want to pass to the `isValidSignature(bytes32 _hash, bytes memory _signature)` as the `_hash` argument
- `address` is the address of the smart contract

:::note
The smart contract must implement the `isValidSignature(bytes32 _hash, bytes memory _signature)` function since the Lit Nodes will call this function to validate the `AuthSig`. Refer to the [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) docs to understand the `isValidSignature` function.
:::

You can present the smart contract `AuthSig` object to the Lit Nodes just like any other `AuthSig`.

Check out this [**React** project](https://replit.com/@lit/Smart-Contract-Authsig-EIP1271#smart-contract-authsig/src/App.js) for an example of how to generate and use a smart contract `AuthSig`.

### Clearing Local Storage

If you want to clear the `AuthSig` stored in local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

## Obtaining an `AuthSig` on the server-side

If you want to obtain an `AuthSig` on the server-side, you can instantiate an `ethers.Signer` to sign a SIWE message, which will produce a signature that can be used in an `AuthSig` object.

```js
const LitJsSdk = require('@lit-protocol/lit-node-client-nodejs');
const { ethers } = require("ethers");
const siwe = require('siwe');

async function main() {
  // Initialize LitNodeClient
  const litNodeClient = new LitJsSdk.LitNodeClientNodeJs();
  await litNodeClient.connect();

  // Initialize the signer
  const wallet = new ethers.Wallet('<Your private key>');
  const address = ethers.utils.getAddress(await wallet.getAddress());

  // Craft the SIWE message
  const domain = 'localhost';
  const origin = 'https://localhost/login';
  const statement =
    'This is a test statement.  You can put anything you want here.';
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
  });
  const messageToSign = siweMessage.prepareMessage();
  
  // Sign the message and format the authSig
  const signature = await wallet.signMessage(messageToSign);

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: address,
  };

  console.log(authSig);
}

main();
```
