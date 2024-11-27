---
description: Learn how to make your first decryption request with the Lit Network
sidebar_label: Your First Decryption Request
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Making Your First Decryption Request

This guide will walk you through the process of encrypting and decrypting data with Lit. 

We will cover: 

- Connecting to the Lit network
- Defining Access Control Conditions (ACCs)
- Encrypting your data
- Decrypting your data

You can use the provided code snippets to execute this code on your own machine.

This guide uses Lit's [Datil-dev Network](../../learn/overview/how-it-works/lit-networks/testnets.md), a free test network designed for developers to familiarize themselves with the Lit SDK. Since no payment is required, the code is less complex. For building production-ready applications, the [Datil-test Network](../../learn/overview/how-it-works/lit-networks/testnets.md) is recommended. Once your application is ready for deployment, you can move it to [Datil](../../learn/overview/how-it-works/lit-networks/mainnets.md), the Lit production network.

:::info
For more in-depth guides on Lit's encryption capabilities, please see the [Encryption](../encryption/overview.md) section.
:::

## Installing the Example Dependencies

To start encrypting with the Lit SDK, you'll need to install these packages:

- `@lit-protocol/lit-node-client`: The core Lit SDK package.
- `@lit-protocol/constants`: A package containing useful constants across the SDK.
- `@lit-protocol/auth-helpers`: A package containing useful functions for generating Session Signatures and authentication.
- `ethers@v5`: A package for interacting with Ethereum, required for wallet operations.

<Tabs
defaultValue="npm"
values={[
{label: 'npm', value: 'npm'},
{label: 'yarn', value: 'yarn'},
]}>
<TabItem value="npm">

```bash
npm install @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
ethers@v5
```

</TabItem>
</Tabs>

If you're just getting started with Lit or development in general, we recommend taking a look at our [Starter Guides](https://github.com/LIT-Protocol/developer-guides-code/tree/master/starter-guides). These guides provide an environment for getting started with the Lit SDK.

## Walkthrough

### Connecting to the Lit Network

As covered in the [Connecting to Lit](./connecting-to-lit) guide, encrypting and decrypting with Lit requires an active connection to the Lit network. This is achieved by initializing a [LitNodeClient](./connecting-to-lit.md) instance, which connects to Lit nodes.

Additionally, we'll initialize an Ethereum wallet using the `ETHEREUM_PRIVATE_KEY` environment variable. This wallet is essential for generating session signatures, which authenticate your requests with the Lit network.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import { LitNodeClient, encryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilDev,
  debug: false
});
await litNodeClient.connect();

const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY!, // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

</p>
</details>

### Defining Access Control Conditions

Access Control Conditions (ACCs) define the rules for who can decrypt your data. In this example, the ACCs specify that only a user with owns a specific Ethereum address can decrypt the data. If the address of the decrypting wallet matches the one in the ACCs, decryption proceeds successfully. You can learn more about ACCs [here](../access-control/overview.md).

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
const accessControlConditions = [
    {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
        comparator: "=",
        value: ethersWallet.address, // <--- The address of the wallet that can decrypt the data
        },
    },
];
```

</p>
</details>

### Encrypting Data

The Lit SDK offers several methods for encrypting data, which you can explore [here](https://v6-api-doc-lit-js-sdk.vercel.app/modules/encryption_src.html). In this example, we'll use the [encryptString](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) method.

We start by defining the string we want to encrypt, stored in the `dataToEncrypt` variable. Using the `encryptString` method, we encrypt the data by providing the `accessControlConditions` (ACCs) and `dataToEncrypt` as parameters. This method returns an object containing:

- `ciphertext`: The encrypted data.
- `dataToEncryptHash`: A hash of the original data combined with the `accessControlConditions`, used to verify data integrity.

<details>
<summary> Click here to see how this is done</summary>
<p>

```ts
const dataToEncrypt = "The answer to the universe is 42.";

const { ciphertext, dataToEncryptHash } = await encryptString(
    {
        accessControlConditions,
        dataToEncrypt,
    },
    litNodeClient
);
```

</p>
</details>

### Generating Session Signatures

As covered in the [Authenticating a Session](./authenticating-a-session) guide, Session Signatures authenticate your interactions with the Lit network and are essential for decryption and other functionalities like signing.

In this step, we'll generate Session Signatures that grant permission to decrypt our specific piece of data. We use the `generateResourceString` method to create a unique resource identifier based on our ACCs and the `dataToEncryptHash`. This ensures the session can only decrypt data that matches these parameters.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import {
  createSiweMessage,
  generateAuthSig,
  LitAbility,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";

const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    resourceAbilityRequests: [
        {
            resource: new LitAccessControlConditionResource(
                await LitAccessControlConditionResource.generateResourceString(
                    accessControlConditions,
                    dataToEncryptHash
                )
            ),
            ability: LitAbility.AccessControlConditionDecryption,
        },
    ],
    authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
        }) => {
        const toSign = await createSiweMessage({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: ethersWallet.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
        });

        return await generateAuthSig({
            signer: ethersWallet,
            toSign,
        });
    },
});
```
</p>
</details>

### Decrypting Data

With the generated Session Signatures, we can proceed to decrypt the data using the `decryptToString` method. This method sends a decryption request to the Lit network, which verifies your permissions based on the ACCs and Session Signatures.

If all conditions are met, the data is decrypted and returned as a string. You can explore other decryption methods [here](https://v6-api-doc-lit-js-sdk.vercel.app/modules/encryption_src.html).

<details>
<summary> Click here to see how this is done</summary>
<p>

```ts
const decryptionResult = await decryptToString(
  {
      chain: "ethereum",
      ciphertext,
      dataToEncryptHash,
      accessControlConditions,
      sessionSigs,
  },
  litNodeClient
);
```

</p>
</details>

Our `decryptionResult` will be the decrypted data, which in this case is the string we defined earlier:

 `The answer to the universe is 42.`

# Learn More

By now you should have successfully encrypted and decrypted data with Lit. If you’d like to learn more about what’s possible with Lit's encryption and more specialized Access Control Conditions, visit the [Encryption](../encryption/overview.md) and [Access Control](../access-control/overview.md) sections.

<FeedbackComponent/>


