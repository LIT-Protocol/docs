# Minting a PKP
This page will walk you through the process of creating PKPs using the [V3 SDK](../../migration/overview), including adding [permitted scopes](../wallets/auth-methods#auth-method-scopes), which are now required in order to create [session signatures](../authentication/session-sigs/intro). 

## Mint via Contracts

You can mint a PKP NFT from the PKP contract on Chronicle - Lit's custom EVM rollup testnet - using the [Lit explorer](https://explorer.litprotocol.com/mint-pkp), the Lit relayer (sign up for an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA)) or the contracts directly using the [contracts-sdk](https://js-sdk.litprotocol.com/modules/contracts_sdk_src.html). 

The NFT represents root ownership of the PKP. The NFT owner can grant other users (via a wallet address) or grant Lit Actions the ability to use the PKP to sign and decrypt data. They also have the ability to assign additional authentication methods, described at the bottom of the page.

You can also use the handy helper contract on Chronicle [here](https://chain.litprotocol.com/address/0xDe905Fde36562270AA6FEeBAbC5aB1f440f733c2) to mint and assign auth methods, as well as view all of the deployed contract addresses [here](https://github.com/LIT-Protocol/networks/tree/main/cayenne).

### Installing the required packages
```bash
yarn add @lit-protocol/lit-auth-client
yarn add @lit-protocol/contracts-sdk
```

### Initializing your `LitContract` instance
```js
import { LitContracts } from '@lit-protocol/contracts-sdk';

// if no signer is provided, it will attempt to use window.etheruem
const contractClient = new LitContracts({ signer });
await contractClient.connect();
```

### Minting a PKP and adding permitted scopes
```js
import { AuthMethodScope } from '@lit-protocol/constants';

const authMethod = {
  authMethodType: AuthMethodType.EthWallet,
  accessToken: '...',
};

const mintInfo = await contractClient.mintWithAuth({
  authMethod: authMethod,
  scopes: [
		// AuthMethodScope.NoPermissions,
		AuthMethodScope.SignAnything, 
		AuthMethodScope.PersonalSign
	],
});

// output:
{
  pkp: {
      tokenId: string;
      publicKey: string;
      ethAddress: string;
  };
  tx: ethers.ContractReceipt;
}
```

### Minting PKPs using the Lit relayer 

The relayer is an open source project, and we run one for your use.  The source code is available [here](https://github.com/LIT-Protocol/relay-server).  If you want to use our Relayer, you'll need a free API key which you can get by filling out [this form](https://forms.gle/RNZYtGYTY9BcD9MEA).

### Authenticating using `signMessage` Callback
If you wish to sign with an ethers wallet type or `signer` you may use the `signMessage` callback to implement a signing callback for the `SIWE` message.
```js
import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { AuthMethodScope, AuthMethodType, ProviderType } from '@lit-protocol/constants';
import * as ethers from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("your rpc url");
let wallet = new ethers.Wallet("your wallet private key", provider);
const authProvider = litAuthClient.initProvider(ProviderType.EthWallet);

let authMethod = authProvider.authenticate({
  signMessage: (message: string) => {
    return await wallet.signMessage(message);
  }
});

// -- setting scope for the auth method
// <https://developer.litprotocol.com/v3/sdk/wallets/auth-methods/#auth-method-scopes>
const options = {
  permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
};

const mintTx = await authProvider.mintPKPThroughRelayer(
  authMethod,
  options
);
```

### Authenticating using `Web3 Provider`
In the case where you wish to generagte a signature from a browser extension wallet (MetaMask, Brave Wallet, etc)
you may simply call `authenticate` which calls `checkAndSignAuthMessage`.
```js
import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { AuthMethodScope, AuthMethodType, ProviderType } from '@lit-protocol/constants';
import {Wallet} from 'ethers';

const authProvider = litAuthClient.initProvider(ProviderType.EthWallet);

// Will call `checkAndSignAuthMessage({chain: ethereum})`
let authMethod = await authProvider.authenticate({chain: "ethereum"});

// -- setting scope for the auth method
// <https://developer.litprotocol.com/v3/sdk/wallets/auth-methods/#auth-method-scopes>
const options = {
  permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
};

const mintTx = await authProvider.mintPKPThroughRelayer(
  authMethod,
  options
);
```


**Demos**: 
1. [Minting a PKP with an auth method and permitted scopes (Easy)](https://github.com/LIT-Protocol/js-sdk/blob/feat/SDK-V3/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-and-set-scope-1-2-easy.mjs)

2. [Minting a PKP with an auth method and permitted scopes (Advanced)](https://github.com/LIT-Protocol/js-sdk/blob/feat/SDK-V3/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-and-set-scope-1-advanced.mjs)

3. [Minting a PKP with no permissions, then add permitted scopes](https://github.com/LIT-Protocol/js-sdk/blob/feat/SDK-V3/e2e-nodejs/group-contracts/test-contracts-write-mint-a-pkp-then-set-scope-1.mjs)

4. [Minting a PKP using the relayer, adding permitted scopes, and getting session sigs](https://github.com/LIT-Protocol/js-sdk/tree/feat/SDK-V3/e2e-nodejs/group-pkp-session-sigs)

## Mint via Social or Email/SMS (OTP) 

### Social

You can mint a PKP by presenting a valid OAuth token as an authentication method to the Lit Relay server. Currently, only Google OAuth tokens are supported, but we plan to support Discord in the near term. 


### Email / SMS (OTP)

You can mint a PKP by presenting a generated token from sucessful OTP code confirmation, which will be returned by the `lit-auth-client` in the `AuthMethod` return from successful code confirmation.

Read more about this process [here](../wallets/auth-methods.md).

## Mint via WebAuthn

You can mint a PKP by presenting a valid WebAuthn credential generated by your browser to the Lit Relay server. 

We have a frontend that helps with this process at https://pkp-walletconnect.vercel.app/.

We currently support both username-based and username-less WebAuthn registration, and usernames are purely used for your convenience / reference on the client-side.

### Technical Details

#### Contract Specifics

- The `authMethodId` is derived from the credential's [rawId](https://www.w3.org/TR/webauthn-2/#dom-publickeycredential-rawid) parameter.
- The `authMethodPubkey` is the [COSE credential public key](https://datatracker.ietf.org/doc/html/rfc8812). **We currently only support Elliptic Curve COSE Key Type IDs**.

#### Relying Parties and Supported Origins

In order to allow for various frontends to integrate with our platform, we plan to support any domain to act as a [Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) in the long run. However, we are in the process of slowly rolling out this authentication method currently maintain an allowlist of origins / domains that can integrate with the Lit network.

#### Challenge-Free Registration

We do not currently use challenges as part of our PKP minting / WebAuthn registration process and only use it for the PKP / WebAuthn authentication step.
