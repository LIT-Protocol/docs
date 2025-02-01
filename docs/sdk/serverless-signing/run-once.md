import FeedbackComponent from "@site/src/pages/feedback.md";

# Running a Lit Action on a single node

## Overview

Typically, when a Lit Action is called it is executed across every Lit node in parallel. With `runOnce`, you have the ability to perform specified operations on a single node, versus all of them at once.

The `runOnce` function takes another function as a parameter and a deterministic algorithm is used to select the Lit node that it will be executed on. The selected node will run the function and broadcast the result to all of the other Lit nodes.

The following code example uses the `runOnce` function to send a signed Ethereum transaction to chain. 

## Using a Single Node to Send a Transaction

:::warning
The value returned from the function provided to `runOnce` must return a value which can be serialized with `toString` otherwise you will receive a return value of `[ERROR]`
:::

```js
const code = `
(async () => {
    const sigName = "sig1";
    // example transaction
    let txn = {
        to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        value: 1,
        gasPrice: 20000000000,
        nonce: 0,
    };

    // using ether's serializeTransaction
    // https://docs.ethers.org/v5/api/utils/transactions/#transactions--functions
    const serializedTx = ethers.utils.serializeTransaction(txn);
    let hash = utils.keccak256(ethers.utils.toUtf8Bytes(serializedTx));
    // encode the message into an uint8array for signing
    const toSign = await new TextEncoder().encode(hash);
    const signature = await Lit.Actions.signAndCombineEcdsa({
        toSign,
        publicKey,
        sigName,
    });

    // the code in the function given to runOnce below will only be run by one node
    let res = await Lit.Actions.runOnce({ waitForResponse: true, name: "txnSender" }, async () => {
        // get the node operator's rpc url for the 'ethereum' chain
        const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const tx = await provider.sendTransaction(signature);
        return tx.blockHash; // return the tx to be broadcast to all other nodes
    });

    // set the response from the action as the result of runOnce operation
    // will be sent by all nodes, even though only a single node did the computation
    Lit.Actions.setResponse(res);
})()
`;
const client = new LitNodeClient({
    litNetwork: "datil-dev",
});

await client.connect();
const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
        publicKey: "<your pkp public key>",
    }
});

console.log("transactions in latest block from all nodes: ", res);
```
In the above `runOnce` example, within the Lit Action code, you'll notice we specify two properties in the object passed to `Lit.Actions.runOnce`:
- *`waitForResponse`* - boolean to wait for all nodes to respond if set to `true`
- *`name`* - string to name the response from the operations. Helpful if using `runOnce` multiple times in a single action.


## ExecuteJs `response strategy`

When using `runOnce` you might want to set the result of the `runOnce` execution as a response from the Lit Action. By default the `response strategy` is to use the least occurring response from a node executing the Lit Action as the response returned in the `ExecuteJsResponse`. The options for strategies are the following.

- `leastCommon` - the least occurring response will be returned as part of the result.
- `mostCommon` - the most common response will be returned as part of the result.
- `custom` - a response that is returned from the provided `customFilter` will be added to the execution result.

:::note
In the event all responses are the same then the strategy will not be relevant.
:::

For information on using the `signAndCombineEcdsa` function go [here](./combining-signatures.md).

For information on using the `getRpcUrl` function go [here](./get-rpc-url.md).
