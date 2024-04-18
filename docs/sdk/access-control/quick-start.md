# Quick Start

## Start Here

You can use the Lit network to encrypt your data and store it privately on the open web. This guide will show you how you can encrypt a simple message with Lit, create an Access Control Condition (ACC), and permit decryption by users who meet the condition you set.

Lit can only be used to generate and store encryption keys, so you will need to store the ciphertext and metadata yourself using your storage provider of choice (such as IPFS, Arweave, or even a centralized storage solution). Once your data has been encrypted, the Lit network will enforce who is allowed to decrypt it.

This guide uses Lit's [Habanero Network](../../network/networks/mainnet.md), the Mainnet Beta, which is designed for application developers aiming to build **production-ready** applications. For those developing in a test environment, the Manzano Network is recommended. More on Lit networks [here](../../network/networks/testnet.md).

For developers looking to explore beyond the basics, check out Advanced Topics.

## Install and Import the Lit SDK

Ensure you have the following requirements in place:

1. Operating System: Linux, Mac OS, or Windows.
2. Development Environment: You'll need an Integrated Development Environment (IDE) installed. We recommend Visual Studio Code.
3. Languages: The Lit JS SDK V4 supports JavaScript. Make sure you have the appropriate language environment set up.
4. Internet Connection: A stable internet connection is required for installation, updates, and interacting with the Lit nodes.

Install the `@lit-protocol/lit-node-client` package, which can be used in both browser and Node environments:

```jsx
yarn add @lit-protocol/lit-node-client

```

OR

```jsx
npm i @lit-protocol/lit-node-client
```
:::note
If you are using `NodeJS` you should install `@lit-protocol/lit-node-client-nodejs`
:::

Use the **Lit JS SDK V4**:

```jsx
import * as LitJsSdkfrom "@lit-protocol/lit-node-client";

```

:::note
You should use **at least Node v16.16.0** because of the need for the **webcrypto** library.
:::

### Client-Side Usage

Within a file (in the Lit example repos it will likely be called `lit.js`), set up your Lit object.

`client.connect()` will return a promise that resolves when you are connected to the Lit Network.

```jsx
const client =new LitJsSdk.LitNodeClient({
  litNetwork: 'habanero',
});

await client.connect();
```

### Server-Side Usage

