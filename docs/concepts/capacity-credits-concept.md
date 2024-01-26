---
sidebar_position: 4
---

# Paying For Usage 

# Overview

By default, all users get zero free requests on Lit every 24 hours. In order to use the network, you must reserve capacity. This can be done using capacity credits, which allow holders to reserve a configurable number of requests (measured in requests per day) over a fixed length of time (i.e. one week).

:::note
Currently Rate Limiting is only enabled on `Habanero` and `Manzano`
see [here](../network/networks/testnet) for test networks
see [here](../network/networks/mainnet) for mainnet networks
:::

# **Processing Requests**

In order to send transactions on Lit, you must first authenticate with the [Lit nodes](../sdk/authentication/overview). This can be done using one of two ways:

1. [Session signatures](https://developer.litprotocol.com/v3/sdk/authentication/session-sigs/intro): signatures scoped to specific capabilities or resources, designed to be ephemeral and limited in scope. (RECOMMENDED)
2. [Auth sigs](https://developer.litprotocol.com/v3/sdk/authentication/auth-sig): a signature obtained from a user proving they own a particular key (NOT RECOMMENDED)

Every time you authenticate with Lit, the request context (i.e. wallet address, owned capacity credits, etc) is extracted and validated against the Rate Limiting Module to ensure capacity has not been breached.

# **Capacity Credits**

In order to send transactions on Lit, you must first authenticate with the [Lit nodes](../sdk/authentication/overview). This can be done using one of two ways:

1. [Session signatures](../sdk/authentication/session-sigs/intro): signatures scoped to specific capabilities or resources, designed to be ephemeral and limited in scope. (RECOMMENDED)
2. [Auth sigs](../sdk/authentication/auth-sig): a signature obtained from a user proving they own a particular key (NOT RECOMMENDED)

Every time you authenticate with Lit, the request context (i.e. wallet address, owned capacity credits, etc) is extracted and validated against the Rate Limiting Module to ensure capacity has not been breached.

To mint a Capacity Credit NFT, you’ll need some `LIT` test token. These are test tokens that hold no real value and should only be used to pay for usage on Habanero. `LIT` test token should only be claimed from the verified faucet, linked [here](https://faucet.litprotocol.com/).

For minting a Capacity Credits NFT see example docs for using our contract-sdk [here](../sdk/rate-limiting) 

### **Delegating Capacity — Paying for Your Users’ Requests**
You can also delegate your capacity credits to other users. For example, Alice owns a Capacity Credit NFT and wants to let Bob use it, but only for a specific Lit Actions or another resource or set of resources that she owns.

Alice can create a session capability object that specifies the ability to Authenticate with an Capacity Credits NFT as well as request for Threshold Execution against a particular Lit Action IPFS CID(s). Alice then signs and issues these capabilities to Bob.

Bob can generate an `AuthSig` by delegating equal rights to Bob's session keys, and attaching the capabilities granted to him by Alice as a proof in the session object. Bob can subsequently generate a `SessionSig` that requests for Alice's Capacity Credits NFT, specifying the Lit Action IPFS CID in the `resourceAbilityRequests` field.


### **Best Practices**

- **Capacity Management**: Keep an eye on your usage limit and expiration date.
- **Understanding Limits**: Be aware of the free tier rate limit. Capacity credits can be used to reserve more usage.
- **Prioritization**: Utilize session signatures to ensure request prioritization.
