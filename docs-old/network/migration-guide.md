import FeedbackComponent from "@site/src/pages/feedback.md";
import OldMigrationNotice from "@site/src/pages/old-migration-notice.md";

<OldMigrationNotice/>


# Migrating to Lit v0

:::info
Read the full announcement [here](https://spark.litprotocol.com/introducing-decentralized-key-management-with-lit-v0/).
:::

The launch of Lit v0 introduces the [Habanero Mainnet](../network/networks/mainnet.md) and the [Manzano Testnet](../network/networks/testnet.md). 

The keys created and managed on the Habanero Mainnet are ready to be used for deploying production-level applications and user experiences. This means that sending, receiving, and managing real world assets IS now supported. Any keys that are created on the v0 network are persistent, will not be deleted, and will eventually be migrated to the v1 network when it is released later this year.

If you are currently in early-stage research and development, you should be using the Manzano Testnet. Sending, receiving, and managing real world assets on Manzano is NOT recommended. 

In order to deploy to Habanero or Manzano, you’ll first need to make sure you're using the v3 or v4 SDK. If you haven’t yet upgraded to v3 or v4, you can do so following these [upgrade instructions](../sdk/migrations/3.0.0/overview.md). Once you've upgraded, the next step will be to connect to the appropriate network branch in your SDK config, either [Habanero](../network/networks/mainnet.md) or [Manzano](../network/networks/testnet.md).

Once your application is using v3 or v4, you can follow the following migration guide to learn how to perform re-encryption (if you're using [access control](../sdk/access-control/intro.md)) or re-mint PKPs (if you're building with [user wallets](../user-wallets/overview)) on Habanero or Manzano. 

## Migrating From Jalapeno

Jalapeno only supports encryption / decryption use cases, so this guide will only focus on that use case. The migration path for Jalapeno involves performing re-encryption.

You can learn more about re-encryption at the end of this guide.

If you’re migrating from Jalapeno to Habanero, it’s important to remember that they have different, incompatible Lit JS SDK versions.  Jalapeno only works with version 2.x.x and Habanero only works with 3.x.x and above. You will therefore need to decrypt with the v2 sdk and then re-encrypt with the v3 or v4 sdk. 

## Migrating From Cayenne

### For encryption / decryption use cases

Cayenne and Habanero (or Manzano) have different root keys and, so you’ll need to re-encrypt your user’s content in order to migrate to Habanero (or Manzano). In order to perform re-encryption, you can use the same v3 or v4 SDK for both Cayenne and Habanero (or Manzano), but note that you will need 2 instances of the SDK, one connected to each network. First, use Cayenne SDK instance to decrypt the encrypted data and then use Habanero (or Manzano) SDK instance to re-encrypt it.  

You can learn more about re-encryption at the end of this guide.

### For PKP Signing / Lit Actions use cases

Since Habanero (or Manzano) has new root keys, you will need to re-mint any PKPs on Habanero (or Manzano) as old PKPs cannot be directly migrated from the old networks.  To do this, you can loop over all your old users and simply mint a new PKP on Habanero (or Manzano) with the exact same auth methods.  

> **Note:** To facilitate this process, we have an example script that automates the re-minting of PKPs on Habanero (or Manzano). This script allows you to seamlessly generate new PKPs for all your users, ensuring the same authentication methods are preserved. You can access the script [here](https://github.com/LIT-Protocol/PKP-Migrate).

At this point, your users could use both the old network PKPs and the new network PKPs with the same auth methods. However, the ETH address of each PKP will be different. Your users may have things tied to the old PKP ETH address, like assets stored there, or AA wallets that see that PKP as authorized signer. So the next step is to migrate these items.  

In the case of assets, like ETH or Tokens or NFTs, you must have the user send these to their new PKP wallet address. Once they have sent their assets, the migration is complete.

In the case of AA wallets, you would change the authorized signer from the old PKP wallet address to the new PKP wallet address. Once you’ve done this, the migration is complete.


## Performing re-encryption
Re-encryption is simply, decrypting the content, then encrypting it again. The v3 and v4 SDK of the encryption system introduces significant enhancements compared to v2 SDK. It employs a more intricate yet secure method of encryption and decryption, utilizing hashes and a comprehensive set of parameters to bolster security and integrity. 

The Lit network employs an ID-based encryption method allowing only users who meet specific identity criteria to decrypt data. This process involves the use of the BLS network signature as a decryption key, which is generated based on access control conditions and private data. Encryption occurs client-side, requiring minimal network interaction—just a single round for decryption to gather necessary signature shares. Read more about ID based encryption [here](../sdk/access-control/encryption/#how-does-id-encrypt-work).

Unlike v2, both encryption and decryption processes in v3 and v4 explicitly rely on the `litNodeClient` showcasing a deeper integration with the Lit network's infrastructure. Additionally, v3 and v4 incorporates a data hash (`dataToEncryptHash`) during encryption, allowing for additional validation and integrity checks, which were absent in v2. Furthermore, v3 and v4 transitions from using basic types (like `string`) to structured request and response objects, like `EncryptStringRequest` and `DecryptRequest`, indicates a shift towards more detailed and configurable encryption/decryption operations to cater to diverse use cases.

In the case of a migration from an old Lit Network to Habanero, you would follow these steps to learn how to decrypt and re-encrypt your data:

### 1. Connect to the old network using Lit Js SDK V2
```js
class LitV2 {
  private litNodeClient;

  async connect() {
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    this.litNodeClient = client;
  }
}

export default new Lit();
```
### 2. Decrypt the user’s data using old network
```js
// Lit Js SDK V2 decryption example
async decrypt(encryptedString, encryptedSymmetricKey) {
  if (!this.litNodeClient) {
    await this.connect();
  }

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
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

  const symmetricKey = await this.litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain: "ethereum",
    authSig
  });
  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    symmetricKey
  );

  return { decryptedString };
}
```
### 3. Connect to `Habanero` or `Manzano` and encrypt it again
```js
import {ethers} from "ethers";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

class LitV3 {  // or Class LitV4
  private ethersWallet;
  private litNodeClient;

  constructor(yourPrivateKey) {
    this.ethersWallet = new ethers.Wallet(
      yourPrivateKey
    );
  }

  async connect() {
    const client = new LitJsSdk.LitNodeClient({
         litNetwork: "manzano",
    });
    await client.connect();
    this.litNodeClient = client;
  }

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
          chain: 'ethereum',
          resourceAbilityRequests: [
              {
                  resource: litResource,
                  ability: LitAbility.AccessControlConditionDecryption,
              },
          ],
          authNeededCallback,
      });
      return sessionSigs;
  }

  async encrypt(message) {
    if (!this.litNodeClient) {
      await this.connect();
    }
  
    const sessionSigs = await this.getSessionSignatures();
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

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        sessionSigs,
        chain: 'ethereum',
        dataToEncrypt: message,
      },
      litNodeClient,
    );
  
    return {
      ciphertext,
      dataToEncryptHash,
    };
  }
}

export default new Lit();

```

Since in many cases, only the end user themselves can actually decrypt the content, you may adopt a system where you migrate each user when they use the system. You may start sending traffic from new users that *don’t* have any existing content to Habanero, immediately.  You may want to track which network each user is using in your user DB, and then upon login, look this up to decide which network to talk to.

## Installing and Initializing the Lit SDK

To connect to the Habanero network, you'll need to import the Lit SDK using the following command:

<Tabs
defaultValue="general"
values={[
{label: 'general', value: 'general'},
{label: 'server side with nodejs', value: 'server-side'},
]}>
<TabItem value="general">

Install the `@lit-protocol/lit-node-client` package, which can be used in both browser and Node environments:

```sh
yarn add @lit-protocol/lit-node-client
```

Use the **Lit JS SDK**:

:::note
You'll need to specify the network you want to connect to ('habanero' or 'manzano') when initializing your node client config.
:::

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client";
```

</TabItem>

<TabItem value="server-side">

Install the `@lit-protocol/lit-node-client-nodejs`, which is for Node environments only:

```sh
yarn add @lit-protocol/lit-node-client-nodejs
```

Use the **Lit JS SDK**:

:::note
You'll need to specify the network you want to connect to ('habanero' or 'manzano') when initializing your node client config.
:::

```js
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
```

</TabItem>
</Tabs>

:::note
You should use **at least Node v19.9.0**
- **crypto** support.
- **webcrypto** library support if targeting `web`.
:::

## Connection to the Lit Network

The SDK requires an active connection to the Lit nodes to perform most functions (notably, a connection to the Lit nodes is not required if you are just verifying a JWT).

In web apps, this is typically done on first page load and can be shared between all your pages. In NodeJS apps, this is done when when the server starts.

Calling `connect()` on the `litNodeClient`` returns a promise that resolves when you are connected to the Lit network.

### SDK installed via NodeJS / serverside usage

In this example stub, the litNodeClient is stored in a global variable `app.locals.litNodeClient` so that it can be used throughout the server. `app.locals` is provided by [Express](https://expressjs.com/) for this purpose. You may have to use what your own server framework provides for this purpose, instead.

> Keep in mind that in the server-side implementation, the client class is named `LitNodeClientNodeJs`.

`client.connect()` returns a promise that resolves when you are connected to the Lit network.

```js
app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: "habanero",
  checkNodeAttestation: true 
});
await app.locals.litNodeClient.connect();
```

The litNodeClient listens to network state, and those listeners will keep your Node.js process running until you explicitly disconnect from the Lit network.
To stop the litNodeClient listeners and allow node to exit gracefully, call `client.disconnect()`

```js
await app.locals.litNodeClient.disconnect()
```

### SDK installed for client side usage

Within a file (in the Lit example repos it will likely be called `lit.js`), set up your Lit object.

`client.connect()` will return a promise that resolves when you are connected to the Lit Network.

```js
const client = new LitJsSdk.LitNodeClient({
  litNetwork: 'habanero',
  checkNodeAttestation: true 
});

await client.connect();
```

Read more about using the Lit SDK, testing, and error handling [here](../sdk/tests.md).

## Minting Capacity Credits for Usage

Currently Rate Limiting is enabled on `Habanero` and `Manzano`. In order to use these networks, you must reserve capacity on them by minting a `Capacity Credits NFT` on Chronicle - Lit's custom EVM rollup testnet. Capacity credits allow holders to reserve a configurable number of requests (measured in requests per second) over a fixed length of time (i.e. one week). For minting capacity credits, you can either use:
1. The [Lit  Explorer](https://explorer.litprotocol.com/get-credits) or,
2. Our `contracts-sdk`.

A `Capacity Credits NFT` can be very easily minted from the Lit Explorer. For minting Capacity Credits using `contracts-sdk` see [here](../sdk/capacity-credits).

You’ll also need some 'tstLPX' tokens for minting. These are test tokens that hold no real value and should only be used to pay for usage on Habanero. `tstLPX` should only be claimed from the verified faucet, linked [here](https://chronicle-yellowstone-faucet.getlit.dev/).

For more information on Capacity Credits and network rate limiting see [here](../concepts/capacity-credits-concept)
<FeedbackComponent/>
