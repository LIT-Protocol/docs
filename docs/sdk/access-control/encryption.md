import StateOfTheNetwork from "@site/src/pages/state-of-the-network.md";
import FeedbackComponent from "@site/src/pages/feedback.md";

# Encryption

The Lit network uses an identity (ID) based encryption scheme to encrypt data, which means that decryption is only permitted to those who satisfy a certain identity.

<StateOfTheNetwork/>

### How Does ID Encrypt Work

This is made possible because the BLS network signature is the decryption key for a particular set of access control conditions and private data, and the BLS network will only produce signature shares to the client if the user can prove that they satisfy the corresponding access control conditions.

This scheme is highly efficient, as encrypting private data is a entirely a client-side operation, and only 1 round of network interactivity with the nodes is required upon decryption (in order to request signature shares to assemble into a decryption key).

The identity-based encryption scheme necessitates the construction of an identity parameter, and it is this parameter that the BLS network is producing signature shares over. In order to prevent the same network signature (decryption key) to be used for multiple distinct ciphertexts, we choose this identity parameter to be a combination of the hash of the access control conditions and the hash of the private data itself.

## High-Level Overview

Here is a high-level, step-by-step breakdown of encryption and decryption:

### Encryption

1. Alice chooses some access control condition and private data and constructs the identity parameter
2. Alice encrypts the private data using the BLS network public key and the identity parameter to get a ciphertext
3. Alice stores the encryption metadata - set of access control conditions, hash of the private data etc. - and the ciphertext wherever she wants

### Decryption

1. Bob fetches the ciphertext and corresponding encryption metadata from the public data store
2. Bob presents the encryption metadata to the BLS network and requests for signature shares over the identity parameter
3. The BLS network nodes checks whether the user satisfies the access control conditions before signing the constructed identity parameter
4. Bob assembles the signature shares into a decryption key and successfully decrypts the ciphertext

## Technical Walkthrough

You can use Lit to encrypt and store any static content. Examples of static content are files or strings. You need to store the ciphertext and metadata yourself (on IPFS, Arweave, or even a centralized storage solution), and the Lit network will enforce who is allowed to decrypt it.

