import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import FeedbackComponent from "@site/src/pages/feedback.md";

# Paying for Users Via The Lit Relayer

## Paying for Lit

Like other decentralized networks, Lit has a certain amount of computation available for users that's metered to allow for a responsive network with nodes that are able to stay in-sync with one another.

In order to use Lit, you must reserve capacity on the network. Typically this is done by choosing a `payer` wallet and manually minting a Capacity Credit for it on Chronicle Yellowstone. Afterwards you'd then provide an [Auth Signature](../authentication/auth-sig.md) delegating usage of the Capacity Credit to your users.

This can be difficult to maintain as it often requires a server to be spun up to maintain a database of the `delegatees` and the expirations of their Capacity Credit Delegation Auth Signatures. Additionally, the Delegation Auth Signature, must be attached to every request the `delegatee` submits to the Lit network, requiring the aforementioned server to provide this to the `delegatees` before then can even being to interact with Lit's network.

To simplify this process of delegating Capacity Credits, we've implemented the Payment Delegation Database. Using Lit's Relayer server, you can now register a `payer` wallet (which will mint a Capacity Credit) and manage your `delegatees` using the two simple API routes. This streamlined process offers a more robust way to delegate capacity to your users, without having to micro-manage Capacity Credit delegations.

## The Payment Delegation Database

:::info
Currently the Payment Delegation Database is only supported on the `habanero` and `datil-test` Lit networks. Payment for usage is **not** required on the `datil-dev` network.
:::

The Payment Delegation Database is a [smart contract](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol) deployed on Lit's rollup, [Chronicle Yellowstone](../../connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone). Lit's [Relayer server](https://github.com/LIT-Protocol/relay-server) has been updated to provide two new API routes to interface with the Payment Delegation Database contract:

- `POST` `/register-payer`: This route is used to register a new `payer` and will have a [Capacity Credit](../capacity-credits.md) minted for it which can be delegated to `payees` to pay for their usage of Lit
- `POST` `/add-users`: This route is used to add users (as Ethereum addresses) as `payees` for a specific `payer`. This allows the `payer` to pay for the usage of Lit for each user, without each user having to own a Capacity Credit

Below we will walk through an example of registering a `payer` and adding users as `payees` for a specific `payer`. The full code implementation can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/payment-delegation-relayer/payment-delegation-db-relayer/nodejs/src).

## Prerequisites

Before continuing with this guide, you should have an understanding of:

- [Capacity Credits](../capacity-credits.md)
- Lit's [Relayer server](https://github.com/LIT-Protocol/relay-server)
  - The Relayer is a centrally ran service by the Lit Protocol team to facilitate and subsidize some interactions with the Lit Protocol smart contracts on Chronicle.
  - In this guide the Relayer does several things for you including:
    - Acting as a gateway to the Chronicle blockchain
    - Generating new `payer` wallets when you request to register one
    - Handling the blockchain transactions to:
      - Register the new `payer` wallet with the Payment Delegation Database smart contract
      - Mint Capacity Credits for the new `payer` wallets
      - Add users as `payees` for your `payer` wallet
