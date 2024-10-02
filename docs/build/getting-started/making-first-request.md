# Making Your First Request

## Start Here

This guide will walk you through the process of creating and executing your first Lit Action. The configuration includes: connecting to the Lit network, writing and deploying your Lit Action code, and finally executing the Lit Action. You can use the provided code snippets to execute this on your own machine.

This guide uses Lit's [Datil-dev Network](../../learn/overview/how-it-works/lit-networks/testnets.md) which is designed for application developers aiming to get familiar with the Lit SDK. Payment is not required on this network, and therefore the code is less complex. For those aiming to build production-ready applications, the [Datil-test Network](../../learn/overview/how-it-works/lit-networks/testnets.md) is recommended. Once ready, these applications can then be deployed on [Datil](../../learn/overview/how-it-works/lit-networks/mainnets.md), the Lit production network.

For developers looking to explore beyond the basics, check out the [Advanced Topics](link TBD) for more developed uses of Lit Actions.

## Installing the Lit SDK

To get started with Lit Actions and the Lit SDK, you'll need to install these packages:

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

Running a Lit Action requires an active connection to the Lit network. This can be done by initializing a [LitNodeClient](./connecting-to-lit.md) instance, which will establish a connection to the Lit nodes.

We will also be initializing an Ethereum wallet using the `ETHEREUM_PRIVATE_KEY` environment variable, which is required for generating session signatures in this example.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";

const litNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilDev,
  debug: false
});
await litNodeClient.connect();

const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY, // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

</p>
</details>

### Generating Session Signatures

Session Signatures are used to authenticate and maintain an active connection to the nodes in the Lit network. They are required when executing a Lit Action or any other functionality (i.e. signing) with Lit. An introduction to Session Signatrues and authenticating with the Lit network can be found [here](./authenticating-with-lit.md).
<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import {
  LitAbility,
  LitActionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

const sessionSignatures = await litNodeClient.getSessionSigs({
  chain: "ethereum",
  expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
  resourceAbilityRequests: [
    {
      resource: new LitActionResource("*"),
      ability: LitAbility.LitActionExecution,
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
      walletAddress: await ethersWallet.getAddress(),
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

## Storing the Lit Action

There are two ways to store a Lit Action. You can either write the code inline, or you can use IPFS to store the code. In this example, we'll use the inline method.

This Lit Action will simply return the current block number of the Ethereum network.
<details>
<summary>Click here to see how this is done</summary>
<p>

```jsx
//@ts-nocheck

const _litActionCode = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://ethereum.blockpi.network/v1/rpc/public");
    const blockNumber = await provider.getBlockNumber();
    LitActions.setResponse({ response: "Blocknumber: " + blockNumber });
  } catch (error) {
    LitActions.setResponse({ response: error.message });
  }
};

export const litActionCode = `(${_litActionCode.toString()})();`;
```

</p>
</details>

## Executing the Lit Action

To execute the Lit Action, we use the `executeJs` function. You'll need to pass in the `sessionSigs` and `code` parameters. There is an optional `jsParams` parameter, and it can be used to pass in parameters to the Lit Action. 

When this function is called, each Lit node will receive the request to execute the Lit Action. After each node has retrieved the latest Ethereum block number, they will compare the result to reach consensus before returning the response.

More details on the `executeJs` method can be found [here](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.JsonExecutionSdkParams.html).

:::info
If you'd like to use the IPFS method mentioned previously, you would instead use `ipfsId` instead of `code: litActionCode`, and the `ipfsId` would be the IPFS CID of the Lit Action code.
:::

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
const response = await litNodeClient.executeJs({
    sessionSigs,
    code: litActionCode,
});
```

Response:

```json
{
  success: true,
  signedData: {},
  decryptedData: {},
  claimData: {},
  response: 'Blocknumber: 20879532',
  logs: undefined
}
```
</p>
</details>

# Learn More

By now you should have successfully written and executed a Lit Action. If you’d like to learn more about what’s possible with Lit Actions, check out the [Advanced Topics](link TBD) section.

<FeedbackComponent/>


