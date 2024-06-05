---
sidebar_position: 1
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Capability Objects

Session signatures work by having scoped capabilities be granted to session keys by an inner `AuthSig`. The capability object is a [SIWE ReCap](https://eips.ethereum.org/EIPS/eip-5573) object.

When session capability objects are omitted from the `getSessionSigs()` function call, the SDK will generate a session capability object with **wildcard permissions against all of the resources in that category by default**, i.e. ability to perform operations against all access control conditions. Below are some examples for creating custom session capability objects.

## Grant Decryption Capability To Access Control Condition

```javascript
// Create the session capability object
const sessionCapabilityObject = new newSessionCapabilityObject();

// Create the Lit Resource keyed by `someResource`
const litResource = new LitAccessControlConditionResource('someResource');

// Add the capability to decrypt from the access control condition referred to by the 
// lit resource.
sessionCapabilityObject.addCapabilityForResource(
    litResource,
    LitAbility.AccessControlConditionDecryption
);
```

## Grant All (Valid) Capabilities To Access Control Condition 

_Note that the Authentication Lit Ability is not valid against an Access Control Condition._

```javascript
// Create the session capability object
const sessionCapabilityObject = new newSessionCapabilityObject();

// Create the Lit Resource keyed by `someResource`
const litResource = new LitAccessControlConditionResource('someResource');

// Add all capabilities that are valid and relevant to the specified lit resource.
sessionCapabilityObject.addAllCapabilitiesForResource(litResource);
```

## Grant Decryption Capability To All Access Control Conditions

```javascript
// Create the session capability object
const sessionCapabilityObject = new newSessionCapabilityObject();

// Create the Lit Resource keyed by `someResource`
const litResource = new LitAccessControlConditionResource('*');

// Add the capability to decrypt from the access control condition referred to by the 
// lit resource.
sessionCapabilityObject.addCapabilityForResource(
    litResource,
    LitAbility.AccessControlConditionDecryption
);
```
<FeedbackComponent/>
