# Lit Relayer

The Lit Relayer is an [open-source service](https://github.com/LIT-Protocol/relay-server) currently hosted by Lit to facilitate onboarding into the Lit ecosystem. It helps reduce initial costs by covering or subsidizing certain interactions with the Lit network, such as minting Programmable Key Pairs (PKPs).

While the Relayer eases the onboarding process, it's important to note that its availability is not guaranteed. Users may experience rate limiting and/or congestion due to its shared nature.

As your application moves into production, we recommend implementing this functionality directly into your own application instead of using the Lit Relayer. This will ensure that you can use the Lit network with minimal friction and disruptions in service, as your direct implementation will be much more reliable and scalable.

## Overview of Lit Relayer Functions

The Lit Relayer provides the following functions to help interact with the Lit network:

### PKP Minting

The Relayer can mint PKPs on behalf of users, subsidizing the minting costs. This process verifies the authenticity of various authentication methods, then associates the public key of a newly generated PKP with the authenticated identity.

The currently supported authentication methods include:

  - WebAuthn
  - Google OAuth
  - Discord OAuth
  - Stytch Otp
  - Ethereum wallet signatures
  - One-time passwords (OTP)

The Relayer also supports retrieving all the PKPs associated with authenticated accounts.

### Payment Delegation Database

The Relayer also provides access to the [Payment Delegation Database](./payment-delegation-db.md), please refer to it's documentation to learn more.

## Using the Lit Relayer

To use the Lit Relayer, you must have a valid API key, as all communication with the Relayer is done using HTTP requests to the [Relayer endpoints](https://github.com/LIT-Protocol/relay-server?tab=readme-ov-file#available-endpoints).

If you don't already have an API key, you can request one by filling out [this form](https://docs.google.com/forms/d/e/1FAIpQLSeVraHsp1evK_9j-8LpUBiEJWFn4G5VKjOWBmHFjxFRJZJdrg/viewform).

## Limitations and Considerations

While the Lit Relayer is a useful tool for getting started with Lit Protocol, there are some important considerations:

1. **Rate Limiting**: To prevent abuse, the Relayer implements rate limiting. Your application may encounter usage limits.

2. **Availability**: As a shared service, the Relayer may experience congestion or downtime.

3. **Scalability**: For production applications, it's recommended to implement Relayer functionality directly in your application for better reliability and scalability.
