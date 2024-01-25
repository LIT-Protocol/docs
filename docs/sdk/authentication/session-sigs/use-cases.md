# Use Cases

Below are some use cases of how to use session signatures and capability objects.

_Note that these are not yet currently possible as we need to implement proof verification logic for delegation chains._

### Letting A User Use Your Capacity Credit NFT

Alice owns a Capacity Credit NFT and wants to let Bob use it, but only for specific Lit Actions or another resource or set of resources that she owns.

Alice can create a session capability object that specifies the ability to Authenticate with an RLI NFT as well as request for Threshold Execution against a particular Lit Action IPFS CID(s). Alice then signs and issues these capabilities to Bob.

Bob can generate an `AuthSig` by delegating equal rights to Bob's session keys, and attaching the capabilities granted to him by Alice as a proof in the session object. Bob can subsequently generate a `SessionSig` that requests for Alice's RLI NFT and Lit Action IPFS CID in the `resourceAbilityRequests`.

For an example of how you may delegate usage of your NFT see [here](../../authentication/session-sigs/capacity-credits.md)

### Letting A User Use Your PKP For A Specific Lit Action

Alice owns a PKP and Bob wants use it with a specific Lit Action that he has not authorized yet. He could use the smart contract and `addPermittedAction()`, run the function, then `removePermittedAction()` function, but would prefer not to spend the gas and wait for blocks etc.

Alice can create a session capability object that specifies the ability to perform Threshold Execution with a PKP NFT. Alice then signs and issues this capability to Bob.

Bob can generate an `AuthSig` by delegating equal rights to Bob's session keys, and attaching the capabilities granted to him by Alice as a proof in the session capability object. Bob can subsequently generate a `SessionSig` that requests for Alice's PKP NFT as well as Bob's Lit Action IPFS CID in the `resourceAbilityRequests`.