import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

# Making Your First Signing Request

This guide will walk you through one method of performing Programmable Key Pair (PKP) signing with Lit.

The configuration includes: connecting to the Lit network, minting a PKP owned by an Ethereum wallet, and finally signing a message with the PKP.

PKPs are programmable key pairs that can be used to sign data. They are typically used with [Lit Actions](../lit-actions/overview.md) while executing code on the Lit network, but they can also be used standalone.

This guide uses Lit's [Datil-dev Network](../../learn/overview/how-it-works/lit-networks/testnets.md) which is designed for application developers aiming to get familiar with the Lit SDK. Payment is not required on this network, and therefore the code is less complex. For those aiming to build production-ready applications, the [Datil-test Network](../../learn/overview/how-it-works/lit-networks/testnets.md) is recommended. Once ready, these applications can then be deployed on [Datil](../../learn/overview/how-it-works/lit-networks/mainnets.md), the Lit production network.

For developers looking to explore beyond the basics, check out our PKPs section [here](../pkps/overview.md) for more advanced examples of PKP usage.

## Installing the Lit SDK

To get started with PKP signing and the Lit SDK, you'll need to install these packages:

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
@lit-protocol/contracts-sdk \
ethers@v5
```

</TabItem>

<TabItem value="yarn">

```bash
yarn add @lit-protocol/lit-node-client \
@lit-protocol/constants \
@lit-protocol/auth-helpers \
@lit-protocol/contracts-sdk \
ethers@v5
```

</TabItem>
</Tabs>

If you're just getting started with Lit or development in general, we recommend taking a look at our [Starter Guides](https://github.com/LIT-Protocol/developer-guides-code/tree/master/starter-guides). These guides provide an environment for getting started with the Lit SDK.

## Walkthrough

### Connecting to the Lit Network

Signing with Lit requires an active connection to the Lit network. This can be done by initializing a [LitNodeClient](./connecting-to-lit.md) instance, which will establish a connection to the Lit nodes.

We will also be initializing an Ethereum wallet using the `ETHEREUM_PRIVATE_KEY` environment variable, which is required for generating session signatures and minting the PKP in this example.
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
  process.env.ETHEREUM_PRIVATE_KEY!, // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);
```

</p>
</details>

### Minting a PKP

We will perform the signing using a PKP in this example. To mint the PKP, we will use use the `LitContracts` class, which is used to interact with the [Chronicle Yellowstone](../../learn/overview/how-it-works/lit-blockchains/chronicle-yellowstone.md) blockchain. Setting the `signer` to the wallet we initialized earlier will allow us to pay the PKP minting fee.

<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import { LitContracts } from "@lit-protocol/contracts-sdk";

const litContracts = new LitContracts({
    signer: ethersWallet,
    network: LitNetwork.DatilDev,
    debug: false
});
await litContracts.connect();

const pkp = (await litContracts.pkpNftContractUtils.write.mint()).pkp;
```

</p>
</details>

### Generating Session Signatures

Session Signatures are used to authenticate and maintain an active connection to the nodes in the Lit network. They are required when performing PKP signing or any other functionality (i.e. decryption) with Lit. An introduction to Session Signatrues and authenticating with the Lit network can be found [here](./authenticating-with-lit.md).

In this case, we enable our session to sign with PKPs, and specify that it can only use the PKP we just minted. We also enable the Lit Action Execution resource, which allows us to execute Lit Actions because the `pkpSign` method we will be using requires it.
<details>
<summary>Click here to see how this is done</summary>
<p>

```ts
import {
  createSiweMessage,
  generateAuthSig,
  LitAbility,
  LitActionResource,
  LitPKPResource,
} from "@lit-protocol/auth-helpers";

const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    resourceAbilityRequests: [
        {
            resource: new LitPKPResource(pkp.tokenId),
            ability: LitAbility.PKPSigning,
        },
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

### Signing Data

Now that we have the Session Signatures, we can use the `pkpSign` method to sign the data using our PKP. If you'd like to see the `pkpSign` parameters, you can find them [here](https://v6-api-doc-lit-js-sdk.vercel.app/classes/lit_node_client_src.LitNodeClientNodeJs.html#pkpSign).

<details>
<summary> Click here to see how this is done</summary>
<p>

```ts
const signingResult = await litNodeClient.pkpSign({
  pubKey: pkp.publicKey,
  sessionSigs,
  toSign: ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("The answer to the universe is 41."))),
})
```

</p>
</details>

Our `signingResult` will appear as an ECDSA signature:

<details>
<summary> Click here to see the signature</summary>
<p>
```json
{
  r: '2755ed0cc55452c5c1ba75cad13167c537a44a6cd0fdb9da3e48a05bf8de3c5d',
  s: '3458584d1524f9d52aef1ec97386f1914fcf948f2b63c8fd8406dec38be0744f',
  recid: 0,
  signature: '0x2755ed0cc55452c5c1ba75cad13167c537a44a6cd0fdb9da3e48a05bf8de3c5d3458584d1524f9d52aef1ec97386f1914fcf948f2b63c8fd8406dec38be0744f1b',
  publicKey: '045931A629B8C00995A86E3CE6880416EE082240BE6E7FD144648115E6FB9ECB525D4B6F6CADCB17D39F318828A66E71DA501C529478C090CD682876C2F4258D49',
  dataSigned: '760404FCE401CD30392E61B48DED0382A9987C18793093A52BA25E443B20F58A'
}
```
</p>
</details>

# Learn More

By now you should have successfully signed data with Lit. If you’d like to learn more about what’s possible with Lit's PKP signing, check out the [Advanced Topics](link TBD) section.

<FeedbackComponent/>