- You must have a valid Lit Relayer API key
  - This can be obtained by filling out [this form](https://docs.google.com/forms/d/e/1FAIpQLSeVraHsp1evK_9j-8LpUBiEJWFn4G5VKjOWBmHFjxFRJZJdrg/viewform)
- You should know which paid Lit network you're going to use: `habanero` or `datil-test`

This guide doesn't have any external dependencies, but relies on `fetch` being natively available in Node.js, which means the minimum supported version is `v18`.

## Registering a Payer Wallet

:::info
Registering a payer using Lit's Relayer server requires an API key, if you don't already have one, you can apply for one [here](https://docs.google.com/forms/d/e/1FAIpQLSeVraHsp1evK_9j-8LpUBiEJWFn4G5VKjOWBmHFjxFRJZJdrg/viewform).
:::

:::warning
After successfully registering a `payer` with the Relayer server, you will receive a `payerSecretKey` as part of the API response. This secret key is essentially the **private key** of your new `payer` wallet and should be treated as any other private key would. API requests using the `payerSecretKey` requires secure context, meaning it should not be used from a browser context where it would be leaked to the end user.

It's also important to note that Lit **never** has access to this secret key and will **not** be able to recover it for you if you loose access to it. Please make sure this secret key is backed up securely, and refrain from leaking this key to unauthorized parties. Whomever has access to the key has the ability to modify the `delegatees` of your Capacity Credit.
:::

A full implementation of the code in this section can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/payment-delegation-relayer/payment-delegation-db-relayer/nodejs/src/registerPayer.ts).

To register a new `payer` wallet, you're going to need to decide which Lit network you'd like to use. Currently the Relayer server has two endpoints depending on the Lit network:

- For `habanero`, we'll be making requests to:
    ```
    https://habanero-relayer.getlit.dev/register-payer
    ```
- For `datil-test`, we'll be making requests to:
    ```
    https://datil-test-relayer.getlit.dev/register-payer
    ```

You're also going to need a Lit Relayer API key, which you can request one [here](https://docs.google.com/forms/d/e/1FAIpQLSeVraHsp1evK_9j-8LpUBiEJWFn4G5VKjOWBmHFjxFRJZJdrg/viewform) if you don't already have one.

To make the request, we'll being using Node.js' builtin `fetch` API, and we'll being by specifying the request headers like so:

```ts
const headers = {
    "api-key": YOUR_LIT_RELAYER_API_KEY,
    "Content-Type": "application/json",
};
```

You'll want to replace `YOUR_LIT_RELAYER_API_KEY` with the API key that was generated for you by Lit.

Next we'll make the `fetch` request to the `register-payer` endpoint:

<Tabs
defaultValue="habanero"
values={[
{label: 'Using Habanero', value: 'habanero'},
{label: 'Using DatilTest', value: 'datil-test'},
]}>
<TabItem value="habanero">

```ts
const response = await fetch(
    "https://habanero-relayer.getlit.dev/register-payer", 
    {
        method: "POST",
        headers,
    }
);
```

</TabItem>

<TabItem value="datil-test">

```ts
const response = await fetch(
    "https://datil-test-relayer.getlit.dev/register-payer", 
    {
        method: "POST",
        headers,
    }
);
```

</TabItem>
</Tabs>

The `response` of this request will have the following structure:

```ts
interface RegisterPayerResponse {
    payerSecretKey: string;
    payerWalletAddress: string;
}
```

Where `payerSecretKey` is a randomly generated API key used to derive a [Hierarchical Deterministic key](https://github.com/WebOfTrustInfo/rwot1-sf/blob/master/topics-and-advance-readings/hierarchical-deterministic-keys--bip32-and-beyond.md) for your new `payer`. `payerWalletAddress` will be the Ethereum address corresponding to your new `payer` wallet derived from `payerSecretKey`.

Lets now parse the API `response` and check for any errors:

```ts
if (!response.ok) {
    throw new Error(`Error: ${await response.text()}`);
}
```

In the event an error happened while registering a new `payer`, the Relayer provided error message will be available as `response.text()`. Some of the errors you may see include:

- `Missing API key`: This error means you didn't provide your Lit Relayer API key as `api-key` in the request headers.
- `Failed to register payer`: This error means something went wrong internally within the Relayer when creating your `payer` wallet. In this instance, you should make a support inquiry to Lit so we can investigate this further.

If `response.ok === true`, then we can move onto parsing the response data like so:

```ts
const { payerWalletAddress, payerSecretKey } = (await response.json()) as RegisterPayerResponse;
```

:::warning
Remember that `payerSecretKey` is essentially the private key to your new `payer` wallet and should be handled securely. It **cannot** be recovered by Lit if you loose access to it, and you shouldn't make requests using it in a context like the browser where the end user would have access to it.
:::

Now that we have `payerSecretKey`, we'll use it to add users as `payees` for our `payer` wallet.

## Adding Users as `payees`

:::warning
Remember that `payerSecretKey` is essentially the private key to your new `payer` wallet and should be handled securely. It **cannot** be recovered by Lit if you loose access to it, and you shouldn't make requests using it in a context like the browser where the end user would have access to it.
:::

A full implementation of this code for this section can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/wyatt/payment-delegation-relayer/payment-delegation-db-relayer/nodejs/src/addUsers.ts).

To add users as `payees` for your `payer` wallet, you're going to need the Relayer API URL for the same Lit network you registered your `payer` on:
  - For `habanero`, we'll be making requests to:
      ```
      https://habanero-relayer.getlit.dev/add-users
      ```
  - For `datil-test`, we'll be making requests to:
      ```
      https://datil-test-relayer.getlit.dev/add-users
      ```

You're also going to need a Lit Relayer API key, which you can request one [here](https://docs.google.com/forms/d/e/1FAIpQLSeVraHsp1evK_9j-8LpUBiEJWFn4G5VKjOWBmHFjxFRJZJdrg/viewform) if you don't already have one.

Lastly, you'll need the `payerSecretKey` generated for you by the Lit Relayer when you registered a `payer` wallet.

To make the request, we'll being using Node.js' builtin `fetch` API, and we'll being by specifying the request headers like so:

```ts
const headers = {
    "api-key": YOUR_LIT_RELAYER_API_KEY,
    "payer-secret-key": YOUR_LIT_PAYER_SECRET_KEY,
    "Content-Type": "application/json",
};
```

You'll want to replace `YOUR_LIT_RELAYER_API_KEY` with the API key that was generated for you by Lit, and `YOUR_LIT_PAYER_SECRET_KEY` with the `payerSecretKey` returned to you by the Relayer when you registered a `payer`.

Next we'll make the `fetch` request to the `add-users` endpoint:

<Tabs
defaultValue="habanero"
values={[
{label: 'Using Habanero', value: 'habanero'},
{label: 'Using DatilTest', value: 'datil-test'},
]}>
<TabItem value="habanero">

```ts
const response = await fetch(
    "https://habanero-relayer.getlit.dev/add-users", 
    {
        method: "POST",
        headers,
        body: JSON.stringify(USERS_YOU_WANT_TO_ADD),
    }
);
```

</TabItem>

<TabItem value="datil-test">

```ts
const response = await fetch(
    "https://datil-test-relayer.getlit.dev/add-users", 
    {
        method: "POST",
        headers,
        body: JSON.stringify(USERS_YOU_WANT_TO_ADD),
    }
);
```

</TabItem>
</Tabs>

Where `USERS_YOU_WANT_TO_ADD` is an array of Ethereum addresses that you would like to delegate usage of your Capacity Credit to, for example:

```ts
const users = [
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "0x6c6ee5e31d828de241282b9606c8e98ea48526e2",
    "0x53d284357ec70ce289d6d64134dfac8e511c8a3d",
];
```

The `response` of this request will have the following structure:

```ts
interface AddUserResponse {
  success: boolean;
  error?: string;
}
```

Where `success` refers whether or not the users were successfully added as payees.

Lets now parse the API `response` and check for any errors:

```ts
if (!response.ok) {
    throw new Error(`Error: ${await response.text()}`);
}
```

In the event an error happened while adding new users, the Relayer provided error message will be available as `response.text()`. Some of the errors you may see include:

- `Missing or invalid API / Payer key`: This error means you didn't provide your Lit Relayer API key as `api-key` in the request headers.
- `Missing or invalid payee addresses`: This error means you either didn't provide an array of addresses within the body of the request, or the addresses weren't formatted correctly.
- `Failed to add payee: delegation transaction failed`: This error means something went wrong internally within the Relayer when attempting to add one of your specified users as a `payee`. In this instance, you should make a support inquiry to Lit so we can investigate this further.

If `response.ok === true`, then we can move onto parsing the response data like so:

```ts
const data = (await response.json()) as AddUserResponse;
    if (data.success !== true) {
      throw new Error(`Error: ${data.error}`);
}
```

If `data.success === true`, then your specified users were successfully added as `payees` for your `payer` wallet.

## Summary

This guide has showcased a new way to handle delegation of Capacity Credits to your users. Instead of manually minting Capacity Credits and managing the delegation of those credits to your users, you now have an understanding of how to use the to new API endpoints on the Lit Relayer server to:

1. Register new `payer` wallets using the `/register-payer` endpoint
   - Requests to this endpoint will create a new `payer` wallet, register it with the Payment Delegation Database smart contract on Chronicle, and will automatically mint a Capacity Credit for it
2. Adding users as `payees` to your `payer` wallet using the `/add-users` endpoint
   - Requests to this endpoint will grant capacity to use the Lit network to the users you specify
   - All requests to the Lit network that require payment, such as decryption and execution of Lit Actions, will be paid for by your `payer` wallet on behalf of the `payee`, reducing the friction of connecting your users to the Lit network

:::warning
One last final reminder that your `payerSecretKey` is effectively the same thing as a private key, and needs to be handled securely. Any code that uses your secret in plaintext should only be accessible to authorized parties. Requests to the Relayer that use your secret key should not originate from the browser where end users would have access to your secret key. Typically, the code that interacts with the Relayer is going to live on your backend.
:::
