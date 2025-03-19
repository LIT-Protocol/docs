import FeedbackComponent from "@site/src/pages/feedback.md";

# Decrypting and Combining Within an Action

:::info
    Only available on the Lit networks:
        - `datil`
        - `datil-test`
        - `datil-dev` 
:::

## Overview

Within a Lit action, you may choose to `encrypt` from within the context of an action. Encryption within the action may be useful if you do not wish to provide context on the encryption material to the client. Keeping all context on the encryption operation within the Trusted Execution Environment (TEE).

::: note
The Lit Action implementation of `encrypt` will not return the `dataToEncryptHash`. This can be created with the `crypto.subtle.digest` implementation by specifying the `SHA-256` hashing option if your use case requires the message hash.
:::

## Using IPFS ID as an Access Control Parameter

The ID will be included in the access control check when you use `decryptAndCombine` in an action. It's best to use the `currentActionIpfsId` when you want to share encrypted content that only a specific implementation can decrypt. This is useful for situations where you want to restrict access to sensitive information, like an API key, so that it can only be decrypted by a specific Lit Action. This way, the content will only be decrypted when `decryptAndCombine` is called within that action, keeping your credentials secure within the TEE (Trusted Execution Environment) of the Lit Network.


```js
{
  contractAddress: '',
  standardContractType: '',
  chain,
  method: 'eth_getBalance',
  parameters: [':currentActionIpfsId', 'latest'],
  returnValueTest: {
    comparator: '==',
    value: '<your ipfs cid>',
  },
}
```


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
        litNetwork: "datil-dev"
    });
    
    await client.connect();

    const code =`(async () => {
        let { ciphertext, dataToEncryptHash } = Lit.Actions.encrypt({
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
