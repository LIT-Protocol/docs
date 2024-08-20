import FeedbackComponent from "@site/src/pages/feedback.md";

# Mint via Contracts

You can mint a PKP NFT from the PKP contract on Chronicle Yellowstone - Lit's custom EVM rollup testnet - using:
1. The [Lit explorer](https://explorer.litprotocol.com)
2. The Lit relayer (sign up for an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA))
3. The contracts directly using the [contracts-sdk](https://js-sdk.litprotocol.com/modules/contracts_sdk_src.html) ([Here](https://chain.litprotocol.com/address/0xDe905Fde36562270AA6FEeBAbC5aB1f440f733c2) is the handy helper contract on Chronicle Yellowstone to mint and assign auth methods. You can view all of the deployed contract addresses [here](https://github.com/LIT-Protocol/networks/tree/main/)).

The NFT represents root ownership of the PKP. The NFT owner can grant other users (via a wallet address) or grant Lit Actions the ability to use the PKP to sign and decrypt data. They also have the ability to assign additional authentication methods, described at the bottom of the page.


## Installing the required packages
```bash
yarn add @lit-protocol/lit-auth-client
yarn add @lit-protocol/contracts-sdk
```

## Initializing your `LitContract` instance
```js
import { LitContracts } from '@lit-protocol/contracts-sdk';

// if no signer is provided, it will attempt to use window.etheruem
const contractClient = new LitContracts({ signer });
await contractClient.connect();
```

## Minting a PKP and adding permitted scopes
Permitted scopes are a crucial part of defining the capabilities of authentication methods. They determine what actions an authentication method can perform within the system. For instance, the `SignAnything` scope allows an auth method to sign any data, while the `PersonalSign` scope restricts it to signing messages using the EIP-191 scheme. 

You can also set scopes: `[]` which will mean that the auth method can only be used for authentication, but not authorization. This means that the auth method can be used to prove that the user is who they say they are, but cannot be used to sign transactions or messages. You can read more about Auth Method scopes [here](https://v6-api-doc-lit-js-sdk.vercel.app/interfaces/types_src.MintWithAuthParams.html#scopes).

The following code block demonstrates how to mint a PKP with specific permitted scopes:

```js
import { AuthMethodScope, AuthMethodType } from '@lit-protocol/constants';

const authMethod = {
  authMethodType: AuthMethodType.EthWallet,
  accessToken: JSON.stringify(authSig),
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

## Minting PKPs using the Lit relayer 

The relayer is an open source project, and we run one for your use.  The source code is available [here](https://github.com/LIT-Protocol/relay-server).  If you want to use our Relayer, you'll need a free API key which you can get by filling out [this form](https://forms.gle/RNZYtGYTY9BcD9MEA).

## Authenticating using `signMessage` Callback
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

## Authenticating using `Web3 Provider`
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
<FeedbackComponent/>
