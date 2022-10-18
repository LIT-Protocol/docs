---
sidebar_position: 5
---

# Testing and Error Handling

Currently we have manual tests that you can run in the browser in `manual_tests.html`. To run these, set up a HTTP server in the build folder. We use python for this with the built in SimpleHTTPServer module by running `python2 -m SimpleHTTPServer` and then going to `http://localhost:8000/manual_tests.html` in a browser.

There is also an attempt at automated tests in the tests folder but running it with nodejs does not work because this project is bundled. An attempt at bundling the tests as well is in `esbuild-tests.js` which should work someday, but more work needs to be done.

## SDK Error Handling

Errors are thrown as exceptions when something has gone wrong. Errors are objects with a message, name, and errorCode. Possible codes are documented below.

|error code    |reason    |
|-|----|
|access_control_conditions_check_failed|The Lit nodes failed to check the condition. This means that the Lit nodes could not talk to the chain to check the condition. This could be because the RPC servers are down, or because the condition is making an incorrect smart contract call that reverts.|
|encrypted_symmetric_key_not_found|Could not find the encrypted symmetric key you passed in. You should have already called saveEncryptionKey which returned the encrypted symmetric key.|
|exp_wrong_or_too_large|When signing a JWT, the EXP is too large or wrong. This usually means that your system clock is wrong. Please check it and make sure it is set accurately for your timezone.
|iat_outside_grace_period|When signing a JWT, the IAT is outside the grace period. This usually means that your system clock is wrong. Please check it and make sure it is set accurately for your timezone.
|incorrect_access_control_conditions|The access control conditions you passed in do not match the ones that were set by the condition creator for this resourceId or encryptedSymmetricKey.
|invalid_auth_sig|The auth_sig passed to the nodes is invalid or could not be verified. Make sure that you are passing the correct auth_sig.
|invalid_unified_condition_type|In a unified access control condition, you passed an invalid `conditionType`. Check the docs to see what valid types are: https://developer.litprotocol.com/docs/accesscontrolconditions/unifiedaccesscontrolconditions/
|lit_node_client_not_ready|The Lit node client is not ready. This means that the Lit node client is not connected to the Lit network. You should run `await litNodeClient.connect()` before calling any other methods that use the Lit Node Client.
|missing_access_control_conditions|You must pass either access_control_conditions or evm_contract_conditions or sol_rpc_conditions, and you did not pass these things to the nodes.
|not_authorized|Thrown when the user does not have access to decrypt or is unauthorized to receive a JWT for an item.
|resource_id_not_found|Could not find the resource ID you passed in. You should have already called saveSigningCondition with the exact same resource ID.
|rpc_error|The Lit Node(s) could not complete the RPC call. This could be because the RPC servers are down, or because the RPC call is making an incorrect smart contract call that reverts.
|storage_error|An error occurred storing the condition. This usually means that you tried to update a permanent condition, or you tried to update a non-permanent condition from the wrong account. Only the creator of a condition can update it, and only if \"permanent\": false was originally passed in when storing the condition.
|wrong_network|The user is on the wrong network. For example, this may mean the user has ethereum selected in their wallet but they were trying to use polygon for the current operation.
|unknown_error|An unknown error has occurred. Please contact us on Discord to report this error.|

## Wallet Error Handling

Metamask and other wallets throw errors themselves. The format for those exceptions can be found here: https://docs.metamask.io/guide/ethereum-provider.html#errors
