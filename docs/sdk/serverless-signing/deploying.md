# Deploying Your Lit Action

Lit Actions are powerful JavaScript programs that run on a Lit network. This guide covers the two approaches to deploying your Lit Action to Lit. For more info on what a Lit Action is, go [here](./overview.md). For a guide on getting started with Lit Actions, go [here](./quick-start.md).

In order for the Lit nodes to be able to run your Lit Action, they need access to its code. There are two methods of providing your code to the Lit network for execution:

1. Providing a Code String
2. Uploading to IPFS

## Lit Action Constraints

Before diving into the approaches for deploying a Lit Action, it's important to understand the constraints that are in place to prevent malicious parties from performing DoS attacks, and the over consumption of resources on the Lit nodes. The following are the time and size constraints that are imposed on Lit Actions:

- A `30 second` time limit on the Datil and Datil-test network, and a `60 second` time limit on Datil-dev.
- A max size of `100MB`
  - Code minifiers can help address code size issues
- Memory usage (RAM) of `256MB`

## Comparing Deployment Methods

### Providing a Code String

Generally, providing your Lit Action code as a code string is the recommended method for the following reasons:

- **Direct Supply**: Your code is supplied directly to each Lit node, eliminating any potential network latency or availability issues caused by fetching your code from the IPFS network.
- **Reliability**: It removes the dependency on the IPFS network, ensuring your Lit Action is always available for execution.

However, it's important to note some potential drawbacks:

- **Increased Network Usage**: Because the entire Lit Action code must be sent with each request, this can lead to higher network usage and potentially slower overall execution times.
- **Transparency** Depending on where/how you make your source code available to your users, users may find it challenging to review and verify the exact code their [Programmable Key Pairs (PKPs)](../../user-wallets/pkps/overview.md) are interacting with.

### Uploading to IPFS

While not generally recommended for most use cases, uploading your Lit Action to IPFS can be beneficial in certain scenarios:

- **Large Code Base**: If your Lit Action is particularly large or complex, storing it on IPFS can help manage the size of your requests to the Lit network.
- **Code Reusability**: If you have a Lit Action that's used across multiple projects or applications, storing it on IPFS allows you to reference it by its Content Identifier (CID) without duplicating the code.
- **Version Control**: IPFS inherently provides a form of version control. Each change to your Lit Action results in a new CID, allowing you to maintain different versions easily.
- **Decentralized Storage**: If your application prioritizes complete decentralization, storing your Lit Action on IPFS aligns with this philosophy.

However, it's important to note some potential drawbacks:

- IPFS Network Latency: In our testing, the IPFS network can sometimes be slow to respond, which could delay the execution of your Lit Action.
- Propagation Time: It takes time for files uploaded to the IPFS network to propagate and become available globally. We have observed instances where a newly uploaded Lit Action was not immediately retrievable by Lit nodes due to slow IPFS propagation.
- Additional Network Call: Each Lit node needs to make an additional network call to fetch the code from IPFS, which can increase execution time.

## Deploying Using a Code String

This method is the more straightforward of the two, as we're simply providing our Lit Action code as a string when using one of the Lit SDK methods such as [executeJs](https://v7-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.ILitNodeClient.html#executeJs).

:::note
Most of the code in the full implementation is boilerplate code used to connect to a Lit network and generate Session Signatures. If you don't understand all of the code, or want to learn more about it, you can go [here](../../connecting-to-a-lit-network/connecting.md) to learn about connecting to a network, and [here](../authentication/session-sigs/intro.md) to learn more about generating Session Signatures.
:::

<details>
<summary>Click here for full code implementation</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_RPC, LIT_NETWORK, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitActionResource,
} from "@lit-protocol/auth-helpers";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);

const litNodeClient = new LitNodeClient({
    litNetwork: LIT_NETWORK.DatilDev,
    debug: false,
});
await litNodeClient.connect();

const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    resourceAbilityRequests: [
        {
            resource: new LitActionResource("*"),
            ability: LIT_ABILITY.LitActionExecution,
        },
    ],
    authNeededCallback: async ({
        resourceAbilityRequests,
        expiration,
        uri,
    }) => {
        const toSign = await createSiweMessageWithRecaps({
            uri: uri!,
            expiration: expiration!,
            resources: resourceAbilityRequests!,
            walletAddress: ethersSigner.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
        });

        return await generateAuthSig({
            signer: ethersSigner,
            toSign,
        });
    },
});

const litActionCode = `
(async () => {
  console.log("This is my Lit Action!");
})();
`;

await litNodeClient.executeJs({
    sessionSigs,
    code: litActionCode,
});
```

</p>
</details>

For this guide we'll focus on the very last couple of lines from the above full implementation:

```ts
const litActionCode = `
(async () => {
  console.log("This is my Lit Action!");
})();
`;

