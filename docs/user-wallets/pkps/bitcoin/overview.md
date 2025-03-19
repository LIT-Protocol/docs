import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Signing Bitcoin P2SH Transactions using a PKP

Signing Bitcoin transactions using a [PKP (Programmable Key Pair)](../overview.md) differs slightly from signing transactions on EVM chains using Lit.

The Lit nodes support PKP signing using the [ECDSA (Elliptic Curve Digital Signature Algorithm)](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) with their private key shares. This capability allows PKPs to sign transactions on the Bitcoin blockchain.

Due to the unique nature of PKPs—where the full private key cannot be reconstructed—we must prepare the Bitcoin transaction so that it only requires the PKP's signature before signing it. Additionally, after obtaining the PKP signature, we need to convert it from the standard ECDSA format to Bitcoin's DER (Distinguished Encoding Rules) format before finalizing and broadcasting the transaction.

## Prerequisites

Before continuing with this guide, make sure you have the following:

- An understanding of [Lit Actions](../../../sdk/serverless-signing/overview.md) and how they work.
- A basic understanding of Bitcoin transactions, specifically [PSBTs (Partially Signed Bitcoin Transactions)](https://en.bitcoin.it/wiki/BIP_0174) and [Bitcoin Scripts](https://en.bitcoin.it/wiki/Script).

## P2SH Examples

Our docs currently have four different examples of using PKPs to sign Bitcoin [P2SH (Pay-to-Script-Hash)](https://river.com/learn/terms/p/p2sh/) transactions:

- [Single Signature](./single-sig.md): Signing a transaction with a single PKP signature.
- [Multi Signature](./multi-sig.md):  Signing a transaction that requires multiple signatures.
- [1-of-1 Multi Signature](./1of1-multi-sig.md): A special case of multi-signature transactions requiring only one signature.
- [Collaborative](./collaborative.md): Combining multiple [UTXOs (Unspent Transaction Outputs)](https://en.wikipedia.org/wiki/Unspent_transaction_output#:~:text=In%20cryptocurrencies%2C%20an%20unspent%20transaction,be%20spent%20by%20a%20recipient.) from multiple PKPs into a single transaction.

## High Level Overview

Through specific preparation of the Bitcoin transaction, we can use a PKP to sign a Bitcoin transaction. 

A higher-level overview of the process can be understood from the diagram below.
![High Level Overview Diagram](../../../../static/img/BTC-Overview.png)

## Detailed Overview

A more technical overview of the process can be understood from the swimlane below.
![BTC Swimlane](../../../../static/img/BTC-Swimlane.png)

### Signing Within a Lit Action

The following code snippet shows the `litActionCode` that will be executed to sign the transaction. It signs the data in the `toSign` variable and returns the ECDSA signature with the name `btcSignature`.

```tsx
// @ts-nocheck

const _litActionCode = async () => {
  try {
    const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName: 'btcSignature' });
    Lit.Actions.setResponse({ response: 'true' });
  } catch (error) {
    Lit.Actions.setResponse({ response: error.message });
  }
};

export const litActionCode = `(${_litActionCode.toString()})();`;
```

<details>
<summary>Click here to see the expected response format</summary>
<p>

```tsx
litActionResponse: {
  claims: {},
  signatures: {
    btcSignature: {
      r: 'd50b9c39e72bf0167d8ca769f4d3dcebf985d4330a108cdcbe407d9b88acb5e2',
      s: '62d25cb024bf2eaa52bbf5fd2fbd8e58e964d9724be824c56f1c3204e7fd862c',
      recid: 1,
      signature: '0xd50b9c39e72bf0167d8ca769f4d3dcebf985d4330a108cdcbe407d9b88acb5e262d25cb024bf2eaa52bbf5fd2fbd8e58e964d9724be824c56f1c3204e7fd862c1c',
      publicKey: '04EAEC6D85F968EAE24C0FE034AE1626CCA3554A1C57CCAF7572978A2E17E3B9FDCC52EB135616EFD50DBEBBDEB2C7373F6E571B9CE7B61D80B20144DE3B92602C',
      dataSigned: '695F83492398F68D8C478F2165EA7E1E5760666B9E39B7E99F23D40E0953B65F'
    }
  },
  response: true,
  logs: ''
}
```
</p>
</details>

### Formatting the Signature

Once we have the ECDSA signature from successfully signing with a PKP, we need to format it to be compatible with Bitcoin's DER format. To do this, we've constructed the helper function `convertSignature` in the example code.

#### `convertSignature` Overview

1. Extract the `r` and `s` values from the `btcSignature`, convert them from a hexadecimal string to a Buffer.
2. Create an instance of the secp256k1 [elliptic curve](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography), which is the elliptic curve used in Bitcoin's public key cryptography.
3. Extract the number of points, or the order (`n`), on the elliptic curve.
4. Implement low-S normalization, which ensures that `s` is less than half of the order. Bitcoin requires this operation to prevent transaction malleability.
5. Convert the `r` and `s` values from a BigNumber into a 32-byte Buffer in big-endian order. This is done so next we can ensure the positivity of the `r` and `s` values.
6. We ensure positivity of the `r` and `s` values using the `ensurePositive` helper function. This function:
  - Checks if the most significant bit (MSB) of the first byte is set (i.e. the number is negative).
  - If so, we construct a new buffer one byte longer than the original.
  - We then prepend `0x00` to ensure the Buffer is positive.
  - The original buffer is copied into the new buffer starting at index 1. This ensures that only the MSB has changed.
  - If the MSB was not set from the beginning, we can return the original buffer.
7. After ensuring positivity of the `r` and `s` values, we can format the signature for the transaction. This involves encoding using the BIP66 (Bitcoin Improvement Proposal 66), which is a standard for encoding ECDSA signatures in Bitcoin. It defines a strict DER (Distinguished Encoding Rules) encoding.
8. Append the Bitcoin-formatted signature with the hash type `SIGHASH_ALL`. Bitcoin requires that the hash type used during signing be appended to the signature. This informs the network how the transaction was hashed and what parts of it are covered by the signature.

<details>
<summary>Click here to see how to format the signature</summary>
<p>

```tsx
import elliptic from "elliptic";
import * as bip66 from "bip66";
import * as bitcoin from "bitcoinjs-lib";
import BN from "bn.js";

export const convertSignature = async (litSignature: any) => {
    const EC = elliptic.ec;
    let r = Buffer.from(litSignature.r, "hex");
    let s = Buffer.from(litSignature.s, "hex");
    let rBN = new BN(r);
    let sBN = new BN(s);

    const secp256k1 = new EC("secp256k1");
    const n = secp256k1.curve.n;

    if (sBN.cmp(n.divn(2)) === 1) {
      sBN = n.sub(sBN);
    }

    r = rBN.toArrayLike(Buffer, "be", 32);
    s = sBN.toArrayLike(Buffer, "be", 32);

    function ensurePositive(buffer: any) {
    if (buffer[0] & 0x80) {
        const newBuffer = Buffer.alloc(buffer.length + 1);
        newBuffer[0] = 0x00;
        buffer.copy(newBuffer, 1);
        return newBuffer;
    }
    return buffer;
    }

    r = ensurePositive(r);
    s = ensurePositive(s);

    let derSignature;
    try {
      derSignature = bip66.encode(r, s);
    } catch (error) {
      console.error("Error during DER encoding:", error);
      throw error;
    }

    const signatureWithHashType = Buffer.concat([
      derSignature,
      Buffer.from([bitcoin.Transaction.SIGHASH_ALL]),
    ]);

    return signatureWithHashType;
}
```
</p>
</details>

### Broadcasting the Transaction

Once the transaction is fully signed and formatted, it needs to be broadcasted to the Bitcoin blockchain. You can use [mempoolJS](https://www.npmjs.com/package/@mempool/mempool.js), a JavaScript client library for the Mempool API, to broadcast the transaction. Alternatively, you can use a third-party service or the [bitcoin-cli](https://developer.bitcoin.org/reference/rpc/sendrawtransaction.html) to broadcast the transaction hex directly. In this example, we use `mempoolJS` within the `broadcastTransaction` helper function.

#### `broadcastTransaction` Overview
1. Send the HTTP request to the endpoint.
2. If the response is invalid, throw an error.
3. If the response is valid, console.log the response (transaction id).
4. Expected format: 
- ```Transaction broadcasted successfully. TXID: 57d0430318a389c5ee447ae99b8858179863dd771f64e8aa580672216755f2f5```

<details>
<summary>Click here to see how to broadcast the transaction</summary>
<p>

```tsx
import fetch from "node-fetch";

export const broadcastTransaction = async (txHex: string) => {
    try {
    const response = await fetch("https://mempool.space/api/tx", {
        method: "POST",
        headers: {
        "Content-Type": "text/plain",
        },
        body: txHex,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error broadcasting transaction: ${errorText}`);
    }

    const txid = await response.text();
    console.log(`Transaction broadcasted successfully. TXID: ${txid}`);
    return txid;
    } catch (error) {
      console.error("Error during DER encoding:", error);
      throw error;
    }
};
```
</p>
</details>

## Additional Resources

If you're interested in learning how to use PKPs to sign Legacy P2PKH (Pay-to-Public-Key-Hash) Bitcoin transactions, we recommend checking out our detailed [blog post](https://spark.litprotocol.com/programming-bitcoin/) and exploring our [code example](https://github.com/LIT-Protocol/developer-guides-code/tree/master/btc-trigger/nodejs).

We hope to develop additional contemporary Bitcoin guides in the future (i.e. P2TR). We recommend regularly checking our blog for the most relevant updates.