Check out [this example](https://github.com/LIT-Protocol/js-sdk/tree/feat/SDK-V3/apps/demo-encrypt-decrypt-react) for a full-fledged **React** application that encrypts and decrypts a **string** using the Lit JS SDK V3.

Keep reading to see a step-by-step process of how to encrypt and decrypt static data client side.

### Install and Import the Lit SDK

Ensure you have the following requirements in place:

1. Operating System: Linux, Mac OS, or Windows.
2. Development Environment: You'll need an Integrated Development Environment (IDE) installed. We recommend Visual Studio Code.
3. Languages: The Lit JS SDK supports JavaScript. Make sure you have the appropriate language environment set up.
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
You should use **at least Node v16.16.0** because of the need for the **webcrypto** library.
:::

You also need to install the following lit packages whose functions are used in the example below:

- `@lit-protocol/constants` 
- `@lit-protocol/auth-helpers` 
- `@lit-protocol/contracts-sdk` 


#### Client-Side Usage

Within a file (in the Lit example repos it will likely be called `lit.js`), set up your Lit class. Running `litNodeClient.connect()` will return a promise that resolves when you are connected to the Lit Network.

```jsx
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

class Lit {
   litNodeClient;
   chain;

   constructor(chain){
     this.chain = chain;
   }

   async connect() {
      this.litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "datil-dev",
      });
      await this.litNodeClient.connect();
   }
}

const chain = "ethereum";

let myLit = new Lit(chain);
await myLit.connect();
```

The litNodeClient listens to network state, and those listeners will keep your litNodeClient running until you explicitly disconnect from the Lit network. To stop the litNodeClient listeners and allow the browser to disconnect gracefully, call:

```jsx
await this.litNodeClient.disconnect();
```

:::note
To avoid errors from Lit nodes due to stale `authSig` or `sessionSigs`, make sure to clear the local storage for `authSig` and `sessionSigs` before reconnecting or restarting the litNodeClient.

One way to do this is to disconnect the existing litNodeClient first and then reconnect. To disconnect the litNodeClient after making a connection, call the following function:
```jsx
await this.litNodeClient.disconnect();
```

Other way is to simply call `disconnectWeb3` function which will clear up the local storage for `authSig` and `sessionSigs`:
```jsx
LitJsSdk.disconnectWeb3();
```
:::

#### Server-Side Usage

In this example stub, the `litNodeClient` is stored in a global variable `app.locals.litNodeClient` so that it can be used throughout the server. Note that `app.locals` is provided by **[Express](https://expressjs.com/)** for this purpose. You may have to use what your own server framework provides for this purpose, instead.

:::note
If you are using `NodeJS` you should install `@lit-protocol/lit-node-client-nodejs`. Moreover, the server-side implementation, the `litNodeClient` class is named `LitNodeClientNodeJs`.
:::

Running `litNodeClient.connect()` will return a promise that resolves when you are connected to the Lit network.

```jsx
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

class Lit {
   litNodeClient;
   chain;

   constructor(chain){
     this.chain = chain;
   }

   async connect() {
      app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        litNetwork: "datil-dev",
        debug: true,
      });

      this.litNodeClient = app.locals.litNodeClient;
      await this.litNodeClient.connect();
   }
}

const chain = "ethereum";

let myLit = new Lit(chain);
await myLit.connect();
```

The `litNodeClient` listens to network state, and those listeners will keep your Node.js process running until you explicitly disconnect from the Lit network. To stop the `litNodeClient` listeners and allow node to exit gracefully, call: 

```jsx
await this.litNodeClient.disconnect();
```

### Performing Encryption

To encrypt something with Lit, you’ll need to follow these steps:

1. Create an access control condition.
2. Encrypt the static content (string, file, zip, etc...) using `LitJsSdk.encryptString` to get the `ciphertext` and `dataToEncryptHash`.
3. Finally, store the `ciphertext`, `dataToEncryptHash` and other metadata (`accessControlConditions` or other conditions such as`evmContractConditions`) and `chain` using your storage provider of choice. 

#### Create an Access Control Condition

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

#### Encryption

To encrypt a string, use one of the following functions:

- [encryptString()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html) - Used to encrypt the raw string.
- - [encryptString()](../../) - Used to encrypt the raw string.
- [zipAndEncryptString()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.zipAndEncryptString.html) - Compresses the string (using [JSZip](https://www.npmjs.com/package/jszip)) before encrypting it. This is useful for saving space, but takes additional time to perform the zip.

To encrypt a file, use:

- [encryptFile()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptFile.html) - Used to encrypt a file without doing any zipping or packing. Because zipping larger files takes time, this function is useful when encrypting large files ( > 20mb). This also requires that you store the file metadata.
- [encryptFileAndZipWithMetadata()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptFileAndZipWithMetadata.html) - Used to encrypt a file and then zip it up with the metadata (using [JSZip](https://www.npmjs.com/package/jszip)). This is useful for when you don't want to store the file metadata separately.
- [zipAndEncryptFiles()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.zipAndEncryptFiles.html) - Used to zip and encrypt multiple files. This does **not** include the file metadata in the zip, so you must store those yourself.

Apart from these, we have one more function which can be used to encrypt both strings and files:

- [encryptToJson()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptToJson.html) - Used to encrypt a string or file and serialize all the metadata required to decrypt i.e. accessControlConditions, evmContractConditions, solRpcConditions, unifiedAccessControlConditions & chain to JSON. It is useful for encrypting/decrypting data in IPFS or other storage without compressing it in a ZIP file.

Encryption can be performed entirely client-side and doesn't require making a request to the Lit nodes.

In this example, we are using `encryptString()`:

:::note

All encryption functions will output the `ciphertext` and a hash of the plaintext data (`dataToEncryptHash`) as base64 encoded strings, both of which are used during decryption.

:::

```jsx
class Lit {
    ...

    async encrypt(message) {
      // Encrypt the message
      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
        {
          accessControlConditions,
          dataToEncrypt: message,
        },
        this.litNodeClient,
      );

      // Return the ciphertext and dataToEncryptHash
      return {
        ciphertext,
        dataToEncryptHash,
      };
    }

    ...
}
```

:::note

Both `ciphertext` and `dataToEncryptHash` will be base64 encoded strings.

:::

### Performing Decryption

Make sure we have `accessControlConditions`, `ciphertext`, and the `dataToEncryptHash` data we created during the encryption step. An exception is when using `encryptFileAndZipWithMetadata()` which will include this metadata in the zip.

There is just one step:

1. Obtain the decrypted data in plaintext using the `accessControlConditions`, `ciphertext`, and `dataToEncryptHash` by calling `LitJsSdk.decryptToString`.

#### Mint Capacity Credits

In order to execute a transaction with Lit, you’ll need to reserve capacity on the network using Capacity Credits. These allow holders to reserve a set number of requests (requests per second) over a desired period of time (i.e. one week). You can mint a Capacity Credit NFT using the `contracts-sdk` in a couple of easy steps.

First, ensure you have the `@lit-protocol/contracts-sdk` package installed, which can be used in both browser and Node environments:

```jsx
yarn add @lit-protocol/contracts-sdk
```

OR

```jsx
npm i @lit-protocol/contracts-sdk
```

The next step is to initialize a signer. This should be a wallet controlled by your application and the same wallet you’ll use to mint the Capacity Credit NFT:

```jsx
import { LitNetwork } from "@lit-protocol/constants";

const walletWithCapacityCredit = new Wallet("<your private key or mnemonic>");

let contractClient = new LitContracts({
  signer: dAppOwnerWallet,
  network: LitNetwork.Datil,
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

#### Delegate usage of your NFT

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

#### Obtain a Session Sigs

In order to interact with the nodes in the Lit Network, you will need to generate and present session signatures. The easiest way to do this is to generate a `SessionSigs`. 

`SessionSigs` are produced by a ed25519 keypair that is generated randomly on the browser and stored in local storage. We need to obtain an `AuthSig` through an authentication method like Ethereum wallet in order to get a `SessionSigs` from Lit Nodes.

The session keypair is used to sign all requests to the Lit Nodes, and the user's `AuthSig` is sent along with the request, attached as a "capability" to the session signature. Each node in the Lit Network receives a unique signature for each request, and can verify that the user owns the wallet address that signed the capability.

:::note
Be sure to use the latest block hash from the `litNodeClient` as the nonce. You can get it from the `litNodeClient.getLatestBlockhash()`. Without the block hash SessionSigs will not be validated.
:::

##### Obtain a `SessionSigs` in the browser

If you want to obtain a `SessionSigs` in the browser, you can instantiate an `ethers.Signer` to sign a SIWE message and then generate an `AuthSig` to get the `SessionSigs` as shown below:


```jsx
import {ethers} from "ethers";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

class Lit {
  ...

  async getSessionSignatures(){
     // Connect to the wallet
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     await provider.send("eth_requestAccounts", []);
     const signer = provider.getSigner();
     const walletAddress = await signer.getAddress();
     console.log("Connected account:", walletAddress);
  
     // Get the latest blockhash
     const latestBlockhash = await this.litNodeClient.getLatestBlockhash();
  
     // Define the authNeededCallback function
     const authNeededCallback = async(params) => {
       if (!params.uri) {
         throw new Error("uri is required");
       }
       if (!params.expiration) {
         throw new Error("expiration is required");
       }
  
       if (!params.resourceAbilityRequests) {
         throw new Error("resourceAbilityRequests is required");
       }
   
       // Create the SIWE message
       const toSign = await createSiweMessageWithRecaps({
         uri: params.uri,
         expiration: params.expiration,
         resources: params.resourceAbilityRequests,
         walletAddress: walletAddress,
         nonce: latestBlockhash,
         litNodeClient: this.litNodeClient,
       });
  
       // Generate the authSig
       const authSig = await generateAuthSig({
         signer: signer,
         toSign,
       });
  
       return authSig;
     }
  
     // Define the Lit resource
     const litResource = new LitAccessControlConditionResource('*');

     // Get the session signatures
     const sessionSigs = await this.litNodeClient.getSessionSigs({
         chain: this.chain,
         resourceAbilityRequests: [
             {
                 resource: litResource,
                 ability: LitAbility.AccessControlConditionDecryption,
             },
         ],
         authNeededCallback,
         capacityDelegationAuthSig,
     });
     return sessionSigs;
  }

  ...
}
```

##### Obtain a `SessionSigs` on the server-side

If you want to obtain a `SessionSigs` on the server-side, you can instantiate an `ethers.wallet` to sign a SIWE message and then generate an `AuthSig` to get the `SessionSigs` as shown below:

```jsx
import {ethers} from "ethers";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

class Lit {
  private ethersWallet;

  constructor(yourPrivateKey) {
    this.ethersWallet = new ethers.Wallet(
      "<your private key>"
    );
  }

  ...

  async getSessionSignatures(){
      // Get the latest blockhash
      const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

      // Define the authNeededCallback function
      const authNeededCallback = async(params) => {
        if (!params.uri) {
          throw new Error("uri is required");
        }
        if (!params.expiration) {
          throw new Error("expiration is required");
        }

        if (!params.resourceAbilityRequests) {
          throw new Error("resourceAbilityRequests is required");
        }

        // Create the SIWE message
        const toSign = await createSiweMessageWithRecaps({
          uri: params.uri,
          expiration: params.expiration,
          resources: params.resourceAbilityRequests,
          walletAddress: this.ethersWallet.address,
          nonce: latestBlockhash,
          litNodeClient: this.litNodeClient,
        });

        // Generate the authSig
        const authSig = await generateAuthSig({
          signer: this.ethersWallet,
          toSign,
        });

        return authSig;
      }

      // Define the Lit resource
      const litResource = new LitAccessControlConditionResource('*');

      // Get the session signatures
      const sessionSigs = await this.litNodeClient.getSessionSigs({
          chain: this.chain,
          resourceAbilityRequests: [
              {
                  resource: litResource,
                  ability: LitAbility.AccessControlConditionDecryption,
              },
          ],
          authNeededCallback,
          capacityDelegationAuthSig,
      });
      return sessionSigs;
  }

  ...
}
```

#### Using a delegated `capacityDelegationAuthSig`  from a backend

If using a `mainnet` in order to keep the wallet which holds the `Capacity Credit NFT` secure it is recommended to call `createCapacityDelegationAuthSig` from `LitNodeClient` in a backend context. There are a few recommended web servers you can use in order to host an api endpoint which can return the `capacityDelegationAuthSig` . Some links are provided below to help get started:

- [ExpressJS](https://www.npmjs.com/package/express)
- [Node HTTP server](https://nodejs.org/api/http.html#http)

#### Decryption

To decrypt use the following functions depending on the function used to encrypt:

- [decryptToString()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.decryptToString.html) for [encryptString()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptString.html)
- [decryptToZip()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.decryptToZip.html) for [zipAndEncryptString()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.zipAndEncryptString.html) & [zipAndEncryptFiles()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.zipAndEncryptFiles.html)
- [decryptToFile()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.decryptToFile.html) for [encryptFile()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptFile.html)
- [decryptZipFileWithMetadata()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.decryptZipFileWithMetadata.html) for [encryptFileAndZipWithMetadata()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptFileAndZipWithMetadata.html)
- [decryptFromJson()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.decryptFromJson.html) for [encryptToJson()](https://v6-api-doc-lit-js-sdk.vercel.app/functions/encryption_src.encryptToJson.html)

In the example, we used `encryptString()` to encrypt so we will use `decryptToString()` to decrypt. Pass in the data  `accessControlConditions`, `ciphertext`, `dataToEncryptHash`, and `authSig`.

:::note

If you want to use another LitJsSDK encryption method to encrypt content, you will need to use the appropriate decrypt method.

:::

```jsx
class Lit {
    ...

    async decrypt(ciphertext, dataToEncryptHash) {
      // Get the session signatures
      const sessionSigs = await this.getSessionSignatures();

      // Decrypt the message
      const decryptedString = await LitJsSdk.decryptToString(
        {
          accessControlConditions,
          chain: this.chain,
          ciphertext,
          dataToEncryptHash,
          sessionSigs,
        },
        this.litNodeClient,
      );

      // Return the decrypted string
      return { decryptedString };
    }

    ...
}
```

Check out [this example](https://github.com/LIT-Protocol/js-sdk/tree/feat/SDK-V3/apps/demo-encrypt-decrypt-react) for a full-fledged **React** application that encrypts and decrypts a **string** using the Lit JS SDK V3.

<FeedbackComponent/>