# 1-of-1 Multi Signature

## Signing with the PKP

```tsx
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import mempoolJS from "@mempool/mempool.js";

async function oneOfOneMultiSig(litNodeClient: LitNodeClient, sessionSigs: any, pkpPublicKey1: string, pkpPublicKey2: string, destinationAddress: string) {
    bitcoin.initEccLib(ecc);

    const network = bitcoin.networks.bitcoin;
    const pubKeyBuffer_1 = Buffer.from(pkpPublicKey1, "hex");
    const pubKeyBuffer_2 = Buffer.from(pkpPublicKey2, "hex");

    const redeemScript = bitcoin.script.compile([
        bitcoin.opcodes.OP_1,
        pubKeyBuffer_1,
        pubKeyBuffer_2,
        bitcoin.opcodes.OP_2,
        bitcoin.opcodes.OP_CHECKMULTISIG,
    ]);

    const p2shPayment = bitcoin.payments.p2sh({
        redeem: { output: redeemScript },
        network: network,
    });

    const { bitcoin: { addresses, transactions } } = mempoolJS({
        hostname: "mempool.space",
        network: "mainnet",
    });

    const addressUtxos = await addresses.getAddressTxsUtxo({
        address: p2shPayment.address!,
    });

    if (addressUtxos.length === 0) {
        console.log("No UTXOs found for address:", p2shPayment.address);
        return;
    }

    const utxo = addressUtxos[0];

    const psbt = new bitcoin.Psbt({ network });

    const utxoRawTx = await transactions.getTxHex({ txid: utxo.txid });

    psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: Buffer.from(utxoRawTx, "hex"),
        redeemScript: redeemScript,
    });

    const fee = 1000;
    const amountToSend = utxo.value - fee;

    psbt.addOutput({
        address: destinationAddress,
        value: BigInt(amountToSend),
    });

    //@ts-ignore
    const tx = psbt.__CACHE.__TX.clone();
    const sighash = tx.hashForSignature(
        0,
        redeemScript,
        bitcoin.Transaction.SIGHASH_ALL
    );

    const litActionResponse = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    jsParams: {
        publicKey: pkpPublicKey1,
        toSign: Buffer.from(sighash, "hex"),
    },
    });

    const signatureWithHashType = convertSignature(
        litActionResponse1.signatures.btcSignature
    );

    psbt.updateInput(0, {
        finalScriptSig: bitcoin.script.compile([
        bitcoin.opcodes.OP_0,
        signatureWithHashType,
        redeemScript,
        ]),
    });

    const txHex = psbt.extractTransaction().toHex();
    return await broadcastTransaction(txHex);
}
```