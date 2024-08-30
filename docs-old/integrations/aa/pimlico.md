import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pimlico

Learn how to use Lit Protocol's one time password (OTP) sign-in (email, SMS, and Whatsapp) with a smart account whose user operations are relayed and sponsored by [Pimlico](https://www.pimlico.io/).



---

import FeedbackComponent from "@site/src/pages/feedback.md";

## Objectives
At completion of this reading you should be able to:

- Explain what Pimlico is and the services it provides with smart accounts.
- Understand how to set up Lit with Pimlico.

---

## What is Pimlico?

[Pimlico](https://www.pimlico.io/) is an infrastructure platform for building the next generation of smart accounts. If you are developing an ERC-4337 smart account, we provide bundlers, verifying paymasters, ERC-20 paymasters, and much more to help you build a more stable wallet and iterate faster.

## Guide

This how-to guide walks you through the steps to integrate Lit's OTP sign-in with email, SMS, and Whatsapp with a smart account whose user operations are relayed and sponsored by Pimlico.


### Pre-requisites
- Familiarity with JavaScript.
- Reading Pimlico's [tutorial 1](https://docs.pimlico.io/tutorial/tutorial-1) to get an understanding of Pimlico and how Lit might fit in as a signer. This will be relevant to later steps in the guide.
- Obtain a Lit relay server by filling out this [form](https://forms.gle/RNZYtGYTY9BcD9MEA).


### 1. Setup

#### **Installing packages**

```bash
npm install stytch @lit-protocol/pkp-ethers @lit-protocol/lit-auth-client @lit-protocol/auth-helpers @lit-protocol/types @lit-protocol/lit-node-client-nodejs
```

#### **Make an account with Stytch and get the Project ID and Secret**

You can sign up for a Stytch account [here](https://stytch.com/). 

Once you have an account, you can find your Project ID and Secret in the [Stytch Dashboard API Keys page](https://stytch.com/dashboard/api-keys).

![Stytch dashboard image](/img/stytch_pimlico.png)


### 2. Create a Stytch client with your Project ID and Secret

In a new JavaScript file create and initialize the Stytch client.

```js
const stytchClient = new stytch.Client({
    project_id: "project-test-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    secret: "secret-test-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
});

```

### 3. Send an OTP to the user's email, SMS, or Whatsapp
<Tabs
defaultValue="email"
values={[
{label: 'Email', value: 'email'},
{label: 'SMS', value: 'sms'},
{label: 'WhatsApp', value: 'whatsapp'},
]}>
<TabItem value="email">

```js
const stytchResponse = await stytchClient.otps.email.loginOrCreate({
    email: "<Your Email Address>",
})
```

</TabItem>

<TabItem value="sms">

```js
const stytchResponse = await stytchClient.otps.sms.loginOrCreate({
    phone_number: "<Your Phone Number>",
})
```

</TabItem>

<TabItem value="whatsapp">

```js
const stytchResponse = await stytchClient.otps.whatsapp.loginOrCreate({
    phone_number: "<Your Phone Number>",
})
```

</TabItem>
</Tabs>


### 4. Authenticate the user with the OTP and get a session token

<Tabs
defaultValue="email"
values={[
{label: 'Email', value: 'email'},
{label: 'SMS & WhatsApp', value: 'sms-whatsapp'},
]}>
<TabItem value="email">

```js
const authResponse = await stytchClient.otps.authenticate({
    method_id: stytchResponse.email_id,
    code: otpResponse.code,
    session_duration_minutes: 60 * 24 * 7,
})
 
const sessionStatus = await stytchClient.sessions.authenticate({
    session_token: authResponse.session_token,
})
```
</TabItem>

<TabItem value="sms-whatsapp">

```js
const authResponse = await stytchClient.otps.authenticate({
    method_id: stytchResponse.phone_id,
    code: otpResponse.code,
    session_duration_minutes: 60 * 24 * 7,
})
 
const sessionStatus = await stytchClient.sessions.authenticate({
    session_token: authResponse.session_token,
})
```
</TabItem>
</Tabs>


### 5. Get a Lit Relay Server API Key
Checking in! If you didn't complete the pre-req of getting a Lit relay key, you can get it by filling out this [form](https://forms.gle/RNZYtGYTY9BcD9MEA) and the Lit development team will get back to you shortly. 

You can also ping the Lit developement team on [Discord](https://litgateway.com/discord) once you fill out the form. 


### 6. Mint a PKPs through Lit Protocol

```js
const litClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<Your Lit Relay Server API Key>',
    }
});
 
const session = litClient.initProvider(ProviderType.StytchOtp, {
    userId: sessionStatus.session.user_id,
    appId: "project-test-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
})
 
const authMethod = await session.authenticate({ 
    accessToken: sessionStatus.session_jwt 
})
 
await session.mintPKPThroughRelayer(authMethod)
const pkps = await session.fetchPKPsThroughRelayer(authMethod)
```


### 7. Generate the Controller Session Signatures or its context to generate them on demand

```js
const litNodeClient = new LitNodeClientNodeJs({
    litNetwork: "datil-dev",
    debug: false,
})
await litNodeClient.connect();
 
const resourceAbilities = [
    {
        resource: new LitActionResource("*"),
        ability: LitAbility.PKPSigning,
    },
];
 
const sessionKeyPair = litNodeClient.getSessionKey();
 
const authNeededCallback = async (params: AuthCallbackParams) => {
    const response = await litNodeClient.signSessionKey({
        sessionKey: sessionKeyPair,
        statement: params.statement,
        authMethods: [authMethod],
        pkpPublicKey: pkp[pkp.length - 1].publicKey,
        expiration: params.expiration,
        resources: params.resources,
        chainId: 1,
    });
    return response.authSig;
};
 
// Not needed when passing authContext to PKPEthersWallet
const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    resourceAbilityRequests: resourceAbilities,
    sessionKey: sessionKeyPair,
    authNeededCallback	
}).catch((err) => {
    console.log("error while attempting to access session signatures: ", err)
    throw err;
});
```

It is recommended to generate the `authContext` to create sessionSigs on demand. That way you won't have to worry about refreshing them when they expire or network conditions have changed.

You can check more in the [Authentication section](../../sdk/authentication/overview)


### 8. Initialize the PKP Wallet
We will now generate a wallet that can act a regular Ethers.js wallet, but will use the PKPs minted through Lit to sign transactions under the hood.

```js
const pkpWallet = new PKPEthersWallet({
  pkpPubKey: pkp[pkp.length - 1].publicKey,
  rpc: "<standard RPC URL for the chain you are using>", // e.g. https://rpc.ankr.com/eth_goerli
  authContext: {
    client: litNodeClient,
    getSessionSigsProps: {
      chain: 'ethereum',
      expiration: new Date(Date.now() + 60_000 * 60).toISOString(),
      resourceAbilityRequests: resourceAbilities,
      authNeededCallback,
    },
  },
  // controllerSessionSigs: sesionSigs, // (deprecated) If you will be passing sessionSigs directly, do not pass authContext
});
 
await pkpWallet.init();
```


### 9. Use the PKP Wallet to sign user operations and send them through Pimlico

You can now use the `pkpWallet` as a regular Ethers.js wallet to sign user operations. 

To submit a user operation to Pimlico, you can follow the steps to sponsor a user operation with Pimlico's verifying paymaster and/or submit a user operation through Pimlico's bundler. If you would like to integrate Lit with the full flow of generating, signing, and submitting a user operation, you can follow the steps in [tutorial 1](https://docs.pimlico.io/tutorial/tutorial-1), replacing the signing step with the PKP wallet and using `pkpWallet.address` as the owner address of the smart account.

Modified from Plimlico's [tutorial 1](https://docs.pimlico.io/tutorial/tutorial-1), an example of how to use the PKP wallet to sign a user operation is shown below:

```js
const signature = await pkpWallet.signMessage(
	ethers.utils.arrayify(await entryPoint.getUserOpHash(userOperation)),
)
 
userOperation.signature = signature
```

And an example of how you would generate the `initCode` for a [SimpleAccount](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/SimpleAccount.sol) using the PKP wallet is shown below:

```js
const initCode = ethers.utils.hexConcat([
	SIMPLE_ACCOUNT_FACTORY_ADDRESS,
	simpleAccountFactory.interface.encodeFunctionData("createAccount", [pkpWallet.address, 0]),
])
```


## Next steps

Continue exploring Lit by reading more about [programmable signing](../../concepts/programmable-signing-concept.md). 

Check out [more examples](https://docs.pimlico.io/tutorial) from Pimlico.

<FeedbackComponent/>
