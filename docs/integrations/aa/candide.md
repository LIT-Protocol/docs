# Recover a Safe Account with Google using AbstractionKit

This is the second of two guides that demonstrate how to recover a Safe smart wallet using a Google account. The first guide focuses on adding the recovery method, while this guide focuses on executing the actual recovery process. We recommend starting with guide number one which can be found [here](https://docs.candide.dev/wallet/guides/recovery-with-google-using-lit/).

## What is AbstractionKit?
AbstractionKit is a Typescript Library that enables developers to easily build on Account Abstraction, with first class support for Safe Accounts. One of the unique use cases enabled by AbstractionKit is the ability for users to add a recovery method(s) as a backup to their account in the case that they lose access to their main signing key.

You can combine Lit with AbstractionKit to enable a powerful social recovery experience for your users while using Smart Accounts for gas sponsorship, transaction batching, and more.

### Relevant Links
For additional information during this guide:

- [How on-chain guardian recovery works](https://docs.candide.dev/wallet/plugins/recovery-with-guardians/)
- [Guardian Recovery SDK Reference](https://docs.candide.dev/blog/making-accounts-recoverable/)
- [Simple Recovery example on GitHub](https://github.com/candidelabs/abstractionkit/tree/experimental/examples/SafeAccountExamples/SocialRecovery)

### Complete Code Example
If you would like to see the complete code example, you can find it [here](https://github.com/LIT-Protocol/lit-candide).

### Installation
Install required dependencies
```
npm i abstractionkit@0.1.12 @lit-protocol/lit-node-client @lit-protocol/lit-auth-client @lit-protocol/constants
```

### Configure .env file
Configure the following values within the repository `.env` file:

```jsx
// Lit
LIT_API_KEY= // Request Relay Server API Key from Lit at https://forms.gle/RNZYtGYTY9BcD9MEA

// Candide
BUNDLER_URL="https://sepolia.voltaire.candidewallet.com/rpc" // Other networks are found here: https://docs.candide.dev/wallet/bundler/rpc-endpoints
PAYMASTER_URL= // Request an API key from Candide on Discord
    
// Generate a Public/Private Key
OWNER_PUBLIC_ADDRESS=
OWNER_PRIVATE_KEY=
NEW_OWNER_PUBLIC_ADDRESS=

// Network Info
VITE_CHAIN_ID=
JSON_RPC_NODE_PROVIDER= // Get an RPC from a Node provider
```

### Sign in with Google using Lit

#### Initialize the Lit Network Connection and GoogleProvider

- Connect to the Lit Network using LitNodeClient.
- Set up the LitRelay for authentication.
- Initialize a GoogleProvider for Google sign-in.

```jsx
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitRelay } from "@lit-protocol/lit-auth-client";
import { GoogleProvider } from "@lit-protocol/providers";
import { PROVIDER_TYPE, LIT_NETWORK } from "@lit-protocol/constants";

const initalizeClientsAndProvider = async () => {
  const litNodeClient = new LitNodeClient({
    litNetwork: LIT_NETWORK.DatilDev,
    debug: true,
  });
  await litNodeClient.connect();

  const litRelay = new LitRelay({
    relayUrl: LitRelay.getRelayUrl(LIT_NETWORK.DatilDev),
    relayApiKey: 'test-api-key',
  });
  console.log("Connected to Lit Nodes and Lit Relay ✔️");

  const provider = new GoogleProvider({ relay: litRelay, litNodeClient });

  return { litNodeClient, litRelay, provider };
};
```

#### Authentication with Gmail

- Generate an AuthMethod using the GoogleProvider
- Check if the user is already authenticated. If not, redirect to Google sign-in

```jsx
import { AuthMethod } from "@lit-protocol/types";

const generateAuthMethod = async () => {
  const url = new URL(window.location.href);
  if (!url.searchParams.get("provider")) {
    console.log("Signing in with Google...");
    provider.signIn((url) => {
      window.location.href = url;
    });
  } else if (url.searchParams.get("provider") === "google") {
    const authMethod = await provider.authenticate();
    return authMethod;
  }
};

const authMethod = await generateAuthMethod();
if (!authMethod) {
  return;
}
```

#### Mint PKP (Programmable Key Pair)

```jsx
import { LitRelay } from "@lit-protocol/lit-auth-client";

const mintWithGoogle = async (authMethod) => {
  const litRelay = new LitRelay({
    relayUrl: LitRelay.getRelayUrl(LIT_NETWORK.DatilDev),
    relayApiKey: 'test-api-key',
  });
  
  const pkp = await litRelay.mintPKPWithAuthMethods([authMethod], {
    addPkpEthAddressAsPermittedAddress: true
  });
  console.log("Fetched PKP", pkp);
  return pkp;
};

const pkp = await mintWithGoogle(authMethod);
console.log("Minted PKP ✔️");
```

#### Get the Google Guardian Signer

```jsx
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { LIT_ABILITY, LitPKPResource } from "@lit-protocol/auth-helpers";
import { AuthCallbackParams } from "@lit-protocol/types";
import { LIT_RPC } from "@lit-protocol/constants";

const authNeededCallback = async (params: AuthCallbackParams) => {
console.log(`auth needed callback params`, JSON.stringify(params, null, 2));
const response = await litNodeClient.signSessionKey({
  statement: params.statement,
  authMethods: [authMethod],
  resourceAbilityRequests: [
    {
      resource: new LitPKPResource("*"),
      ability: LIT_ABILITY.PKPSigning,
    },
  ],
  expiration: params.expiration,
  resources: params.resources,
  chainId: 1,
  pkpPublicKey: pkp.pkpPublicKey,
});
return response.authSig;
};

const guardianSigner = new PKPEthersWallet({
  litNodeClient,
  authContext: {
    getSessionSigsProps: {
      chain: "ethereum",
      expiration: new Date(Date.now() + 60_000 * 60).toISOString(),
      resourceAbilityRequests: [
        {
          resource: new LitPKPResource("*"),
          ability: LIT_ABILITY.PKPSigning,
        },
      ],
      authNeededCallback: authNeededCallback,
    },
  },
  pkpPubKey: pkp.pkpPublicKey,
  rpc: LIT_RPC.CHRONICLE_YELLOWSTONE,
});
console.log("Created PKPEthersWallet using the PKP ✔️");
```

### Start the Recovery Process

#### Initialize the Safe Account Class

```jsx
import { SafeAccountV0_2_0 as SafeAccount } from "abstractionkit";

const smartAccount = SafeAccount.initializeNewAccount([ownerPublicAddress]);
console.log("Smart Account Address: ", smartAccount.accountAddress);
Repare The Recovery Transaction
import { SocialRecoveryModule } from "abstractionkit";

const srm = new SocialRecoveryModule();

const initiateRecoveryMetaTx = srm.createConfirmRecoveryMetaTransaction(
    smartAccount.accountAddress,
    [newOwnerPublicAddress],
    1, // new threshold
    true // whether to auto-start execution of recovery
);

let userOperationRecovery = await guardianSmartAccount.createUserOperation(
    [initiateRecoveryMetaTx],
    process.env.JSON_RPC_NODE_PROVIDER,
    process.env.BUNDLER_URL
);
```

#### Sponsor the Gas

```jsx
import { CandidePaymaster } from "abstractionkit";
import ethers from "ethers"

// Sponsor the recovery transaction using the paymaster
const paymasterUrl = process.env.PAYMASTER_URL;
const paymaster = new CandidePaymaster(paymasterUrl);

userOperationRecovery = await paymaster.createSponsorPaymasterUserOperation(
    userOperationRecovery,
    process.env.BUNDLER_URL
);
```

#### Sign and Submit UserOperation
```jsx
// Sign
const domain = {
  chainId: process.env.CHAIN_ID,
  verifyingContract: smartAccount.safe4337ModuleAddress,
};
const types = SafeAccount.EIP712_SAFE_OPERATION_TYPE;
// formate according to EIP712 Safe Operation Type
const { sender, ...userOp } = userOperation;
const safeUserOperation = {
  ...userOp,
  safe: userOperation.sender,
  validUntil: BigInt(0),
  validAfter: BigInt(0),
  entryPoint: smartAccount.entrypointAddress,
};
const signature = await guardianSigner.signTypedData(domain, types, safeUserOperation);
const formatedSig = SafeAccount.formatEip712SignaturesToUseroperationSignature([ownerPublicAddress], [signature]);
userOperationRecovery.signature = signature;

// Submit
const sendUserOpResponseRecovery =
    await guardianSmartAccount.sendUserOperation(
      userOperationRecovery,
      process.env.BUNDLER_URL
);
```

#### Monitor UserOp
```jsx
// Wait for receipt
const userOpReceiptResultRecovery = await sendUserOpResponseRecovery.included();

console.log(userOpReceiptResultRecovery);
```

### Finalize the Recovery
After the grace period is over, you can finalize the recovery

#### Prepare the Finalization UserOp
```jsx
const finalizeRecoveryMetaTx = srm.createFinalizeRecoveryMetaTransaction(
    smartAccount.accountAddress
);

let userOperationFinalizeRecovery = await guardianSmartAccount.createUserOperation(
    [finalizeRecoveryMetaTx],
    process.env.JSON_RPC_NODE_PROVIDER,
    process.env.BUNDLER_URL
);
```

#### Sponsor the Gas
```jsx
// Add gas sponsorship info using paymaster
userOperationFinalizeRecovery = await paymaster.createSponsorPaymasterUserOperation(
    userOperationRecovery,
    process.env.BUNDLER_URL
);
```

#### Sign and Submit
```jsx
// Sign userOperation
const domain = {
  chainId: process.env.CHAIN_ID,
  verifyingContract: smartAccount.safe4337ModuleAddress,
};

const types = SafeAccount.EIP712_SAFE_OPERATION_TYPE;

// formate according to EIP712 Safe Operation Type
const { sender, ...userOp } = userOperation;
const safeUserOperation = {
  ...userOp,
  safe: userOperation.sender,
  validUntil: BigInt(0),
  validAfter: BigInt(0),
  entryPoint: smartAccount.entrypointAddress,
};

const signature = await guardianSigner.signTypedData(domain, types, safeUserOperation);
const formatedSig = SafeAccount.formatEip712SignaturesToUseroperationSignature([ownerPublicAddress], [signature]);

userOperationRecovery.signature = signature;


// Submit userOperation
const sendUserOperationResponseRecovery = await guardianSmartAccount.sendUserOperation(
    userOperationRecovery,
    process.env.BUNDLER_URL
);
```

#### Monitor UserOperation

```jsx
const userOperationReceiptResultRecovery = await sendUserOperationResponseRecovery.included();

console.log(userOperationReceiptResultRecovery);
```
That's it! You've successfully recovered an account with a Google Account using Lit.

Find here the complete [doc page for Account Recovery](https://docs.candide.dev/wallet/plugins/recovery-with-guardians/).