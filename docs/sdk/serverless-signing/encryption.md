import FeedbackComponent from "@site/src/pages/feedback.md";

# Decrypting and Combining Within an Action

:::info
    Only available on the `cayenne` network
:::

## Overview

Within a Lit action, you may choose to `encrypt` from within the context of an action. Encryption within the action may be useful if you do not wish to provide context on the encryption material to the client. Keeping all context on the encryption operation within the Trusted Execution Enviorment (TEE).

::: note
The Lit Action implementation of `encrypt` will not return the `dataToEncryptHash`. This can be created with the `crypto.subtle.digest` implementation by specifying the `SHA-256` hashing option if your use case requires the message hash.
:::

# Encrypting content

```js
    const accessControlConditions = [
        {
            contractAddress: '',
            standardContractType: '',
            chain,
            method: 'eth_getBalance',
            parameters: [':userAddress', 'latest'],
            returnValueTest: {
            comparator: '>=',
            value: '0',
            },
        },
    ];
    const message = 'Hello world';
    const client = new LitNodeClient({
        litNetwork: 'cayenne'
    });
    
    await client.connect();

    const code =`(async () => {
        let ciphertext = Lit.Actions.encrypt({
            accessControlConditions,
            to_encrypt: dataToEncrypt
        });
        // your logic for processing the ciphertext
    }))();`;
    const res = await LitJsSdk.executeJs({
        sessionSigs: {}, // your session
        code,
        jsParams: {
            accessControlConditions,
            dataToEncrypt: message,
        }
    });
```
