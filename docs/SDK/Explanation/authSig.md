---
sidebar_position: 3
---

# Wallet Signatures and Session Keys
## AuthSigs

To use Lit Protocol, you must present a wallet signature obtained from the user. This is refered to an as `AuthSig` in the documentation. You can use any EIP 4361 compliant signature (Sign in with Ethereum) for the authSig, but you must put the signature into the AuthSig data structure format (documented here https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#authsig). You do not need to use the Lit JS SDK to obtain the signature as long as it's EIP 4361 compliant and in the AuthSig data structure format.

## Format of AuthSig

The AuthSig should match this format: https://lit-protocol.github.io/lit-js-sdk/api_docs_html/#authsig

An example AuthSig:

```js
{
	"sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
	"derivedVia": "web3.eth.personal.sign",
	"signedMessage": "localhost wants you to sign in with your Ethereum account:\n0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a\n\nThis is a test statement.  You can put anything you want here.\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gzdlw7mR57zMcGFzz\nIssued At: 2022-04-15T22:58:44.754Z",
	"address": "0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a"
}
```

## Obtaining the AuthSig

You can use the built in `checkAndSignAuthMessage()` function to obtain the authSig. For example:

```js
var authSig = await LitJsSdk.checkAndSignAuthMessage({
  chain: "ethereum",
});
```

This will trigger a wallet selection popup on the user's browser. The user will be asked to sign a message proving they own their crypto address. The message will be signed with their crypto address. The signature will be returned to you as the `authSig` variable. You will need to pass this to the Lit Protocol API.

This function will save the AuthSig to local storage so that the user does not need to sign the message again. However, the user may be asked to sign it again if the signature has expired or is too old.

This function will also check the currently selected chain in the user's wallet, and if their wallet supports it, sends a request to their wallet to change to the chain passed into the `checkAndSignAuthMessage()` function. This is to ensure that the user is using the correct chain.

## Clearing the stored AuthSig

If you want to clear the authSig stored in the browser local storage, you can use the `disconnectWeb3()` function:

```js
LitJsSdk.disconnectWeb3()
```

##
##

# Session Keys and Signatures

:::note

Session Keys and Signatures are a replacement for Wallet Signatures / Auth Sigs and are still heavily in development and things may change. You can currently only use them with the Serrano branch of the lit-js-sdk on the Serrano testnet.

:::

With Lit Protocol, the user needs to prove ownership of their wallet, and this is typically done via a wallet signature, sometimes referred to as "auth sigs" in the Lit docs. However, to protect against replay attacks, and to let users scope their wallet signatures to specific resources, we've implemented a system of session keys.

It works by generating a new random ed25519 keypair in the browser, and storing it in local storage. Then, the user signs a SIWE message with their wallet which contains the session public key. This signature is stored in local storage as well. The session keypair is used to sign all requests to the Lit Protocol API, and the user's wallet signature is sent along with the request, attached as a "capability" to the session signature. Each node in the Lit Network receives a unique signature for each request, and can verify that the user owns the wallet address that signed the capability.

## Obtaining session signatures for a request

A prerequestive is that you must have a connected LitNodeClient and pass that into the getSessionSigs function.

### For a signing request

```
let resourceId = {
  baseUrl: "my-dynamic-content-server.com",
  path: "/this-is-a-path",
  orgId: "",
  role: "",
  extraData: "",
};

let hashedResourceId = await LitJsSdk.hashResourceIdForSigning(
  resourceId
);

var sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resources: [`litSigningCondition://${hashedResourceId}`],
});

var unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

// Saving signing condition
await litNodeClient.saveSigningCondition({
  unifiedAccessControlConditions,
  sessionSigs,
  resourceId,
  chain: "litSessionSign",
});

// Retrieving a signature
let jwt = await litNodeClient.getSignedToken({
  unifiedAccessControlConditions,
  sessionSigs,
  resourceId,
});
```

### For an encryption request

```
// storing the key
var sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resources: [`litEncryptionCondition://*`],
});

var unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

// encrypt
const { encryptedZip, symmetricKey } =
  await LitJsSdk.zipAndEncryptString("this is a secret message");

// store the decryption conditions
const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  unifiedAccessControlConditions,
  symmetricKey,
  sessionSigs,
});

// retrieving the key:
const hashOfKey = await LitJsSdk.hashEncryptionKey({
  encryptedSymmetricKey,
});

sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resources: [`litEncryptionCondition://${hashOfKey}`],
});

 const retrievedSymmKey = await litNodeClient.getEncryptionKey({
  unifiedAccessControlConditions,
  toDecrypt: LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  ),
  sessionSigs,
});

const decryptedFiles = await LitJsSdk.decryptZip(
  encryptedZip,
  retrievedSymmKey
);
const decryptedString = await decryptedFiles["string.txt"].async(
  "text"
);
console.log("decrypted string", decryptedString);
```

## Clearing the stored session key and signature

If you want to clear the session key stored in the browser local storage, you can use the `disconnectWeb3()` function:

```js
LitJsSdk.disconnectWeb3();
```

## Resources you can request

You can pass an array of resources to the getSessionSigs() function, which will be presented to the user in the SIWE message. Resources are things the signature is permitted to be used for. These can be specific items, such as the ID of an encryption condition, or they can be wildcards. The default is all resources with wildcards. The resources are strings that follow the format `lit<conditionType>://<resourceId>`. The conditionType can be either `SigningCondition` or `EncryptionCondition`. The resourceId is a string that uniquely identifies the resource you are requesting access to. For signing conditions, the resourceId is a hash of the resourceId JSON you are requesting access to. For encryption conditions, the resourceId is a hash of the encrypted symmetric key that you are requesting access to.

