# Paying for the Usage of the Lit Network

Like other decentralized networks, Lit has a certain amount of computation available for users that's metered to allow for a responsive network with nodes that are able to stay in-sync with one another.

In order to use the paid pre-production ([Datil-test](../connecting-to-a-lit-network/testnets#datil-test)) and production ([Datil](../connecting-to-a-lit-network/mainnets#datil)) Lit networks, you must reserve capacity on the network. This is done using by minting Capacity Credits, and by making use of the Lit Relayer and/or the Payment Delegation Database.

## Overview of Payment Methods

### Capacity Credits

Capacity Credits are NFT tokens that represent reserved computational capacity on the Lit network. When minting a credit, you specify and pay to reserve a specific amount of requests per second over a period of time. You'll then use these credits when making requests to the Lit network to perform actions such as decryption, executing Lit Actions, and using PKPs.

For a deep dive into Capacity Credits, including minting and usage details, checkout the in-depth [documentation](./capacity-credit-intro.md).

### Lit Relayer

The Lit Relayer is an [open-source service](https://github.com/LIT-Protocol/relay-server) currently hosted by Lit to facilitate onboarding into the Lit ecosystem. It helps reduce initial costs by covering or subsidizing certain interactions with the Lit network, such as minting PKPs and paying for network requests to perform actions like decryption, executing Lit Actions, and using PKPs.

While the Relayer eases the onboarding process, it's important to note that its availability is not guaranteed. Users may experience rate limiting and/or congestion due to its shared nature.

As you progress with your Lit integration, we recommend implementing Capacity Credits and/or the Payment Delegation Database in your application. These solutions offer more reliable and scalable options for managing your long-term usage of the Lit network.

For a deep dive into the Relayer, including its usage and offered services, checkout the in-depth [documentation](./lit-relayer.md).

### Payment Delegation Database

The Payment Delegation Database is a service provided by the Lit Relayer that streamlines payment management for your users. This service offers an alternative to relying on the Lit Relayer's payment subsidies or minting individual Capacity Credits for each of your users. With the Payment Delegation Database, you can establish a Payer Wallet and designate your users as Payees.

The Payer Wallet acts as a central account that manages payment for Lit network usage on behalf of your users (Payees). Payees inherit the reserved capacity of the Payer Wallet, which automatically receives a minted capacity credit when registered with the service.

For a deep dive into the Payment Delegation Database, including how to register a Payer Wallet and add users as Payees, checkout the in-depth [documentation](./payment-delegation-db.md).

### Choosing the Right Payment Method

The Lit network offers multiple payment methods to suit various use cases and application scales. Consider the following guidelines when selecting the most appropriate option for your needs:

- Capacity Credits: Ideal for individual users or small-scale applications requiring direct control over their network resource allocation. This option is ideal when you don't have to manage payments for a large user base.
- Lit Relayer: Best for initial testing and prototyping. It reduces onboarding friction by subsidizing some network interactions, but is subject to availability and potential rate limiting.
- Payment Delegation Database: Suitable for larger applications or those with a large user base. It allows centralized management of payments, simplifying resource allocation for numerous users.

For optimal results:

- New developers may start with the Lit Relayer for easy onboarding.
- As your application grows, transition to Capacity Credits for more reliable resource allocation.
- Large-scale applications should consider the Payment Delegation Database for efficient management of multiple users.

## Getting Started

To begin using the paid Lit networks:

1. Assess your needs: Consider your expected usage, scale of operations, and whether you'll be managing payments for multiple users.
2. Choose a payment method:
    - For testing and prototyping, start with the Lit Relayer.
    - For individual or small-scale use, consider Capacity Credits.
    - For applications with many users, look into the Payment Delegation Database.
3. Set up your chosen method:
    - For the Lit Relayer, go [here](./lit-relayer.md) to begin integrating it into your application.
    - For Capacity Credits, go [here](./capacity-credit-intro.md) to learn how to mint and use them.
    - For the Payment Delegation Database, go [here](./payment-delegation-db.md) to learn how to register a Payer Wallet and add your users as Payees.
4. Monitor your usage and adjust as needed.
