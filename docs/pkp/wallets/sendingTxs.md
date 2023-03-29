---
sidebar_position: 3
---

# Sending Transactions with PKPs

:::note
**STATE OF THE NETWORK**

PKPs are still heavily in development and should NOT BE USED to transact live assets that hold monetary value. DO NOT store assets you are not prepared to lose. During this period, we're grateful for feedback on how to improve the docs and examples.
:::

:::note
**Migrating to the Lit SDK V2** 
This package will soon be migrated to the new [Typescript SDK](https://js-sdk.litprotocol.com/). The package import and object initialization may change, but the core functionality and methods should remain the same.
:::

You can use the [Lit PKP SDK](https://github.com/LIT-Protocol/lit-pkp-sdk) (an extension of the PKPWallet package) to handle Ethereum JSON RPC requests for signing messages, data, and transactions and sending transactions with PKPs.

The SDK supports the following signing methods:

- eth_sign
- personal_sign
- eth_signTypedData
- eth_signTypedData_v1
- eth_signTypedData_v3
- eth_signTypedData_v4
- eth_signTransaction
- eth_sendTransaction
- eth_sendRawTransaction

## Examples

### Signing a Transaction

```js

// Transaction to sign
const from = address;
const to = address;
const gasLimit = BigNumber.from('21000');
const value = BigNumber.from('10');
const data = '0x';
// pkp-ethers signer will automatically add missing fields (nonce, chainId, gasPrice, gasLimit)
const txParams = {
  from,
  to,
  gasLimit,
  value,
  data,
};

// eth_signTransaction parameters
// Transaction - Object
// Reference: https://ethereum.github.io/execution-apis/api-documentation/#eth_signTransaction
const payload = {
  method: 'eth_signTransaction',
  params: [txParams],
};

// Initialize Lit PKP Wallet
const wallet = new LitPKP({
  pkpPubKey: publicKey,
  controllerAuthSig: authSig,
  provider: 'https://rpc-mumbai.maticvigil.com',
});
await wallet.init();

// Sign eth_signTransaction request
const result = await wallet.signEthereumRequest(payload);
console.log('eth_signTransaction result', result);

```

### Sending a Transaction

``` js
// Transaction to sign and send
const from = address;
const to = address;
const gasLimit = BigNumber.from('21000');
const value = BigNumber.from('10');
const data = '0x';
// pkp-ethers signer will automatically add missing fields (nonce, chainId, gasPrice, gasLimit)
const txParams = {
  from,
  to,
  gasLimit,
  value,
  data,
};

// eth_sendTransaction parameters
// Transaction - Object
// Reference: https://ethereum.github.io/execution-apis/api-documentation/#eth_sendTransaction
const payload = {
  method: 'eth_sendTransaction',
  params: [txParams],
};

// Initialize Lit PKP Wallet
const wallet = new LitPKP({
  pkpPubKey: publicKey,
  controllerAuthSig: authSig,
  provider: 'https://rpc-mumbai.maticvigil.com',
});
await wallet.init();

// Handle eth_sendTransaction request
const result = await wallet.signEthereumRequest(payload);
console.log('eth_sendTransaction result', result);

```

### Personal_Sign

``` js

// Message to sign
const message = 'Free the web';
const hexMsg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));

// personal_sign parameters
// DATA, N Bytes - message to sign.
// DATA, 20 Bytes - address
// Reference: https://metamask.github.io/api-playground/api-documentation/#personal_sign
const payload = {
  method: 'personal_sign',
  params: [hexMsg, address],
};

// Initialize Lit PKP Wallet
const wallet = new LitPKP({
  pkpPubKey: publicKey,
  controllerAuthSig: authSig,
  provider: 'https://rpc-mumbai.maticvigil.com',
});
await wallet.init();

// Sign personal_sign request
const sig = await wallet.signEthereumRequest(payload);

// Verify signature
const recoveredAddr = ethers.utils.verifyMessage(message, sig);
console.log(
  'eth_sign verified? ',
  address.toLowerCase() === recoveredAddr.toLowerCase()
);

```

You can view the complete repo of examples [here](https://github.com/LIT-Protocol/lit-pkp-sdk/tree/main/examples).