Since Session keys need the capability to sign on behalf of you and your wallet, you grant them condition types, but with the addition `Capability` at the end. For example, `litSigningConditionCapability://*` will give the session key the capability to sign on your behalf for any signing condition. `litEncryptionConditionCapability://*` will give the session key the capability to sign on your behalf for any encryption condition.

The protocol prefixes of the resources are:

| Resource                        | Protocol Prefix                     | Identifier              | Type                | Usage                                                                                                                                                                                                      |
| ------------------------------- | ----------------------------------- | ----------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encryption Condition            | litEncryptionCondition://           | Encryption condition ID | Restrictive         | Specify which encryption conditions can be processed                                                                                                                                                       |
| Signing Conditions              | litSigningCondition://              | Signing condition ID    | Restrictive         | Specify which signing conditions can be processed                                                                                                                                                          |
| A PKP                           | litPKP://                           | PKP Token ID            | Restrictive         | Specify which PKPs can be used                                                                                                                                                                             |
| A RLI NFT                       | litRLI://                           | RLI Token ID            | Restrictive         | Specify which RLIs can be used                                                                                                                                                                             |
| A Lit Action                    | litAction://                        | Lit Action IFPS ID      | Restrictive         | Specify which Lit Actions can be called                                                                                                                                                                    |
| Encryption Condition Delegation | litEncryptionConditionCapability:// | Encryption condition ID | Granting Capability | Specify which encryption conditions can be processed on behalf of this user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key. |
| Signing Conditions Delegation   | litSigningConditionCapability://    | Signing condition ID    | Granting Capability | Specify which signing conditions can be processed on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.     |
| PKP Delegation                  | litPKPCapability://                 | PKP Token ID            | Granting Capability | Specify which PLPs can be used on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.                        |
| RLI Delegation                  | litRLICapability://                 | RLI TokenID             | Granting Capability | Specify which RLIs can be used on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.                        |
| Lit Action Delegation           | litActionCapability://              | Lit Action IPFS ID      | Granting Capability | Specify which Lit Actions can be called on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.               |
|                                 |                                     |                         |                     |                                                                                                                                                                                                            |

# Auth Sigs

Currently, an auth sig looks like this:

```jsx
{
	sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
	derivedVia: "web3.eth.personal.sign",
	signedMessage: "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
	address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
}
```

Session signatures have a new field, “capabilities”, which is an array of one or more signatures. Those signatures would have the address from the top level AuthSig in their URI field. These capabilities authorize this AuthSig address to utilize the resources specified in the capabilities SIWE messages.

# Session Keys

When the user “signs into” Lit, we generate a random session key for them. They sign that session pubkey as the “URI” of a SIWE message which creates a capability signature. There is a default expiration time of 1 week, but this is configurable. This signature and the session key are stored in the localstorage of the browser.

When the user sends a request, the session key signs it and sends the signature with the request. The capability signature is also sent. Multiple capability signatures can be attached. Therefore, the AuthSig presented to the nodes is actually the session key AuthSig with the capability signatures attached. The SDK will use the session key to scope the AuthSig for each request to the specific resource and node being addressed. This prevents replay attacks.

Specifically, The SDK generates the random session keypair called "sessionKey". The user is presented with a SIWE message with the URI `sessionKey:ed25519:<actualSessionPubkeyHere>` and resources of `litEncryptionConditionCapability://*`, `litSigningConditionCapability://*`, `litPKPCapability://*`, `litRLICapability://*`, and `litActionCapability://*`. These “Capability” portion of these resource protocol prefixes indicate that this signature cannot be used on it’s own for those resources and only the session key signature can be used. This prevents someone from using a capability signature as a top-level authsig.

## Letting a user use your rate limit nft

Alice owns a rate limit NFT and wants to let Bob use it, but only for specific Lit Actions or another Resource or set of Resources.

Alice can create a SIWE signature with Bob’s session key in the URI field `sessionKey:ed25519:<bobsSessionKeyHere>` and the resources `litRLICapability://<RLITokenIdHere>`, and `litActionCapability://<litActionIpfsIdHere>`.

Bob can attach this signature as a capability when he sends his AuthSig to the nodes.

## Letting a user use your PKP for a specific Lit Action

Alice owns a PKP and wants use it with a specific Lit Action that she has not authorized yet. She could use the smart contract and addPermittedAction(), run the function, then removePermittedAction() function, but would prefer not to spend the gas and wait for blocks etc.

When Alice creates a capability by signing the session key, she specifies the resources `litPKPCapability://<pkpIdHere>` and `litActionCapability://<litActionIpfsIdHere>`.

The SDK can attach this signature as a capability when it sends the AuthSig to the nodes.
