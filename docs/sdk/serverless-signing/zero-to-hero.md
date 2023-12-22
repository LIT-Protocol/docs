import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Zero to Hero

## Prerequisites

- Familiarity with JavaScript

## Overview
In this section we're gonna cover an end-to-end example from minting a PKP through the ContractsSDK, setting its scope & signing a message with it inside a Lit Action.

Installed the latest contracts-sdk on `cayenne`

```bash
yarn install @lit-protocol/contracts-sdk@cayenne
```

## Set up the controller

To initialize a LitContracts client you need an Eth Signer. This can be a standard Ethers wallet or also a `PKPEthersWallet` (more info on the later [here](../authentication/session-sigs/auth-methods/add-remove-auth-methods)). But here, we're gonna use the standard Ethers wallet.

## Initialize the ContractsSDK

We're using the ContractsSDK for the minting the PKP & interacting with it (updating the scopes). So let's initialize it

```jsx
const contractClient = new LitContracts({
  signer: wallet,
});

await contractClient.connect();
```

**Note:** The default LitNetwork for the ContractsSDK is Cayenne so there's no need to set the network explicitly.

## Mint the PKP

Now that we've the ContractsSDK initialized we're ready to mint the PKP using it. Since we want to allow out PKP to sign messages we have to add Auth Method scopes for `SigningAnything` & `OnlySignMessages` as below otherwise you'll get an error stating that the PKP isn't authorized to sign.

**Note:** You're gonna need an AuthSig for setting the `authMethod`. In the browser you can use `checkAndSignAuthMessage` or use [Hot wallet signing](https://developer.litprotocol.com/v3/support/faq/#1-cant-use-checkandsignauthmessage-in-a-backend-project) in the backend.

### Get the Latest Eth Blockhash

Since the ContractsSDK doesn't proveid you with the latest Eth Blockhash which is supposed to be the nonce for our AuthSig signed message we have to use the LitNodeClient to get that.

You first need to install the `LitNodeClient` or `LitNodeClientNodeJs` depending on the environment:

<Tabs
defaultValue="browser"
values={[
{label: 'Browser', value: 'browser'},
{label: 'NodeJS', value: 'nodejs'},
]}>
<TabItem value="browser">

```bash
yarn add @lit-protocol/lit-node-client@cayenne
```

</TabItem>

<TabItem value="nodejs">

```bash
yarn add @lit-protocol/lit-node-client-nodejs@cayenne
```

</TabItem>
</Tabs>

And use the nonce when crafting the authSig:

<Tabs
defaultValue="browser"
values={[
{label: 'Browser', value: 'browser'},
{label: 'NodeJS', value: 'nodejs'},
]}>
<TabItem value="browser">

```jsx
import * as LitJsSdk from "@lit-protocol/lit-node-client";

const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: 'cayenne' });
await litNodeClient.connect();

const nonce = litNodeClient.getLatestBlockhash();
```

</TabItem>

<TabItem value="nodejs">

```jsx
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({ litNetwork: 'cayenne' });
await litNodeClient.connect();

const nonce = litNodeClient.getLatestBlockhash();
```

</TabItem>
</Tabs>

**Note:** The `mintInfo` contains all the required info for the PKP including its `tokenId` & `publicKey`.

```jsx
const mintCost = await contractClient.pkpNftContract.read.mintCost(); you can check how much it costs to mint a PKP with this

const authMethod = {
  authMethodType: AuthMethodType.EthWallet,
  accessToken: JSON.stringify(authSig),
};

const mintInfo = await contractClient.mintWithAuth({
  authMethod,
  scopes: [
    AuthMethodScope.NoPermissions,
    AuthMethodScope.SignAnything,
    AuthMethodScope.OnlySignMessages,
  ],
});
```

## Check the scope for the PKP

This step isn't necessary for signing with the PKP but can be done to view whether the minted PKP has proper scopes which are required for signing. The first step is to get the `authId` from the `authMethod` as the PKP contracts stores a mapping from the `authId` & its scopes. The `3` below is just the maxScopeId which should be greater than the number of Auth Method scopes that you define.

```jsx
const authId = await LitAuthClient.getAuthIdByAuthMethod(authMethod);
await contractClient.pkpPermissionsContract.read.getPermittedAuthMethodScopes(
  mintInfo.pkp.tokenId,
  AuthMethodType.EthWallet,
  authId,
  3
);

const signAnythingScope = scopes[1];
const onlySignMessagesScope = scopes[2];
```

## Lit Action Signing with the PKP

We'll again use the `litNodeClient` to call the `executeJs` to sign the message with the PKP.

:::note
`toSign` data is required to be in 32 byte format. 

The `ethers.utils.arrayify(ethers.utils.keccak256(...)` can be used to convert the `toSign` data to the correct format.
:::

Set up the Lit Action code to be run on the Lit nodes.

```jsx
const litActionCode = `
    const go = async () => {
    // The params toSign, publicKey, sigName are passed from the jsParams fields and are available here
    const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey, sigName });
    };

    go();
`;

const signatures = await litNodeClient.executeJs({
  code: litActionCode,
  authSig,
  jsParams: {
    toSign: [84, 104, 105, 115, 32, 109, 101, 115, 115, 97, 103, 101, 32, 105, 115, 32, 101, 120, 97, 99, 116, 108, 121, 32, 51, 50, 32, 98, 121, 116, 101, 115],
    publicKey: mintInfo.pkp.publicKey,
    sigName: "sig1",
  },
});

console.log("signatures: ", signatures);
```

## Conclusion

The signatures above are the signatures from the nodes using the PKP. In Cayenne we have 3 nodes so only 2 valid signature shares are required to combine the shares. Hence you will see one od the node always fail to sign.