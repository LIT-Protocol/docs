import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Making Your First Decryption Request

This guide will walk you through the process of encrypting and decrypting data with Lit. 

The configuration includes: connecting to the Lit network, defining access control conditions, encrypting your data, and finally decrypting your data. You can use the provided code snippets to execute this on your own machine.

Lit encrypts your data and enforce who is allowed to decrypt it, but storing the ciphertext and metadata is up to you, whether this be the IPFS, Arweave, or a centralized database.

This guide uses Lit's [Datil-dev Network](../../learn/overview/how-it-works/lit-networks/testnets.md) which is designed for application developers aiming to get familiar with the Lit SDK. Payment is not required on this network, and therefore the code is less complex. For those aiming to build production-ready applications, the [Datil-test Network](../../learn/overview/how-it-works/lit-networks/testnets.md) is recommended. Once ready, these applications can then be deployed on [Datil](../../learn/overview/how-it-works/lit-networks/mainnets.md), the Lit production network.

For developers looking to explore beyond the basics, check out our advanced examples of encryption [here](Link TBD).

## Installing the Lit SDK

To get started with Encryption and the Lit SDK, you'll need to install these packages:

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

Encrypting and decrypting with Lit requires an active connection to the Lit network. This can be done by initializing a [LitNodeClient](./connecting-to-lit.md) instance, which will establish a connection to the Lit nodes.

We will also be initializing an Ethereum wallet using the `ETHEREUM_PRIVATE_KEY` environment variable, which is required for generating session signatures in this example.

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

Access Control Conditions are used to define who is allowed to decrypt the data. Once the specified conditions are met, the decryption will be successful. More on Access Control Conditions (ACCs) can be found [here](link TBD).

The ACCs in this example will do a comparison of the Ethereum address of the wallet trying to decrypt the data, and the address specified in the ACC. If the two match, the decryption will be successful.

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
        value: ethersWallet.address,
        },
    },
];
```

</p>
</details>

### Encrypting Data

The Lit SDK has many methods for encrypting data, which you can find [here](https://v6-api-doc-lit-js-sdk.vercel.app/modules/encryption_src.html). In this example, we'll use the `encryptString` method.

We first defined the string we want to encrypt, stored as the `toEncrypt` variable. We then used the `encryptString` method to encrypt the data, taking the `accessControlConditions` and `dataToEncrypt` as parameters. The `encryptString` method returns an object containing the `ciphertext` and `dataToEncryptHash`. The `dataToEncryptHash` is the hash of the encrypted data, and can be used to verify the integrity of the data. The `ciphertext` is the encrypted data itself.

<details>
<summary> Click here to see how this is done</summary>
<p>

```ts
const data = "The answer to the universe is 41.";

const { ciphertext, dataToEncryptHash } = await encryptString(
    {
        accessControlConditions,
        dataToEncrypt: data,
    },
    litNodeClient
);
```

<p>
</details>

### Generating Session Signatures

Session Signatures are used to authenticate and maintain an active connection to the nodes in the Lit network. They are required when performing decryption or any other functionality (i.e. signing) with Lit. An introduction to Session Signatrues and authenticating with the Lit network can be found [here](./authenticating-with-lit.md).

In this case, we can use the `generateResourceString` method to generate the resource string for our encrypted data. This method restricts the decryption permissions of the session, allowing it to only decrypt the data if the ACCs and `dataToEncryptHash` match.
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

Now that we have the Session Signatures, we can use the `decryptToString` method to decrypt the data. Like encryption, the Lit SDK has many methods for decrypting data, which you can find [here](https://v6-api-doc-lit-js-sdk.vercel.app/modules/encryption_src.html).

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

Our `decryptionResult` will be the decrypted data, which in this case is the string we defined earlier: `The answer to the universe is 41.`

# Learn More

By now you should have successfully encrypted and decrypted data with Lit. If you’d like to learn more about what’s possible with Lit's encryption and more specialized Access Control Conditions, check out the [Advanced Topics](link TBD) section.

<FeedbackComponent/>