await litNodeClient.executeJs({
    sessionSigs,
    code: litActionCode,
});
```

First we're declaring our Lit Action as a [Immediately Invoked Function Expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), i.e. a function that executes itself. This Lit Action is simple logging a string to the console, so you'd replace the `console.log` with your custom code.

Next we're calling the `executeJs` method to create a request to the Lit network to execute our Lit Action. We provide our `litActionCode` string as the `code` parameter, and when the Lit network receives our request, our `string` will be parsed and executed on each Lit node.

## Deploying Using IPFS

While providing a code string is generally recommended, there are scenarios where uploading your Lit Action to IPFS can be beneficial as covered above. To implement this, we pass the [IPFS Content Identifier (CID)](https://docs.ipfs.tech/quickstart/publish/#cids-explained) when calling Lit SDK methods such as [executeJs](https://v7-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.ILitNodeClient.html#executeJs).

:::note
Most of the code in the full implementation is boilerplate code used to connect to a Lit network and generate Session Signatures. If you don't understand all of the code, or want to learn more about it, you can go [here](../../connecting-to-a-lit-network/connecting.md) to learn about connecting to a network, and [here](../authentication/session-sigs/intro.md) to learn more about generating Session Signatures.
:::

<details>
<summary>Click here for full code implementation</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_RPC, LIT_NETWORK, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitActionResource,
} from "@lit-protocol/auth-helpers";

const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);

const litNodeClient = new LitNodeClient({
    litNetwork: LIT_NETWORK.DatilDev,
    debug: false,
});
await litNodeClient.connect();

const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    resourceAbilityRequests: [
        {
            resource: new LitActionResource("*"),
            ability: LIT_ABILITY.LitActionExecution,
        },
    ],
    authNeededCallback: async ({
        resourceAbilityRequests,
        expiration,
        uri,
    }) => {
        const toSign = await createSiweMessageWithRecaps({
            uri: uri!,
            expiration: expiration!,
            resources: resourceAbilityRequests!,
            walletAddress: ethersSigner.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
        });

        return await generateAuthSig({
            signer: ethersSigner,
            toSign,
        });
    },
});

await litNodeClient.executeJs({
    sessionSigs,
    ipfsId: process.env.LIT_ACTION_IPFS_CID,
});
```

</p>
</details>

For this guide we'll focus on the very last couple of lines from the above full implementation:

```ts
await litNodeClient.executeJs({
    sessionSigs,
    ipfsId: process.env.LIT_ACTION_IPFS_CID,
});
```

To request the Lit network to pull your Lit Action code from IPFS when executing it, we pass the IPFS CID as the `ipfsId` parameter when calling `executeJs`. Your Lit Action's IPFS CID can be obtained after uploading and pinning your code using an IPFS node. If you aren't familiar with this process, you can go [here](https://docs.ipfs.tech/quickstart/publish/) to learn more.

:::info
[Pinata](https://www.pinata.cloud/) is a popular free to use IPFS pinning service that's easy to use.
:::

When the Lit network receives our request, each Lit node will make a request to the IPFS network to obtain the file with the IPFS CID you provided, parse it, and execute it.

## A Note on Immutability

One of the features of smart contracts on Ethereum is the immutability they can offer. For most contracts, you know that the code that lives at a specific address can never be changed, and you don't have to worry about the underlying code being swapped out for some malicious implementation. The same security guarantee can be made when using Lit Actions.

If you upload your Lit Action code to IPFS, it's easy to reason about how this immutability is achieved. Because IPFS uses content-based addressing, i.e. the Content Identifier (CID) of your Lit Action is directly derived from its content, any change to the code, no matter how small, results in a completely different CID. This means, like Ethereum smart contract addresses, your users can check and verify the IPFS CID that's being used when making requests to the Lit network.

However, when passing your Lit Action as a code string, the immutability guarantee isn't immediately apparent. What prevents a developer from passing malicious code when calling `executeJs`, compromising the trust users have placed in the application? This is where *permitted [Auth Methods](../../user-wallets/pkps/advanced-topics/auth-methods/overview)* play a crucial role in maintaining security.

[Programmable Key Pairs (PKPs)](../../user-wallets/pkps/overview.md) allow you to grant specific Lit Actions the ability to use the PKP by adding their IPFS CIDs as a permitted Auth Method. Users can permit IPFS CIDs corresponding to Lit Actions they trust, and only those Lit Actions will be able to use their PKP to perform operations like signing data. Using any other Lit Action code will result in a unauthorized use error from the Lit nodes.

You can obtain the IPFS CID for any Lit Action code without uploading it to IPFS using a package like [ipfs-only-hash](https://github.com/alanshaw/ipfs-only-hash). You, or your users, would then permit the IPFS CID for the Lit Action you/they trust as an Auth Method for any PKP to be used by the Lit Action. Afterwards, when the Lit Action code is submitted to the Lit network as a code string, each Lit node will take the code string, generate the IPFS CID for it, and check if it's a permitted Auth Method for the PKP.
