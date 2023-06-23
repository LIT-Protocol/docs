# Using PKPs as Wallets

With PKPs, you can build secure, customizable [MPC wallets](/resources/pkpsAsWallet) that offer intuitive onboarding experiences without the pain of private key management. 

The [`@lit-protocol/pkp-ethers` package](https://github.com/LIT-Protocol/js-sdk/tree/master/packages/pkp-ethers) provides a familiar wallet interface that makes it easy to sign data, send transactions, and handle Ethereum JSON RPC requests using PKPs.

## Initialize `PKPEthersWallet`

`PKPEthersWallet` must be initialized with an `AuthSig` or a `SessionSig` in order to authorize signing requests. To learn how to generate these signatures, refer to the [Authentication section](/SDK/Explanation/authentication).

```js
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';

const pkpWallet = new PKPEthersWallet({
  controllerAuthSig: '<Your AuthSig>',
  // Or you can also pass in controllerSessionSigs
  pkpPubKey: '<Your PKP public key>',
  rpc: 'https://chain-rpc.litprotocol.com/http'
});
await pkpWallet.init();
```

To view more `PKPEthersWallet` constructor options, refer to the [API docs](https://js-sdk.litprotocol.com/interfaces/types_src.PKPEthersWalletProp.html).

:::note

**Passing `SessionSigs`**

When generating session signatures for `PKPEthersWallet`, be sure to request the ability to execute Lit Actions by passing the following object in the `resourceAbilityRequests` array:

```js
{
  resource: new LitActionResource('*'),
  ability: LitAbility.LitActionExecution,
}
```

:::

## Sign Message

```js
const message = 'Free the web';
const hexMsg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
await pkpWallet.signMessage(hexMsg);
```

## Sign Typed Data

```js
const example = {
  domain: {
    chainId: 80001,
    name: 'Ether Mail',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    version: '1',
  },
  message: {
    contents: 'Hello, Bob!',
    from: {
      name: 'Cow',
      wallets: [
        '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
      ],
    },
    to: [
      {
        name: 'Bob',
        wallets: [
          '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
          '0xB0B0b0b0b0b0B000000000000000000000000000',
        ],
      },
    ],
  },
  primaryType: 'Mail',
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person[]' },
      { name: 'contents', type: 'string' },
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallets', type: 'address[]' },
    ],
  },
};

const { types, domain, primaryType, message } = example;

if (types['EIP712Domain']) {
  delete types['EIP712Domain'];
}

await pkpWallet._signTypedData(domain, types, message)
```

## Sign Transaction

```js
const from = address;
const to = address;
const gasLimit = BigNumber.from('21000');
const value = BigNumber.from('10');
const data = '0x';

// @lit-protocol/pkp-ethers will automatically add missing fields (nonce, chainId, gasPrice, gasLimit)
const transactionRequest = {
  from,
  to,
  gasLimit,
  value,
  data,
};

const signedTransactionRequest = await pkpWallet.signTransaction(transactionRequest)
```

## Send Transaction

With the signed transaction from the example above,

```js
await pkpWallet.sendTransaction(signedTransactionRequest)
```

## Handle Ethereum JSON RPC Requests

The following Ethereum JSON RPC requests are supported:

- eth_sign
- personal_sign
- eth_signTypedData
- eth_signTypedData_v1
- eth_signTypedData_v3
- eth_signTypedData_v4
- eth_signTransaction
- eth_sendTransaction
- eth_sendRawTransaction

Responding to requests is as easy as calling `ethRequestHandler` with a `PKPEthersWallet` instance and request payload.

```js
import { ethRequestHandler } from '@lit-protocol/pkp-ethers';

const message = 'Free the web';
const hexMsg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));

const payload = {
  method: 'personal_sign',
  params: [hexMsg, '<Ethereum address to sign with (should match the Ethereum address of your PKP)>'],
};

const result = await ethRequestHandler({
  signer: pkpWallet,
  payload: payload,
});
```