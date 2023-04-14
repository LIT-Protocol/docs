---
sidebar_position: 2
---

# Coming Soon: Session Signatures

:::note

Session Keys and Signatures are a replacement for Wallet Signatures / Auth Sigs and are still heavily in development and things may change. You can currently only use them on the Serrano testnet.

:::

## Background

With Lit Protocol, the user needs to prove ownership of their wallet, and this is typically done via a wallet signature, sometimes referred to as AuthSigs in the Lit docs. However, in order to protect against replay attacks, to let users scope and delegate specific capabilities to specific resources, and to deliver a good user experience, we've implemented support for session signatures (enabled by session keys) during authentication.

## SessionSigs

We refer to a session signature obtained from the user via session keys as a SessionSig.

SessionSigs are produced by a ed25519 keypair that is generated randomly on the browser - these are stored in local storage. The first step to producing SessionSigs is to first obtain an AuthSig through an authentication method like Google OAuth (example [here](https://github.com/LIT-Protocol/oauth-pkp-signup-example/blob/main/src/App.tsx#L398)). By specifying the session keypair's public key in the signature payload of the AuthSig, users can choose which specific actions to delegate to the session keypair for operating upon certain resources. This AuthSig is stored in local storage as well.

The session keypair is used to sign all requests to the Lit Protocol API, and the user's AuthSig is sent along with the request, attached as a "capability" to the session signature. Each node in the Lit Network receives a unique signature for each request, and can verify that the user owns the wallet address that signed the capability.

### An Improved User Experience

The steps to obtain an AuthSig requires an interactive experience that involves manual steps from the end-user - whether clicking through the Google OAuth flow, placing their fingerprint on their platform authenticators, or clicking through their the respective modals of their externally-owned accounts (eg. MetaMask). These manual steps can be friction that drives users away from applications.

On the other hand, the steps to obtain a SessionSig is completely non-interactive. The session keys and signature can all be done programmatically once an AuthSig has been obtained. 

For these reasons, by designing AuthSigs to have a long validity period and SessionSigs to have a short validity period, we open up opportunities to develop user experiences that strike a good balance between a smooth user experience and security:
- User Experience: Since we store the AuthSig in local storage, we can always retrieve it and continue to use it for as long as it is valid.
- Security: SessionSigs allow us to scope specific capabilties against a narrow set of resources that is performed during a (usually) small time window that the user is on the application.

## Format of SessionSigs

Given the following example AuthSig,

```json
{
    "sig": "0xef8f88fb285f006594637257034226923e3bbf7c6c69f8863be213e50a1c1d7f18124eefdc595b4f50a0e242e8e132c5078dc3c52bda55376ba314e08da862e21a",
    "derivedVia": "web3.eth.personal.sign",
    "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:
        0x5259E44670053491E7b4FE4A120C70be1eAD646b
        
        
        URI: lit:session:6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a
        Version: 1
        Chain ID: 1
        Nonce: ZfYjGsNyaDDFlaftP
        Issued At: 2022-10-30T08:25:33.371Z
        Expiration Time: 2022-11-06T08:25:33.348Z
        Resources:
        - urn:recap:eyJkZWYiOlsibGl0U2lnbmluZ0NvbmRpdGlvbiJdLCJ0YXIiOnsicmVzb3VyY2VJZCI6WyJsaXRFbmNyeXB0aW9uQ29uZGl0aW9uIl19fQ==",
    "address":"0x5259E44670053491E7b4FE4A120C70be1eAD646b"
}
```

Here is an example SessionSig that uses a session keypair to sign the AuthSig above:

```json
{
    "sig": "0196a7e5b8271e287fc376af3ae35955cac1009149b9b9eab4c5f8c845ca20658f937a42b7c03a8884573b801de1c36f9fa8a6d2f3ba432dc4326443c114c40c",
    "derivedVia": "litSessionSignViaNacl",
    "signedMessage": '{
        "sessionKey": "6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a",
        "resources": ["litSigningCondition://123"],
        "capabilities": [{
            "sig": "0xef8f88fb285c0065946f7257034226923e3bbf7c6c69f8863be213e50a1c1d7f18124eefdc595b4f50a0e242e8e132c5078dc3c52bda55376ba314e08da862e21a",
            "derivedVia": "web3.eth.personal.sign",
            "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:
                0x5259E44670053491E7b4FE4A120C70be1eAD646b
                
                
                URI: lit:session:6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a
                Version: 1
                Chain ID: 1
                Nonce: ZfYjGsNyaDDFlaftP
                Issued At: 2022-10-30T08:25:33.371Z
                Expiration Time: 2022-11-06T08:25:33.348Z
                Resources:
                - urn:recap:eyJkZWYiOlsibGl0U2lnbmluZ0NvbmRpdGlvbiJdLCJ0YXIiOnsicmVzb3VyY2VJZCI6WyJsaXRFbmNyeXB0aW9uQ29uZGl0aW9uIl19fQ==",
            "address":"0x5259E44670053491E7b4FE4A120C70be1eAD646b"
        }],
        "issuedAt": "2022-10-30T08:27:01.667Z",
        "expiration": "2022-10-30T08:32:01.667Z",
        "nodeAddress": "https://node2.litgateway.com:7370"
    }',
    "address": "6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a",
    "algo": "ed25519"
}
```

Here is what each field means:

- `sig` is the signature produced by the ed25519 keypair signing the `signedMessage` payload
- `derivedVia` should be `litSessionSignViaNacl` and specifies that the SessionSig object was created via the `NaCl` library.
- `signedMessage` is the payload that was signed by the session keypair. 
- `address` is the session keypair public key.
- `algo` is the signing algorithm used to generate the session signature.

### Signed Message

Here is what each field in `signedMessage` means:

- `sessionKey` is the session keypair public key.
- `resources` is the specific resources that the SessionSig is authenticating in order to operate on.
- `capabilities` is an array of one or more AuthSigs.
- `issuedAt` is the time the SessionSig was issued.
- `expiration` is the time the SessionSig becomes invalid.
- `nodeAddress` is the specific URL the SessionSig is meant for.

#### Capabilities

The `capabilities` field is an array of one or more signatures. These capabilities authorize this AuthSig address to utilize the resources specified in the capabilities SIWE messages. These signatures would have the address from the top level AuthSig in their URI field. For example, notice the following in the AuthSig above:

```
URI: lit:session:6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a
```

#### Node Address

The `nodeAddress` will be different for each node, which means that, for a 30-node network, the SDK will generate 30 different `sig` and `signedMessage` parameters.


## Obtaining the SessionSig

A prerequesite is that you must have a connected LitNodeClient and pass that into the getSessionSigs function.

```javascript
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
```

Once obtained, you can replace where you provide `authSig` with the new `sessionSigs` object. Below are some examples.

### Making Signing Requests

```javascript
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

### Making Encryption Requests

```javascript
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

## Obtaining the SessionSig in NodeJS

You can use any wallet or signing method with session signatures because the `getSessionSigs()` function supports passing a callback called `authNeededCallback` that will be fired when a wallet signature is needed. You can see a code example of this [here](https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/sessionKeys.js#L31).

The `getSessionSigs()` function will generate a session key for you automatically and attempt to store it in LocalStorage. In case you have not polyfilled LocalStorage, you may instead generate the session key yourself using `generateSessionKeyPair()` and store it however you like. You can then pass it to `getSessionSigs()` as the `sessionKey` param.

## Obtaining the SessionSig when user doesn't have a wallet

You can use Oauth login with services including Discord and Google when the user doesn't have a wallet. You can see an example of how to do this using Google Oauth [here](https://github.com/LIT-Protocol/oauth-pkp-signup-example/blob/main/src/App.tsx#L50).

## Clearing the stored session key and signature

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

## Capability Delegation

The AuthSigs that users generate using our platform are [ERC-5573](https://eips.ethereum.org/EIPS/eip-5573) (SIWE ReCaps) compliant (**read**: we are still rolling this out, more updates to come). This means that, should the users specify certain actions to delegate to the session keys to operate on certain resources, this would be encoded in a capability object referenced in the `resources` array of the AuthSig.

As an example, the AuthSig above contains the following in the `resources` array, after the `urn:recap` prefix:

```
eyJkZWYiOlsibGl0U2lnbmluZ0NvbmRpdGlvbiJdLCJ0YXIiOnsicmVzb3VyY2VJZCI6WyJsaXRFbmNyeXB0aW9uQ29uZGl0aW9uIl19fQ==
```

Decoding the payload above using base64 corresponds to the following object:

```json
{
  "def": [
    "litSigningCondition"
  ],
  "tar": {
    "resourceId": [
      "litEncryptionCondition"
    ]
  }
}
```

**NOTE**: This is the outdated capability object specification and we will be updating to use the new object specification syntax.

## Resources you can request

You can pass an array of resources to the `getSessionSigs()` function, which will be presented to the user in the SIWE message. Resources are things the signature is permitted to be used for. These can be specific items, such as the ID of an encryption condition, or they can be wildcards. The default is all resources with wildcards. The resources are strings that follow the format `lit<conditionType>://<resourceId>`. The conditionType can be either `SigningCondition` or `EncryptionCondition`. The resourceId is a string that uniquely identifies the resource you are requesting access to. For signing conditions, the resourceId is a hash of the resourceId JSON you are requesting access to. For encryption conditions, the resourceId is a hash of the encrypted symmetric key that you are requesting access to.

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

# Session Keys

When the user “signs into” Lit, we generate a random session key for them. They sign that session pubkey as the “URI” of a SIWE message which creates a capability signature. There is a default expiration time of 24 hours, but this is configurable. This signature and the session key are stored in the localstorage of the browser.

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

## Security Considerations

### Expiration Times

The design decision to use SessionSigs in conjunction with AuthSigs is a compromise between security and UX. The intention is for AuthSigs to have a long(er) validity period (expires farther into the future) and for SessionSigs to be short-lived (expires soon) since SessionSigs is the actual authentication material that is required when operating against the specified resources. While our SDK uses sensible defaults for expiration times, these parameters are ultimately at the discretion of the application developer.

### SessionSig-per-Node

In order to prevent replay attacks, we have opted to generate a SessionSig per each node that the SDK is sending the request to. (Note that this is a fast operation compared to the latency involved in alternative security models)

If the SessionSig were to omit the `nodeAddress` parameter, then a node could technically re-use the SessionSig provided by the end-user to replay the request again from that node to the rest of the nodes in the network.

### AuthSig Replay-ability

Another possible replay attack comes from an AuthSig being provided solely, and repeatedly. When the AuthSig is signed against a payload containing the session keypair's public key as well as an allowlist of delegated capabilities, an AuthSig is insufficient to authenticate when provided in the absence of a SessionSig that corresponds to the signed session keypair public key. 

### AuthSig and SessionSig Coupling

Since a full SessionSig object couples an (inner) AuthSig with an (outer) SessionSig, this means that it is impossible for a node to attach a session signature that would be valid against an AuthSig that they have obtained elsewhere, ie. in an attempt to perform a replay attack. This is because the public key in the session signature must match that which is signed against in the (inner) AuthSig object.