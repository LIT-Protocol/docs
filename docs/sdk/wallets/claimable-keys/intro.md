import FeedbackComponent from "@site/src/pages/feedback.md";

# Intro

## Quick Start

Ready to jump right in? Quickly learn how you can integrate claimable keys into your own product:

1. Guide: https://spark.litprotocol.com/lit-js-sdk-v3-claimable-keys/
4. Example Repo: https://github.com/LIT-Protocol/claim-key-demo-nodejs

## Overview

When creating a new Programmable Key Pair (PKP) it is now possible to deterministically derive keys so the public portion of the key pair is known **before** creating the key. We're going to abbreviate claimable keys as HD keys, short for homogeneous derived keys. 

With the release of the test network `cayenne` we are introducing a new concept to Programmable Key Pairs (PKP) - claimable keys (what will be referred to as Homogenous Derivation - HD keys).

HD keys work off a set of `root keys` which combined with a `key identifier` allow the deterministic generation of new key pairs.

## Use Cases
1. Send a welcome bonus to new users' email addresses before they sign up. The user can claim the funds once they verify their email.
2. Allow users to receive funds via their phone number before installing an app. They can claim the funds once they verify their phone number.
3. Send promotional funds to Twitter handles. Users can claim the funds by authenticating their Twitter account.
4. Distribute airdrops to Discord users using their IDs. They can claim the airdrop once they connect their Discord account.
5. Onboard new users by sending them a small amount to their web3 social profile (like a Lens profile). They can claim it by verifying ownership of their Lens account.

## Key vocabulary 

| Term | Definition |
| --- | --- |
| authentication methods | Deterministically generated identifier from authentication material |
| auth method identifier | An ID generated from a given authentication method |
| key identifier (key id) | The identifier used to derive the public key, this is the auth method identifier |
| claiming | The action of using an authentication method to derive a key from it’s auth method identifier |
| root keys | a set of asymmetric keys used to derive asymmetric ECDSA Keys or Programmable Key Pairs |

The `key identifier` is generated from an `auth method identifier`  from `authentication methods` which is a deterministically generated identifier from authentication material. This generation scopes the id to the specific application context allowing authentication methods to be registered to more than a single application context. 

This also allows you to generate many keys from a single `authentication method` . Since this identifier is known ahead of time from deriving the  `auth method` to it’s `auth method identifier`.  Allowing for pre-generating the public key of the key pair ahead of time, while keeping the private key unknown, as derivation of the private key does not follow the same derivation as the public portion. 
With deterministic keys it is now possible to know public addresses of PKP’s ahead of time as long as you know the authentication method, the public address can be derived. 

To support derived keys we have added a new concept to our network **Claiming.**  Claiming is the process of registering the `key identifier` as a claimed key such that no other entity may claim that key.  This claim is signed by our network of nodes, and when a threshold of signatures is present when persisting the claim. it will be successfully claimed.


Below is a table of how each supported authentication method derives the `key id`

| Auth Method | User ID | App ID |
| --- | --- | --- |
| Google OAuth | token sub | token aud |
| Discord OAuth | user handle | client app identifier |
| Stytch | user id | project id |
| Lit Actions | user provided | IPFS CID |


Continue to the next section to learn how to create HD keys and claim them.

<FeedbackComponent/>
