import FeedbackComponent from "@site/src/pages/feedback.md";

# Run on a Single Node Within an Action

## Overview
Witin a Lit action, you may want only a single node to perform a specific piece of your lit action logic, and let the result be broadcast to all other nodes which are executing the same Lit action in parallel. `runOnce` takes a function as a parameter, and all the nodes use a deterministic algorithm to choose which node will run the function that is passed to runOnce. This single node runs the function, and then broadcasts the result to all the other nodes.

```js
const code = `
(async () => {
    const sigName = "sig1";
    let txn = {
        to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        value: 1000000000000000,
        gasPrice: 20000000000,
        nonce: 0,
    };

    // using ether's serializeTransaction
    // https://docs.ethers.org/v5/api/utils/transactions/#transactions--functions
    let toSign = ethers.utils.serializeTransaction(txn);
    // encode the message into an uint8array for signing
    toSign = await new TextEncoder().encode(toSign);
    const signature = await Lit.Actions.signAndCombineEcdsa({
        toSign,
        publicKey,
        sigName,
    });

    // the code in the block will only be run by one node
    let res = await Lit.Actions.runOnce({ waitForResponse: true, name: "txnSender" }, async () => {
        // get the node operator's rpc url for the 'ethereum' chain
        const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const tx = await provider.sendTransaction(signature);
        return tx; // return the tx to be broadcast to all other nodes
    });

    // set the response from the action as the result of runOnce operation
    // will be sent by all nodes, even though only a single node did the computation
    Lit.Actions.setResponse(res);
})()
`
const client = new LitNodeClient({
    litNetwork: 'cayenne',
});

await client.connect();
const res = client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {
        publicKey: "<your pkp public key>",
    }
});

console.log("transactions in latest block from all nodes: ", res);
```
In the above `runOnce` example you'll notice we provide two properties in the `param object`
- *`waitForResponse`* - boolean to wait for all nodes to respond if set to `true`
- *`name`* - string to name the response from the operations. Helpful if using `runOnce` multiple times in a single action.


For information on `signAndCombineEcdsa` see [here](./combining-signatures.md).

For information on `getRpcUrl` see [here](./get-rpc-url.md).
