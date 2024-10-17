# Collaborative Multi Signature

This guide provides a simple example of using two PKPs (Programmable Key Pairs) to create a P2SH (Pay-to-Script-Hash) Bitcoin transaction where both PKPs individually provide a UTXO for the transaction.

You can find a result of this example [here](https://mempool.space/tx/c02ff1ce0df50a01dcac99dbbda4065376ecb7196eed3254772caab7af733a6d). 

## Prerequisites

### UTXO Availability
Please make sure that each P2SH Bitcoin address derived from your PKP public keys has at least one UTXO (Unspent Transaction Output). If you don't know the Bitcoin addresses derived from your PKP public keys, you can run this example and the derived P2SH addresses will be output to the console. The example will use the first UTXO on each of your derived PKP addresses to send funds to the specified destination address. If there are no UTXOs, the PKPs will have no funds to spend, and the example will not run.

### Lit-Specific Requirements
- [LitNodeClient](../../../sdk/authentication/session-sigs/get-session-sigs.md#initializing-a-litnodeclient): Used to initialize connection with the Lit network.
- [Session Signatures](../../../sdk/authentication/session-sigs/intro.md): Authenticate your session with the Lit network.
- Ownership of two [PKPs](../../overview.md): The PKPs must be owned by the Ethereum wallet used to generate the Session Signatures.

### Custom Functions Used in This Example
- [`convertSignature`](./overview.md#formatting-the-signature): Converts a signature from the standard ECDSA format to the Bitcoin DER format.
- [`broadcastTransaction`](./overview.md#broadcasting-the-transaction): Broadcasts the signed transaction to the Bitcoin blockchain.
- [`litActionCode`](./overview.md#signing-within-a-lit-action): The Lit Action code executed to sign the transaction within the Lit network.

## Signing with the PKPs

After setting up the prerequisites, the `collaborativeMultiSig` function can be used to sign a Bitcoin transaction.

In this example, each PKP individually signs the transaction input corresponding to their UTXO, transferring it to the specified destination address. The PSBT is then updated with these signatures and finalized, resulting in a single transaction that consolidates all inputs and sends the total amount to the destination address.

For an understanding of the steps involved in this example, visit the [Detailed Overview Diagram](./overview.md#detailed-overview).


```tsx
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import mempoolJS from "@mempool/mempool.js";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

bitcoin.initEccLib(ecc);

async function collaborativeMultiSig(litNodeClient: LitNodeClient, sessionSigs: any, pkpPublicKey1: string, pkpPublicKey2: string, destinationAddress: string) {
    const network = bitcoin.networks.bitcoin;
    const pubKeyBuffer_1 = Buffer.from(pkpPublicKey1, "hex");
    const pubKeyBuffer_2 = Buffer.from(pkpPublicKey2, "hex");

    const redeemScript1 = bitcoin.script.compile([
        pubKeyBuffer_1,
        bitcoin.opcodes.OP_CHECKSIG,
    ]);

    const redeemScript2 = bitcoin.script.compile([
        pubKeyBuffer_2,
        bitcoin.opcodes.OP_CHECKSIG,
    ]);

    const p2shPayment1 = bitcoin.payments.p2sh({
        redeem: { output: redeemScript1 },
        network: network,
    });
    console.log("P2SH Address 1:", p2shPayment1.address);

    const p2shPayment2 = bitcoin.payments.p2sh({
        redeem: { output: redeemScript2 },
        network: network,
    });
    console.log("P2SH Address 2:", p2shPayment2.address);

    const {
        bitcoin: { addresses, transactions },
    } = mempoolJS({
        hostname: "mempool.space",
        network: "mainnet",
    });

    const address1Utxos = await addresses.getAddressTxsUtxo({
        address: p2shPayment1.address!,
    });

    if (address1Utxos.length === 0) {
        console.log("No UTXOs found for address:", p2shPayment1.address);
        return;
    }

    const utxo1 = address1Utxos[0];

    const address2Utxos = await addresses.getAddressTxsUtxo({
        address: p2shPayment2.address!,
    });

    if (address2Utxos.length === 0) {
        console.log("No UTXOs found for address:", p2shPayment2.address);
        return;
    }

    const utxo2 = address2Utxos[0];

    const fee = 1000; // Adjust the fee as needed

    const utxoValue1 = utxo1.value;
    const utxoValue2 = utxo2.value;
    const totalInputValue = utxoValue1 + utxoValue2;
    const amountToSend = totalInputValue - fee;

    const psbt = new bitcoin.Psbt({ network });

    const utxo1RawTx = await transactions.getTxHex({ txid: utxo1.txid });
    const utxo2RawTx = await transactions.getTxHex({ txid: utxo2.txid });

    psbt.addInput({
        hash: utxo1.txid,
        index: utxo1.vout,
        nonWitnessUtxo: Buffer.from(utxo1RawTx, "hex"),
        redeemScript: redeemScript1,
    });

    psbt.addInput({
        hash: utxo2.txid,
        index: utxo2.vout,
        nonWitnessUtxo: Buffer.from(utxo2RawTx, "hex"),
        redeemScript: redeemScript2,
    });

    psbt.addOutput({
        address: destinationAddress,
        value: BigInt(amountToSend),
    });

    //@ts-ignore
    const tx = psbt.__CACHE.__TX.clone();
    const sighash1 = tx.hashForSignature(
        0,
        redeemScript1,
        bitcoin.Transaction.SIGHASH_ALL
    );

    const sighash2 = tx.hashForSignature(
        1,
        redeemScript2,
        bitcoin.Transaction.SIGHASH_ALL
    );

    const litActionResponse1 = await litNodeClient.executeJs({
        code: litActionCode,
        sessionSigs,
        jsParams: {
        publicKey: pkpPublicKey1,
        toSign: Buffer.from(sighash1, "hex"),
        },
    });

    const litActionResponse2 = await litNodeClient.executeJs({
        code: litActionCode,
        sessionSigs,
        jsParams: {
        publicKey: pkpPublicKey2,
        toSign: Buffer.from(sighash2, "hex"),
        },
    });

    const signatureWithHashType1 = convertSignature(
        litActionResponse1.signatures.btcSignature
    );

    const signatureWithHashType2 = convertSignature(
        litActionResponse2.signatures.btcSignature
    );

    psbt.updateInput(0, {
        finalScriptSig: bitcoin.script.compile([
        signatureWithHashType1,
        redeemScript1,
        ]),
    });

    psbt.updateInput(1, {
        finalScriptSig: bitcoin.script.compile([
        signatureWithHashType2,
        redeemScript2,
        ]),
    });

    const txHex = psbt.extractTransaction().toHex();
    return await broadcastTransaction(txHex);
}
```

## Summary

In this guide, you learned how to use PKPs (Programmable Key Pairs) to sign a Bitcoin transaction with a collaborative multi signature in a P2SH (Pay-to-Script-Hash) context.

If you'd like to see other methods of using PKPs to sign Bitcoin transactions, check out our examples listed [here](./overview.md#p2sh-examples).