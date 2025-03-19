import FeedbackComponent from "@site/src/pages/feedback.md";

# Security Considerations

## Session Keys

When the user sends a request, the session key signs it and sends the signature with the request. The capability signature is also sent. Multiple capability signatures can be attached. Therefore, the `AuthSig` presented to the nodes is actually the session key `AuthSig` with the capability signatures attached. The SDK will use the session key to scope the `AuthSig` for each request to the specific resource and node being addressed. This prevents replay attacks.

Specifically, The SDK generates the random session keypair called "sessionKey". The user is presented with a SIWE message with the URI `lit:session:<actualSessionPubkeyHere>` and a [ReCap](https://eips.ethereum.org/EIPS/eip-5573)-compatible session capability object encoded in the `resources` array, eg. `urn:recap:<base64EncodedCapabilityObject>`. The capability object declares which namespace and domain-specific actions the delegate is authorized to perform, per the issuer.

## Improved UX with `SessionSigs`

The steps to obtain an `AuthSig` requires an interactive experience that involves manual steps from the end-user - whether clicking through the Google OAuth flow, placing their fingerprint on their platform authenticators, or clicking through their the respective modals of their externally-owned accounts (eg. MetaMask). These manual steps can be friction that drives users away from applications.

On the other hand, the steps to obtain a `SessionSig` is completely non-interactive. The session keys and signature can all be done programmatically once an `AuthSig` has been obtained. 

For these reasons, by designing `AuthSigs` to have a long validity period and `SessionSigs` to have a short validity period, we open up opportunities to develop user experiences that strike a good balance between a smooth user experience and security:
- User Experience: Since we store the `AuthSig` in local storage, we can always retrieve it and continue to use it for as long as it is valid.
- Security: `SessionSigs` allow us to scope specific capabilities against a narrow set of resources that is performed during a (usually) small time window that the user is on the application.

### Expiration Times

The design decision to use `SessionSig`s in conjunction with `AuthSigs` is a compromise between security and UX. The intention is for `AuthSigs` to have a long(er) validity period (expires farther into the future) and for `SessionSigs` to be short-lived (expires soon) since `SessionSigs` is the actual authentication material that is required when operating against the specified resources. While our SDK uses sensible defaults for expiration times, these parameters are ultimately at the discretion of the application developer.

### SessionSig-per-Node

In order to prevent replay attacks, we have opted to generate a `SessionSig` per each node that the SDK is sending the request to. (Note that this is a fast operation compared to the latency involved in alternative security models)

If the `SessionSig` were to omit the `nodeAddress` parameter, then a node could technically re-use the `SessionSig` provided by the end-user to replay the request again from that node to the rest of the nodes in the network.

### AuthSig Replay-ability

Another possible replay attack comes from an `AuthSig` being provided solely, and repeatedly. When the `AuthSig` is signed against a payload containing the session keypair's public key as well as an allowlist of delegated capabilities, an `AuthSig` is insufficient to authenticate when provided in the absence of a `SessionSig` that corresponds to the signed session keypair public key. 

### AuthSig and SessionSig Coupling

Since a full `SessionSig` object couples an (inner) `AuthSig` with an (outer) `SessionSig`, this means that it is impossible for a node to attach a session signature that would be valid against an `AuthSig` that they have obtained elsewhere, i.e. in an attempt to perform a replay attack. This is because the public key in the session signature must match that which is signed against in the (inner) `AuthSig` object.
<FeedbackComponent/>
