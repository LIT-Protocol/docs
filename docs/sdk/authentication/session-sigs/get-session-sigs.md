import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Generating Session Signatures

[Session signatures](./intro.md) can be obtained using the [getSessionSigs](https://v5.api-docs.getlit.dev/classes/lit_node_client_src.LitNodeClientNodeJs.html#getSessionSigs) method provided by the Lit SDK. This method will generate a _session keypair_ for you locally, and will use the `authNeededCallback` method you specify to sign the Session Keypair, authorizing it to use the specified [Lit Resources and Abilities](./resources-and-abilities.md) on the Lit network.

Below we will walk through an example of generating session signatures, the full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/get-session-sigs-via-auth-sig/get-session-sigs-via-auth-sig/nodejs).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Session Signatures](../../authentication/session-sigs/intro.md)
- [Lit Capacity Credits](../../../sdk/capacity-credits.md)
- [Lit Resources and Abilities](./resources-and-abilities.md)

This guide also has a dependency on the following packages:

- `"@lit-protocol/auth-helpers": "^6.0.0-beta.3"`
- `"@lit-protocol/constants": "^6.0.0-beta.3"`
- `"@lit-protocol/lit-node-client": "^6.0.0-beta.3"`
- `"ethers": "v5"`
- `"node-localstorage": "^3.0.5"`
  - (Optional dependency depending on whether or not you're executing the Lit code within a browser. Explained further in the [Connecting to the Lit Network](#connecting-to-the-lit-network) section)

## Paying for Usage of the Lit Network

The correct code implementation will depend on whether you're using the free-to-use `cayenne` network, or one of the "paid" networks: `habanero` or `manzano`.

Usage of the `habanero` and `manzano` networks require the use of [Lit Capacity Credits](../../../sdk/capacity-credits.md). Currently, Capacity Credits are paid for using the `testLPX` token and don't require any real-world money. However, in the future you will need to pay real-world money for usage of Lit networks, and `habanero` and `manzano` are the Lit networks where this functionality is being tested and refined.

So, some of the below code snippets will show different implementations based on whether you intend to use the code on `cayenne` or `habanero`/`manzano` networks.

## Specifying an Ethereum Private Key

Our first step will be to specify what Ethereum private key we will use to provide the Authorization Signature for our Session Keys:

```ts
const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY;
```

If you're intending to use the `cayenne` network, this can be any Ethereum wallet.

If you're intending to use the `habanero` or `manzano` networks, the corresponding Ethereum address for the private key should have minted Capacity Credits to pay for the request to the Lit network to generate the Session Signatures (please see the [Capacity Credits](../../../sdk/capacity-credits.md) docs for more info on minting Capacity Credits).

## Instantiating an Ethers.js Wallet

Next we'll use our `ETHEREUM_PRIVATE_KEY` constant to instantiate an instance of `ethers.Wallet`:

```ts
const ethersSigner = new ethers.Wallet(ETHEREUM_PRIVATE_KEY);
```

We will be using this wallet to sign the Authorization Signature for our Session Keys, granting our Session Keys the ability to use the [Lit Resources and Abilities](./resources-and-abilities.md) we'll specify when making the call to generate our Session Signatures.

## Connecting to the Lit Network

In order to make requests to the Lit network, we're going to instantiate an instance of `LitNodeClient` which is imported from the `@lit-protocol/lit-node-client` package:

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
```

The below code varies depending on the Lit network you want to connect to. For convenience, the `LitNetwork` `enum` can be imported from the `@lit-protocol/constants` to help you specify which network you'd like to use:

```ts
import { LitNetwork } from "@lit-protocol/constants";
```

Additionally, the below code makes use of `LocalStorage` imported from the `node-localstorage` package:

```ts
import { LocalStorage } from "node-localstorage";
```

In order to get Session Signatures from the Lit network, the Lit SDK must first generate Session Keys which will be the keys being authorized by the Session Signatures.

When running this code within the browser, the Session Keys are stored within the browser's local storage. The `LocalStorage` module is **not** required and therefore you do not need to install the `node-localstorage` package, and the package `import` and `storageProvider` object in the below code can be omitted.

However, the browser local storage is not available when executing in an environment such as Node.js. To compensate for this we make use of the `LocalStorage` module to provide file based storage for our generated Session Keys and metadata. If you do not provide an instance of `LocalStorage` as the `provider` (as shown in the below code), then new Session Keys will be generated every time you run this code instead one set of keys being reused.

Now we'll use the imported `LitNodeClient` module to connect to the Lit network specified using the `LitNetwork` `enum`, and using in instance of `LocalStorage` for our `provider`:

<Tabs
defaultValue="cayenne"
values={[
{label: 'cayenne', value: 'cayenne'},
{label: 'habanero', value: 'habanero'},
{label: 'manzano', value: 'manzano'},
]}>
<TabItem value="cayenne">
```ts
litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    // This storageProvider object can be omitted if executing in a browser
    storageProvider: {
    provider: new LocalStorage("./lit_storage.db"),
    },
});
```
</TabItem>

<TabItem value="habanero">
```ts
litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Habanero,
    // This storageProvider object can be omitted if executing in a browser
    storageProvider: {
    provider: new LocalStorage("./lit_storage.db"),
    },
});
```
</TabItem>

<TabItem value="manzano">
```ts
litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Manzano,
    // This storageProvider object can be omitted if executing in a browser
    storageProvider: {
    provider: new LocalStorage("./lit_storage.db"),
    },
});
```
</TabItem>
</Tabs>

After you have an instance of `LitNodeClient`, you'll want to connect it to the Lit network using:

```ts
await litNodeClient.connect();
```

## Getting the Session Signatures

Now that we're connecting to the Lit network, we can request Session Signatures for our Session Keys. We're going to cover each line of the below code, but for context here is the whole function call to get our Session Signatures:

```ts
await litNodeClient.getSessionSigs({
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    resourceAbilityRequests: [
    {
        resource: new LitAccessControlConditionResource("*"),
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
        walletAddress: await ethersSigner.getAddress(),
        nonce: await litNodeClient.getLatestBlockhash(),
        litNodeClient,
    });

    return await generateAuthSig({
        signer: ethersSigner,
        toSign,
    });
    },
});
```

### `expiration`

Our `expiration` property specifies how long the Session Signatures for our Session Keys will be valid for.

### `resourceAbilityRequests`

As mentioned previously, [Lit Resources and Abilities](./resources-and-abilities.md) are used to define what our Session Signature is allowing our Session Keys to do on the Lit network.

There are two parts to each ability request:

#### `resource`

This property is defining what Lit Resource we're granting the `ability` for. Each Lit Resource takes a resource identifier as an argument. You can pass `"*"` like so:

```ts
new LitPKPResource("*")
```

to grant an `ability` to all resources owned by the Ethereum address that authorized the request to generate Session Signatures for the Session Keys. In the case of this example, that would be the address corresponding to our `ETHEREUM_PRIVATE_KEY` constant (that we created an Ethers.js wallet for).

Or you can specify a specific identifier for each resource as shown in the code snippets below.

The available Lit Resource options are:

##### `LitAccessControlConditionResource`

Imported from the `@lit-protocol/auth-helpers` package:

```ts
import { LitAccessControlConditionResource } from "@lit-protocol/auth-helpers";
```

This resource specifies a Lit Access Control Conditions (ACC) the `ability` is being granted for. Specifying `"*"` grants the `ability` to any ACC, regardless of what the conditions are. To grant the `ability` for a specific ACC, you can specify the hashed key value of the ACC in place of `"*"` like so:

<!-- TODO How to get the hashed key value of the ACC -->

```ts
new LitAccessControlConditionResource("")
```

##### `LitPKPResource`

Imported from the `@lit-protocol/auth-helpers` package:

```ts
import { LitPKPResource } from "@lit-protocol/auth-helpers";
```

This resource specifies what Lit Programmable Key Pair (PKP) the `ability` is being granted for. Specifying `"*"` grants the `ability` for all PKPs. To grant the `ability` for a specific PKP, you can specify the token ID of the PKP in place of `"*"` like so:

```ts
new LitPKPResource("42")
```

##### `LitRLIResource`

Imported from the `@lit-protocol/auth-helpers` package:

```ts
import { LitRLIResource } from "@lit-protocol/auth-helpers";
```

This resource specifies what Lit Capacity Credit the `ability` is being granted for. Specifying `"*"` grants the `ability` for all Capacity Credits. To grant the `ability` for a specific Capacity Credit, you can specify the token ID in place of `"*"` like so:

```ts
new LitRLIResource("42")
```

##### `LitActionResource`

Imported from the `@lit-protocol/auth-helpers` package:

```ts
import { LitActionResource } from "@lit-protocol/auth-helpers";
```

This resource specifies what Lit Actions the `ability` is being granted for. Specifying `"*"` grants the `ability` for all Lit Actions, regardless of who created them. To grant the `ability` for a specific Lit Action, you can specify an IPFS Content Identifier (CID) in place of `"*"` like so:

```ts
new LitActionResource("QmX8bs6vhiFvwgYS39ZqDW421D1885n3KNzqqwRhTPTP8e")
```

#### `ability`

`ability` is the second part of each Lit Resource Request, and it specifies what we're allowing the Session Keys to do with a Lit Resource.

Each available ability can be specified using the `LitAbility` `enum` which can be imported from the `@lit-protocol/auth-helpers` package:

```ts
import { LitAbility } from "@lit-protocol/auth-helpers";
```

The abilities available to grant are:

- `AccessControlConditionDecryption` This grants the ability to decrypt some Lit encrypted data if the Access Control Conditions are satisfied
<!-- TODO Is this correct? -->
- `AccessControlConditionSigning` This grants the ability to sign data using threshold signing by the Lit nodes in the network if the Access Control Conditions is satisfied.
- `PKPSigning` This grants the ability to sign data using a PKP.
- `RateLimitIncreaseAuth` This grants the ability to increase the rate limit of a Capacity Credit.
- `LitActionExecution` This grants the ability to execute a Lit Action.

### `authNeededCallback`

This property specifies a function that returns an Authorization Signature signifying that we are granting the Session Keys with the abilities for the specified resources. You are free to customized the function as it suits your use case, but a standard implementation is as follows:

```ts
authNeededCallback: async ({
uri,
expiration,
resourceAbilityRequests,
}) => {
const toSign = await createSiweMessage({
    uri,
    expiration,
    resources: resourceAbilityRequests,
    walletAddress: await ethersSigner.getAddress(),
    nonce: await litNodeClient.getLatestBlockhash(),
    litNodeClient,
});

return await generateAuthSig({
    signer: ethersSigner,
    toSign,
});
},
```

The parameters `uri`, `expiration`, and `resourceAbilityRequests` are automatically passed into our function by the Lit SDK. `expiration` and `resourceAbilityRequests` refer to the same properties we defined above. `uri` is going to be the `publicKey` of your Session Key.

Within our function, we're using the `createSiweMessage` that can be imported from the `@lit-protocol/auth-helpers` package:

```ts
import { createSiweMessage } from "@lit-protocol/auth-helpers";
```

This helper function produces an [ERC-4361 Sign in With Ethereum (SIWE) message](https://eips.ethereum.org/EIPS/eip-4361) using the parameters we provide. The other properties we're providing to this helper functions are:

- `walletAddress` This is the corresponding address to the Ethereum private key that we will be using to sign the SIWE message.
- `nonce` Is an Ethereum block hash and the timestamp of the block needs to be within 5 minutes of the `issued at` timestamp of the SIWE message.
- `litNodeClient` Is the instance of `LitNodeClient` that was previously instantiated and connected to the Lit network.

The next helper function we make use of is `generateAuthSig` which can be imported from the `@lit-protocol/auth-helpers` package:

```ts
import { generateAuthSig } from "@lit-protocol/auth-helpers";
```

We pass our Ethers.js wallet that we instantiated early, and the result of our call to `createSiweMessage`:

```ts
return await generateAuthSig({
    signer: ethersSigner,
    toSign,
});
```

`generateAuthSig` will use our Ethers.js wallet to sign our SIWE message, producing an Authorization Signature that authorizes our Session Key to use our Lit Resources with our specified abilities.
