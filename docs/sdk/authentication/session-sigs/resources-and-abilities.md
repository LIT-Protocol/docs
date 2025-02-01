---
sidebar_position: 2
---

import FeedbackComponent from "@site/src/pages/feedback.md";

# Lit Resources and Abilities

Lit Resources and Abilities are used to specifying what action is to be done against which resource. These are primitives that are used to securely authenticate users through appropriate scoping of users' abilities across various resources.

## Lit Resources

A Lit Resource refers to one of the following:

- An access control condition
- A Programmable Key Pair (PKP) NFT
- A Capacity Credit NFT
- A Lit Action

Each Lit Resource is identified by its Resource Key:

- For access control conditions, the resource key is derived from the hash of either the encrypted symmetric key or the JWT signing payload (resource ID)
- For PKP NFTs, the resource key is the token ID of the NFT
- For Capacity Credit NFTs, the resource key is the token ID of the NFT
- For Lit Actions, the resource key is the IPFS Content ID (CID) of the Lit Action code

A wildcard resource key, identified by `*`, refers to all of the resources in that category, i.e. all of the PKP NFTs or all of the access control conditions.

## Lit Abilities

A Lit Ability is an action to be performed. It can only be one of the following:

- Threshold decryption from an access control condition
- Threshold signing from an access control condition
- Threshold signing with a PKP NFT
- Authenticating with an increased rate limit threshold with a Capacity Credit NFT
- Threshold signing of a piece of Lit Action code

<FeedbackComponent/>