In this example stub, the litNodeClient is stored in a global variable `app.locals.litNodeClient` so that it can be used throughout the server. `app.locals` is provided by **[Express](https://expressjs.com/)** for this purpose. You may have to use what your own server framework provides for this purpose, instead.

:::note
Keep in mind that in the server-side implementation, the client class is named LitNodeClientNodeJs.
:::

`client.connect()` returns a promise that resolves when you are connected to the Lit network.

```jsx
app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: 'habanero',
});
await app.locals.litNodeClient.connect();

```

The litNodeClient listens to network state, and those listeners will keep your Node.js process running until you explicitly disconnect from the Lit network. To stop the litNodeClient listeners and allow node to exit gracefully, call `client.disconnect()` and

`await app.locals.litNodeClient.disconnect()` .

## Performing Encryption

To encrypt something with Lit, you’ll need to follow these steps:

1. Obtain an `authSig` and create an access control condition.
2. Encrypt the static content (string, file, zip, etc...) using `LitJsSdk.encryptString` to get the `ciphertext` and `dataToEncryptHash`.
3. Finally, store the `ciphertext`, `dataToEncryptHash` and other metadata (`accessControlConditions` or other conditions such as`evmContractConditions`) and `chain` using your storage provider of choice. 

### Create an Access Control Condition

In this example, our ACC will check if a wallet (`:userAddress`) has at least `0.000001 ETH` on `ethereum` at the `latest` block:

```jsx
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];
```

### Obtain an Auth Sig

In order to interact with the nodes in the Lit Network, you will need to generate and present signatures. The easiest way to do this is to generate an `AuthSig` . You can use any signature compliant with [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361), also known as Sign in with Ethereum (SIWE) for this. 

#### Obtaining an `AuthSig` in the browser

The Lit SDK `checkAndSignAuthMessage()` function provides a convenient way to obtain an `AuthSig` from an externally-owned account in a browser environment.

```jsx
const nonce = litNodeClient.getLatestBlockhash();

const authSig = await checkAndSignAuthMessage({
  chain: "ethereum",
  nonce,
});
```

:::note

Be sure to use the latest block hash from the `litNodeClient` as the nonce. You can get it from the `litNodeClient.getLatestBlockhash()`. Without the block hash AuthSigs will not be validated.

:::

#### Obtaining an `AuthSig` on the server-side

If you want to obtain an `AuthSig` on the server-side, you can instantiate an `ethers.Signer` to sign a SIWE message, which will produce a signature that can be used in an `AuthSig` object.

:::note
The nonce should be the latest Ethereum block hash returned by the nodes during the handshake. 
:::

```jsx
const LitJsSdk = require('@lit-protocol/lit-node-client-nodejs');
const { ethers } = require("ethers");
const siwe = require('siwe');

  let nonce = litNodeClient.getLatestBlockhash();

  // Initialize the signer
  const wallet = new ethers.Wallet('<Your private key>');
  const address = ethers.getAddress(await wallet.getAddress());

  // Craft the SIWE message
  const domain = 'localhost';
  const origin = 'https://localhost/login';
  const statement =
    'This is a test statement.  You can put anything you want here.';
    
  // expiration time in ISO 8601 format.  This is 7 days in the future, calculated in milliseconds
  const expirationTime = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7 * 10000
  ).toISOString();
  
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce,
    expirationTime,
  });
  const messageToSign = siweMessage.prepareMessage();
  
  // Sign the message and format the authSig
  const signature = await wallet.signMessage(messageToSign);

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: address,
  };

  console.log(authSig);
}

main();
```

### Encryption

To encrypt a string, use one of the following functions:

- [encryptString()](https://v3.api-docs.getlit.dev/functions/encryption_src.encryptString.html) - Used to encrypt the raw string.
- [zipAndEncryptString()](https://v3.api-docs.getlit.dev/functions/encryption_src.zipAndEncryptString.html) - Compresses the string (using [JSZip](https://www.npmjs.com/package/jszip)) before encrypting it. This is useful for saving space, but takes additional time to perform the zip.

To encrypt a file, use:

- [encryptFile()](https://v3.api-docs.getlit.dev/functions/encryption_src.encryptFile.html) - Used to encrypt a file without doing any zipping or packing. Because zipping larger files takes time, this function is useful when encrypting large files ( > 20mb). This also requires that you store the file metadata.
- [encryptFileAndZipWithMetadata()](https://v3.api-docs.getlit.dev/functions/encryption_src.encryptFileAndZipWithMetadata.html) - Used to encrypt a file and then zip it up with the metadata (using [JSZip](https://www.npmjs.com/package/jszip)). This is useful for when you don't want to store the file metadata separately.
- [zipAndEncryptFiles()](https://v3.api-docs.getlit.dev/functions/encryption_src.zipAndEncryptFiles.html) - Used to zip and encrypt multiple files. This does **not** include the file metadatas in the zip, so you must store those yourself.

Encryption can be performed entirely client-side and doesn't require making a request to the Lit nodes.

In this example, we are using `encryptString()`:

:::note

All encryption functions will output the `ciphertext` and a hash of the plaintext data (`dataToEncryptHash`) as base64 encoded strings, both of which are used during decryption.

:::

```jsx
const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
  {
    accessControlConditions,
    authSig,
    chain: "ethereum",
    dataToEncrypt: "this is a secret message",
  },
  litNodeClient
);
```

:::note

Both `ciphertext` and `dataToEncryptHash` will be base64 encoded strings.

:::

### Putting it all together

Your complete encryption function should look like:

```jsx
async encrypt(message: string) {
  if (!this.litNodeClient) {
    await this.connect()
  }

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ ethereum })
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions,
      authSig,
      chain: 'ethereum',
      dataToEncrypt: 'this is a secret message',
    },
    litNodeClient,
  );

  return {
    ciphertext,
    dataToEncryptHash,
  };
}
```

## Performing Decryption

Make sure we have `accessControlConditions`, `ciphertext`, and the `dataToEncryptHash` data we created during the encryption step. An exception is when using `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There is just one step:

1. Obtain the decrypted data in plaintext using the `authSig`, `accessControlConditions`, `ciphertext`, and `dataToEncryptHash` by calling `LitJsSdk.decryptToString`.

### Obtain an Auth Sig

In order to interact with the nodes in the Lit Network, you will need to generate and present signatures. The easiest way to do this is to generate an `AuthSig` . You can use any signature compliant with EIP-4361, also known as Sign in with Ethereum (SIWE) for this. 

#### Obtaining an `AuthSig` in the browser

The Lit SDK `checkAndSignAuthMessage()` function provides a convenient way to obtain an `AuthSig` from an externally-owned account in a browser environment.

```jsx
const authSig = await checkAndSignAuthMessage({
  chain: "ethereum",
  nonce,
});
```

:::note

Be sure to use the latest blockhash from the `litNodeClient` as the nonce. You can get it from the `litNodeClient.getLatestBlockhash()`.

:::

#### Obtaining an `AuthSig` on the server-side

If you want to obtain an `AuthSig` on the server-side, you can instantiate an `ethers.Signer` to sign a SIWE message, which will produce a signature that can be used in an `AuthSig` object.

:::note
The nonce should be the latest Ethereum blockhash returned by the nodes during the handshake. 
:::

```jsx
const LitJsSdk = require('@lit-protocol/lit-node-client-nodejs');
const { ethers } = require("ethers");
const siwe = require('siwe');

  let nonce = litNodeClient.getLatestBlockhash();

  // Initialize the signer
  const wallet = new ethers.Wallet('<Your private key>');
  const address = ethers.getAddress(await wallet.getAddress());

  // Craft the SIWE message
  const domain = 'localhost';
  const origin = 'https://localhost/login';
  const statement =
    'This is a test statement.  You can put anything you want here.';
    
  // expiration time in ISO 8601 format.  This is 7 days in the future, calculated in milliseconds
  const expirationTime = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7 * 10000
  ).toISOString();
  
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce,
    expirationTime,
  });
  const messageToSign = siweMessage.prepareMessage();
  
  // Sign the message and format the authSig
  const signature = await wallet.signMessage(messageToSign);

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: messageToSign,
    address: address,
  };

  console.log(authSig);
}

main();
```

## Mint Capacity Credits and Delegate Usage

In order to execute a transaction with Lit, you’ll need to reserve capacity on the network using Capacity Credits. These allow holders to reserve a set number of requests (requests per second) over a desired period of time (i.e. one week). You can mint a Capacity Credit NFT using the `contracts-sdk` in a couple of easy steps. 

The first step is to initialize a signer. This should be a wallet controlled by your application and the same wallet you’ll use to mint the Capacity Credit NFT:

```jsx
const walletWithCapacityCredit = new Wallet("<your private key or mnemonic>");
let contractClient = new LitContracts({
  signer: dAppOwnerWallet,
  network: 'habanero',
});

await contractClient.connect();
```

After you’ve set your wallet, your next step is to mint the NFT:

```jsx

// this identifier will be used in delegation requests. 
const { capacityTokenIdStr } = await contractClient.mintCapacityCreditsNFT({
  requestsPerKilosecond: 80,
  // requestsPerDay: 14400,
  // requestsPerSecond: 10,
  daysUntilUTCMidnightExpiration: 2,
});
```

In the above example, we are configuring 2 properties:

- `requestsPerDay` - How many requests can be sent in a 24 hour period.
- `daysUntilUTCMidnightExpiration` - The number of days until the nft will expire. expiration will occur at `UTC Midnight` of the day specified.

Once you mint your NFT you will be able to send X many requests per day where X is the number specified in `requestsPerDay`. Once the `Capacity Credit` is minted the `tokenId` can be used in delegation requests.

### Delegate usage of your NFT

Once you have minted a Capacity Credits NFT, you can delegate usage of it to the PKP we minted earlier. This will allow the delegatee address(es) to use it to make requests to the Lit nodes (in this case, to make a decryption request).

```jsx
const { capacityDelegationAuthSig } =
  await litNodeClient.createCapacityDelegationAuthSig({
    uses: '1',
    signer: wallet,
    capacityTokenId: capacityTokenIdStr,
    delegateeAddresses: [walletAddress],
  });
```

To delegate your Rate Limit NFT there are 4 properties to configure:

- `uses` - How many times the delegation may be used
- `dAppOwnerWallet` - The owner of the wallet as an `ethers Wallet instance`
- `capacityTokenId` - The `token identifier` of the Rate Limit NFT
- `delegateeAddresses` - The wallet addresses which will be delegated to

:::note
The `delegateeAddress` parameter is optional. If omitted, anyone can use your `capacityDelegationAuthSig` to use your app without restrictions. In this case, you can utilize other restrictions like the `uses` param to limit the amount of usage by your users.
:::

Check out a complete example [here](https://github.com/LIT-Protocol/js-sdk/blob/1286138adc09ac2d34371f3ac12a9088ada367ec/e2e-nodejs/group-rli/test-rli-from-lit-node-client-diff-delegatee.mjs).

### Using a delegated `AuthSig`  from a backend

If using a `mainnet` in order to keep the wallet which holds the `Capacity Credit NFT` secure it is recommended to call `createCapacityDelegationAuthSig` from `LitNodeClient` in a backend context. There are a few recommended web servers you can use in order to host an api endpoint which can return the `capacityDelegationAuthSig` . Some links are provided below to help get started:

- [ExpressJS](https://www.npmjs.com/package/express)
- [Node HTTP server](https://nodejs.org/api/http.html#http)

### Decryption

In the example, we used `encryptString()` to encrypt so we will use `decryptToString()` to decrypt. Pass in the data  `accessControlConditions`, `ciphertext`, `dataToEncryptHash`, and `authSig`.

:::note

If you want to use another LitJsSDK encryption method to encrypt content, you will need to use the appropriate decrypt method.

:::

```jsx
const decryptedString =await LitJsSdk.decryptToString(
  {
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig,
    chain: "ethereum",
  },
  litNodeClient
);

```

### Putting it all together

Your full decryption function should be:

```jsx
async decrypt(ciphertext: string, dataToEncryptHash: string, accessControlConditions: any) {
  if (!this.litNodeClient) {
    await this.connect()
  }

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'ethereum' })
  const decryptedString = LitJsSdk.decryptToString(
    {
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig,
      chain: 'ethereum',
    },
    litNodeClient,
  );
  return { decryptedString }
}
```

# Learn More

By now you should have successfully created an Access Control Condition and performed encryption and decryption. To learn more about using decentralized access control, please check out the links below:

1. [JWT-based Access Control](../access-control/jwt-auth.md).
2. [Basic Conditions](../access-control/evm/basic-examples.md).
3. [Off-Chain Conditions](../access-control/lit-action-conditions.md).
4. [Custom Contract Calls](../access-control/evm/custom-contract-calls.md).

Did you find this guide helpful? If not, please [get in touch](https://docs.google.com/forms/d/e/1FAIpQLScBVsg-NhdMIC1H1mozh2zaVX0V4WtmEPSPrtmqVtnj_3qqNw/viewform?usp=send_form).