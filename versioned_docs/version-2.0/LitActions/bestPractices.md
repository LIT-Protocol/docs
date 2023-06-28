---
sidebar_position: 5
---

# Best Practices

:::note
It is NOT recommended to use the Lit JS SDK within a Lit Action due to the potential for exponential growth of computational complexity (n^2) (eg. If 10 nodes try to get 10 signature shares, there are now 100 http requests). It is the responsibility of the client to collect and combine the signature or decryption shares, as the combination operation is not supported within a Lit Action.

For some use cases (such as making an API or RPC request), it may be desired to execute a Lit Action on a single node, as opposed to every node in the Lit Network in parallel.

[Single execution](/LitActions/workingWithActions/singleExecution) is now enabled in the SDK by passing the targetNodeRange parameter after your executeJS function (i.e. 'executeJs({ targetNodeRange: 1 })'). You can pass 1-10 to specify the number of nodes the Lit Action should be executed on. Returning signed values in single execution is not yet supported.
:::

## Ideal Use Cases 
- Generating [proofs](/LitActions/intro#proofs)
- Looking up permitted actions, addresses and [auth methods](/pkp/authHelpers) associated with a PKP
- Checking access control conditions with [conditional signing](LitActions/workingWithActions/conditionalSigning)

## Think Twice Use Case -- Ideal for Single Node Execution
- POST request that inserts a new SQL row (if not called in single execution, the Lit Action will be executed by every node in parallel, you will end up with n number of rows, where n is no less than two-thirds the number of total nodes in the Lit network)
- ETH RPC calls

## Bad Use Cases
- Sending a signed transaction (the transaction will be sent n times, where n is no less than two-thirds the number of total nodes in the Lit network)