import FeedbackComponent from "@site/src/pages/feedback.md";

# Get Chain RPC URLs Within an Action

## Overview
Within a Lit action, you may wish to have access to an RPC URL which is specific to a given blockchain. This can be useful for situations where you may wish to interact with a given chain by either sending transactions, calling contract methods, pulling block data, etc.

## Getting the RPC context from all nodes
```js
code = `(async () => {
    const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
    const blockByNumber = await provider.send("eth_getBlockByNumber", ["pending", false]);
    const transactions = blockByNumber.transactions;
    Lit.Actions.setResponse(JSON.stringify(transactions));
})();
`;

const client = new LitNodeClient({
network: 'cayenne'
});
await client.connect();

const res = client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {}
});
console.log("transactions in latest block from all nodes: ", res);
```
In the above example we are allowing every node to use their `rpc url` for the `ethereum` main net and pull the `lastest block` which has settled and return the transactions which it contained. This operation will be performed by all nodes.

## Getting the RPC context from a single node

```js
code = `(async () => {
    let res = await Lit.Actions.runOnce({ waitForResponse: true, name: "txnSender" }, async () => {
        const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
        const blockByNumber = await provider.send("eth_getBlockByNumber", ["pending", false]);
        const transactions = blockByNumber.transactions;
        return res;
    });
    // get the broadcast result from the single node which executed the block query and return it from all clients.
    Lit.Actions.setResponse(res);
})();
`;
const client = new LitNodeClient({
network: 'cayenne'
});
await client.connect();

const res = client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {}
});
console.log("transactions in latest block from all nodes: ", res);
```

For information on `runOnce` see [here](./run-once.md)