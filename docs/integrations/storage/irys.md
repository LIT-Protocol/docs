# Irys

## Encrypting on-chain data (server-side)

Learn how to encrypt data before storing on-chain on [Irys](https://irys.xyz/).

---

import FeedbackComponent from "@site/src/pages/feedback.md";

## Objectives

At completion of this reading you should be able to:

- Encrypt data using Lit Protocol.
- Establish a set of rules determining who can decrypt the data.
- Store encrypted data on Arweave using Irys.
- Decrypt data using Lit Protocol.

---

## What is [Irys](https://irys.xyz/)?

Irys is a provenance layer that enables users to scale permanent data and precisely attribute its origin. By tracing and verifying where data comes from, Irys paves the way to incorporate accountability into all information.

Data uploaded to Irys is stored permanently on Arweave. Once on Arweave, this data becomes publicly accessible, anyone can view it. For projects where privacy is a concern, you can use Lit to encrypt your data before storing it on Irys.

All of the code from this guide is also contained in [GitHub repository](https://github.com/irys-xyz/irys-lit).

## Dependencies

To follow along with this guide, you will need to install the following using npm:

```bash
npm install @irys/sdk @lit-protocol/lit-node-client-nodejs@^3 dotenv ethers@^5 siwe@^2.1.4
```

or yarn:

```bash
yarn add @irys/sdk @lit-protocol/lit-node-client-nodejs@^3 dotenv ethers@^5 siwe@^2.1.4
```

## Imports

To run the code in this project, you'll need to import the following:

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import Irys from "@irys/sdk";
import ethers from "ethers";
import siwe from "siwe";
import dotenv from "dotenv";
dotenv.config();
```

## Encrypting data

![Encrypting data with Irys and Lit](/img/irys-images/encrypting.png)

There are three steps to encrypting data

- Connect to Lit nodes
- Define [access control conditions](../../sdk/access-control/intro.md) for who can decrypt your data
- Request Lit nodes to encrypt your data

### Connecting to Lit nodes

Write a helper function to connect to a Lit node:

```js
async function getLitNodeClient() {
  // Initialize LitNodeClient
  const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
    alertWhenUnauthorized: false,
    litNetwork: "datil-dev",
  });
  await litNodeClient.connect();

  return litNodeClient;
}
```

### Access control conditions

Lit Protocol enables users to set [access control conditions](../../sdk/access-control/intro.md) specifying who can decrypt data. This provides builders with the flexibility to designate data decryption permissions, including:

- A single wallet address
- DAO membership
- Owners of an ERC20 or ERC721
- Outcomes from a smart contract call
- Outcomes from an API call

To ensure anyone can run the code in this repository, it uses the following for access control, allowing anyone with an ETH balance `>=` 0 to decrypt. More details on the different types of [access control conditions supported](../../sdk/access-control/intro.md).

```ts
// This defines who can decrypt the data
function getAccessControlConditions() {
  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0", // 0 ETH, so anyone can open
      },
    },
  ];

  return accessControlConditions;
}
```

:::info
Using Lit, the access control conditions provide near infinite flexibility. Imagine a system for government
bid management: bids are required to be submitted by a specific deadline, tracked using Irys' millisecond-accurate
timestamps. The bids remain encrypted up to this deadline, aiding in preventing corruption by ensuring the bids are
inaccessible to all parties until the designated time.
:::

### Encrypt data

Finally, write a function that accepts a string and uses the code we wrote earlier to encrypt it. In this guide we're using the Lit function [`encryptString()`](https://lit-js-sdk-v3-api-docs.vercel.app/functions/encryption_src.encryptString.html) which encrypts a string and returns both the encrypted string and a hash of the original string. Lit also has[`encryptFile()`](https://lit-js-sdk-v3-api-docs.vercel.app/functions/encryption_src.encryptFile.html) for encrypting files directly.

```js
async function encryptData(dataToEncrypt) {
  const accessControlConditions = getAccessControlConditions();
  const litNodeClient = await getLitNodeClient();

  // 1. Encryption
  // <Blob> encryptedString
  // <Uint8Array(32)> dataToEncryptHash
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions,
      dataToEncrypt: dataToEncrypt,
      chain: "ethereum",
    },
    litNodeClient
  );
  return [ciphertext, dataToEncryptHash];
}
```

## Storing on Arweave via Irys

To use Irys to store data on Arweave, first connect to an [Irys node](https://arweave-tools.irys.xyz/irys-sdk/irys-in-the-browser#connecting-to-a-node). This function uses the same private key from our `.env` file and connects to the Irys Devnet where uploads are stored for 60 days. In a production environment, you would change this to use Irys' [Node 1 or 2](https://arweave-tools.irys.xyz/irys-sdk/irys-in-the-browser#connecting-to-a-node) where uploads are permanent.

:::info
This code is configured to MATIC to pay for uploads, and while working with the Irys Devnet, you need to fund your
wallet with [free MUMBAI MATIC Devnet](https://www.alchemy.com/dapps/mumbai-faucet) tokens. Alternatively, you could use [any other
Devnet token](../../resources/supported-chains) supported by Irys.
:::

```js
async function getIrys() {
  const url = "https://devnet.irys.xyz";
  const providerUrl = "https://rpc-mumbai.maticvigil.com";
  const token = "matic";

  const irys = new Irys({
    url, // URL of the node you want to connect to
    token, // Token used for payment
    key: process.env.PRIVATE_KEY, // Private key
    config: { providerUrl }, // Optional provider URL, only required when using Devnet
  });
  return irys;
}
```

Then write a function that takes the encrypted data, the original data hash, the access control conditions, and stores it all on Arweave using Irys.

Irys' upload function returns [a signed receipt](https://arweave-tools.irys.xyz/overview/receipts) containing the exact time (in milliseconds) of the upload and also a transaction ID, which can then be used to [download the data from a gateway](https://arweave-tools.irys.xyz/overview/downloading).

:::info
For simplicity, we'll consolidate all three values into a JSON object and upload it to Irys in one transaction. This
is a design choice; you have the flexibility to store these values as you see fit in your own implementation.
:::

```js
async function storeOnIrys(cipherText, dataToEncryptHash) {
  const irys = await getIrys();

  const dataToUpload = {
    cipherText: cipherText,
    dataToEncryptHash: dataToEncryptHash,
    accessControlConditions: getAccessControlConditions(),
  };

  let receipt;
  try {
    const tags = [{ name: "Content-Type", value: "application/json" }];
    receipt = await irys.upload(JSON.stringify(dataToUpload), { tags });
  } catch (e) {
    console.log("Error uploading data ", e);
  }

  return receipt?.id;
}
```

## Decrypting data

![Decrypting data with Irys and Lit](/img/irys-images/decrypting.png)

There are four steps to decrypting data:

- Retrieve data stored on Arweave
- Connect to Lit nodes
- Obtain [Session signatures](../../sdk/authentication/session-sigs/intro), which authenticates you with the Lit network
- Request Lit nodes to decrypt your data

### Retrieving data from Arweave using the Irys gateway

To download data stored on Arweave, the easiest way is to connect to a [gateway](https://docs.irys.xyz/overview/gateways) and request the data using your transaction ID. In this example, we'll use the Irys gateway.

This function downloads the data JSON object, parses out the three values and returns them as an array of strings.

```js
async function retrieveFromIrys(id) {
  const gatewayAddress = "https://gateway.irys.xyz/";
  const url = `${gatewayAddress}${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to retrieve data for ID: ${id}`);
    }

    const data = await response.json();
    return [
      data.cipherText,
      data.dataToEncryptHash,
      data.accessControlConditions,
    ];
  } catch (e) {
    console.log("Error retrieving data ", e);
  }
}
```

### Obtain a Session Sigs

In order to interact with the nodes in the Lit Network, you will need to generate and present session signatures. The easiest way to do this is to generate a `SessionSigs`. 

`SessionSigs` are produced by a ed25519 keypair that is generated randomly on the browser and stored in local storage. We need to obtain an `AuthSig` through an authentication method like Ethereum wallet in order to get a `SessionSigs` from Lit Nodes.

The session keypair is used to sign all requests to the Lit Nodes, and the user's `AuthSig` is sent along with the request, attached as a "capability" to the session signature. Each node in the Lit Network receives a unique signature for each request, and can verify that the user owns the wallet address that signed the capability.

Please refer to the [Get Session Sigs](../../sdk/authentication/session-sigs/get-session-sigs.md) documentation to see how to obtain a Session Sig.

### Decrypting data

Finally, we decrypt the data using Lit's [`decryptString()`](https://lit-js-sdk-v3-api-docs.vercel.app/functions/encryption_src.encryptString.html) function.

```js
async function decryptData(
  ciphertext,
  dataToEncryptHash,
  accessControlConditions
) {
  const sessionSigs = await getSessionSignatures();
  const litNodeClient = await getLitNodeClient();

  let decryptedString;
  try {
    decryptedString = await LitJsSdk.decryptToString(
      {
        sessionSigs,
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        chain: "ethereum",
      },
      litNodeClient
    );
  } catch (e) {
    console.log(e);
  }

  return decryptedString;
}
```

## Main function

Finally, write a `main()` function that calls the calls our encrypt, store and decrypt code.

```js
async function main() {
  const messageToEncrypt = "Irys + Lit is 🔥x2";

  // 1. Encrypt data
  const [cipherText, dataToEncryptHash] = await encryptData(messageToEncrypt);

  // 2. Store cipherText and dataToEncryptHash on Irys
  const encryptedDataID = await storeOnIrys(cipherText, dataToEncryptHash);

  console.log(`Data stored at https://gateway.irys.xyz/${encryptedDataID}`);

  // 3. Retrieve data stored on Irys
  // In real world applications, you could wait any amount of time before retrieving and decrypting
  const [
    cipherTextRetrieved,
    dataToEncryptHashRetrieved,
    accessControlConditions,
  ] = await retrieveFromIrys(encryptedDataID);
  // 4. Decrypt data
  const decryptedString = await decryptData(
    cipherTextRetrieved,
    dataToEncryptHashRetrieved,
    accessControlConditions
  );
  console.log("decryptedString:", decryptedString);
}

main();
```

## Getting support

If you have questions while building, make sure to reach out to the Lit development team on [Discord](https://litgateway.com/discord).

Questions about Irys? Go to the [Irys Discord](https://discord.irys.xyz) to get in touch.

<FeedbackComponent/>
