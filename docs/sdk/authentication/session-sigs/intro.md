---
sidebar_position: 1
---

# Session Signatures

:::note

`SessionSigs` are only available on Ethereum and are heavily in development, so things may change. Be sure to use the latest version of the Lit JS SDK.

:::

We refer to a session signature obtained from the user via session keys as a `SessionSig`.

`SessionSigs` are produced by a ed25519 keypair that is generated randomly on the browser and stored in local storage. The first step to producing `SessionSigs` is to first obtain an `AuthSig` through an authentication method like Google OAuth (example [here](https://github.com/LIT-Protocol/oauth-pkp-signup-example/blob/main/src/App.tsx#L398)). By specifying the session keypair's public key in the signature payload of the `AuthSig` - the `uri` field of the SIWE - users can choose which specific actions to delegate to the session keypair for operating upon certain resources.

The session keypair is used to sign all requests to the Lit Nodes, and the user's `AuthSig` is sent along with the request, attached as a "capability" to the session signature. Each node in the Lit Network receives a unique signature for each request, and can verify that the user owns the wallet address that signed the capability.

## Capability Objects

Session signatures work by having scoped capabilities be granted to session keys by an inner `AuthSig`. The capability object is a [SIWE ReCap](https://eips.ethereum.org/EIPS/eip-5573) object.

Read more [here](capability-objects) on the session capability objects that we use.

## Format of `SessionSigs`

Given the following example `AuthSig`:

```json
{
    "sig": "0xef8f88fb285f006594637257034226923e3bbf7c6c69f8863be213e50a1c1d7f18124eefdc595b4f50a0e242e8e132c5078dc3c52bda55376ba314e08da862e21a",
    "derivedVia": "web3.eth.personal.sign",
    "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:
        0x5259E44670053491E7b4FE4A120C70be1eAD646b


        URI: lit:session:6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a
        Version: 1
        Chain ID: 1
        Nonce: 0xfe88c94d860f01a17f961bf4bdfb6e0c6cd10d3fda5cc861e805ca1240c58553
        Issued At: 2022-10-30T08:25:33.371Z
        Expiration Time: 2022-11-06T08:25:33.348Z
        Resources:
        - urn:recap:eyJkZWYiOlsibGl0U2lnbmluZ0NvbmRpdGlvbiJdLCJ0YXIiOnsicmVzb3VyY2VJZCI6WyJsaXRFbmNyeXB0aW9uQ29uZGl0aW9uIl19fQ==",
    "address":"0x5259E44670053491E7b4FE4A120C70be1eAD646b"
}
```

<br/>

Here is an example `SessionSig` that uses a session keypair to sign the `AuthSig` above:

```json
{
    "sig": "0196a7e5b8271e287fc376af3ae35955cac1009149b9b9eab4c5f8c845ca20658f937a42b7c03a8884573b801de1c36f9fa8a6d2f3ba432dc4326443c114c40c",
    "derivedVia": "litSessionSignViaNacl",
    "signedMessage": '{
        "sessionKey": "6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a",
        "resourceAbilityRequest": [
            {
                "resource": "lit-accesscontrolcondition://524a697a410a417fb95a9f52d57cba5fa7c87b3acd3b408cf14560fa52691251",
                "ability": "access-control-condition-decryption"
            }
        ],
        "capabilities": [{
            "sig": "0xef8f88fb285c0065946f7257034226923e3bbf7c6c69f8863be213e50a1c1d7f18124eefdc595b4f50a0e242e8e132c5078dc3c52bda55376ba314e08da862e21a",
            "derivedVia": "web3.eth.personal.sign",
            "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:
                0x5259E44670053491E7b4FE4A120C70be1eAD646b


                URI: lit:session:6a1f1e8a00b61867b85eaf329d6fdf855220ac3e32f44ec13e4db0dd303dea6a
                Version: 1
                Chain ID: 1
                Nonce: 0xfe88c94d860f01a17f961bf4bdfb6e0c6cd10d3fda5cc861e805ca1240c58553
                Issued At: 2022-10-30T08:25:33.371Z
                Expiration Time: 2022-11-06T08:25:33.348Z
                Resources:
                - urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly81MjRhNjk3YTQxMGE0MTdmYjk1YTlmNTJkNTdjYmE1ZmE3Yzg3YjNhY2QzYjQwOGNmMTQ1NjBmYTUyNjkxMjUxIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQo=",
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

<br/>

Here is what each field means:

- `sig` is the signature produced by the ed25519 keypair signing the `signedMessage` payload
- `derivedVia` should be `litSessionSignViaNacl` and specifies that the SessionSig object was created via the `NaCl` library.
- `signedMessage` is the payload that was signed by the session keypair.
- `address` is the session keypair public key.
- `algo` is the signing algorithm used to generate the session signature.

### Signed Message

Here is what each field in `signedMessage` means:

- `sessionKey` is the session keypair public key.
- `resourceAbilityRequests` is a lit of abilities that the session key is requesting to perform against the specified Lit resources during authentication. Read more [here](resources-and-abilities) about Lit Resources and Abilities.
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
