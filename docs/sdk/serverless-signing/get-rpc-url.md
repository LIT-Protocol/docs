import FeedbackComponent from "@site/src/pages/feedback.md";

# Get Chain RPC URLs Within an Action

## Overview

You can use the `getRpcUrl` function within a Lit Action to call make an RPC call to a given blockchain. This can be useful for sending transactions, calling contract methods, pulling block data, and other related use cases.

By default, this RPC call will be made by all the nodes in parallel. You can check out an example of making this call on a single node below.

## Getting the RPC context from all nodes
```js
code = `(async () => {
    const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
    const blockByNumber = await provider.send("eth_getBlockByNumber", ["latest", false]);
    const transactions = blockByNumber.transactions;
    Lit.Actions.setResponse(JSON.stringify(transactions));
})();
`;

const client = new LitNodeClient({
litNetwork: "datil-dev"
});
await client.connect();

const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {}
});
console.log("transactions in latest block from all nodes: ", res);
```
In the above example we are requesting every node to use their `rpcUrl` for the `ethereum` mainnet to pull the `latest` block which has settled and return the transactions which it contained. This operation will be performed by all nodes.

## Getting the RPC context from a single node

```js
code = `(async () => {
    let res = await Lit.Actions.runOnce({ waitForResponse: true, name: "txnSender" }, async () => {
        const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
        const blockByNumber = await provider.send("eth_getBlockByNumber", ["latest", false]);
        const transactions = blockByNumber.transactions;
        return res;
    });
    // get the broadcast result from the single node which executed the block query and return it from all clients.
    Lit.Actions.setResponse(res);
})();
`;
const client = new LitNodeClient({
litNetwork: "datil-dev"
});
await client.connect();

const res = await client.executeJs({
    code,
    sessionSigs: {} // your session
    jsParams: {}
});
console.log("transactions in latest block from all nodes: ", res);
```

For information on `runOnce` see [here](./run-once.md)