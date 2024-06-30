# Payment Delegation Database <!-- omit in toc -->

The Payment Delegation Database is currently under development, with an work-in-progress relay that'll make using it easier, but is currently deployed on the Lit network, `manzano`.

The Payment Database consists of three contracts:

- [PaymentDelegation.sol](https://github.com/LIT-Protocol/lit-assets/blob/develop/blockchain/contracts/contracts/lit-node/PaymentDelegation.sol)
  - This is an [ERC-2535 Diamond proxy](https://eips.ethereum.org/EIPS/eip-2535)
  - Currently deployed at: `0x180BA6Ec983019c578004D91c08897c12d78F516`
- [PaymentDelegationFacet.sol](https://github.com/LIT-Protocol/lit-assets/blob/develop/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol)
  - The actual database implementation contract
  - Currently deployed at: `0x06E81394482FF7429Acc86bdFC695853435FDCD4`
- [LibPaymentDelegationStorage.sol](https://github.com/LIT-Protocol/lit-assets/blob/develop/blockchain/contracts/contracts/lit-node/PaymentDelegation/LibPaymentDelegationStorage.sol)
  - The database's proxy storage contract

## Using the Payments Database <!-- omit in toc -->

- [`delegatePayments`](#delegatepayments)
- [`getPayersAndRestrictions`](#getpayersandrestrictions)
- [`getPayers`](#getpayers)
- [`getUsers`](#getusers)
- [`undelegatePayments`](#undelegatepayments)
- [`setRestriction`](#setrestriction)
- [`getRestriction`](#getrestriction)
- [`delegatePaymentsBatch`](#delegatepaymentsbatch)
- [`undelegatePaymentsBatch`](#undelegatepaymentsbatch)

In order to start using the Payment Database, you should fetch the address of the latest implementation:

```js
const paymentDelegationFacet = await ethers.getContractAt(
    'PaymentDelegationFacet',
    await paymentDelegationDiamond.getAddress()
);
```

Then you can use the following functions to interact with the database:

:::note
A **payer** is an `address` that has Capacity Credits and is **delegating** the credits to a **user** (another `address`) for them to use for payments on the Lit network.
:::

### `delegatePayments`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L68-L71)

This function add a `user` as delegatee for a `payer` (The `payer` will be `msg.sender`).

```js
function delegatePayments(address user) public
```

### `getPayersAndRestrictions`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L24-L51)

This `view` function will retrieve all the `payer`s delegating to a list of `users`, and all the restrictions that have been set per `payer`.

```js
function getPayersAndRestrictions(
    address[] memory users
)
    public
    view
    returns (
        address[][] memory,
        LibPaymentDelegationStorage.Restriction[][] memory
    )
```

### `getPayers`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L63-L65)

This `view` function returns a list of all the delegating `payer`s for a `user`.

```js
function getPayers(address user) public view returns (address[] memory)
```

### `getUsers`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L53-L55)

This `view` functions returns a list of all the `user`s a `payer` has delegated to.

```js
function getUsers(address payer) public view returns (address[] memory)
```

### `undelegatePayments`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L73-L80)

This function removes the `user` as a delegatee for the `payer` (`payer` will be `msg.sender`).

```js
function undelegatePayments(address user) public
```

### `setRestriction`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L100-L104)

This function takes a [LibPaymentDelegationStorage.Restriction](https://github.com/LIT-Protocol/lit-assets/blob/753ee03852d537bbcdd420ac19c132118bcca726/blockchain/contracts/contracts/lit-node/PaymentDelegation/LibPaymentDelegationStorage.sol#L15-L18) and sets the restriction to all `user`s for the `payer` (`payer` is `msg.sender`).

```js
function setRestriction(
    LibPaymentDelegationStorage.Restriction memory r
) public
```

### `getRestriction`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L57-L61)

The getter returns the [LibPaymentDelegationStorage.Restriction](https://github.com/LIT-Protocol/lit-assets/blob/753ee03852d537bbcdd420ac19c132118bcca726/blockchain/contracts/contracts/lit-node/PaymentDelegation/LibPaymentDelegationStorage.sol#L15-L18) set by the `payer` for all their delegatee `user`s.

```js
function getRestriction(
    address payer
) public view returns (LibPaymentDelegationStorage.Restriction memory)
```

### `delegatePaymentsBatch`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L82-L87)

Does the same as [delegatePayments](#delegatepayments), but accepts a list of `user`s as input.

```js
function delegatePaymentsBatch(address[] memory users) public
```

### `undelegatePaymentsBatch`

[Link to implementation](https://github.com/LIT-Protocol/lit-assets/blob/f73b7e2a3c982fa8fe3a13ed816e07fa6e04fbd8/blockchain/contracts/contracts/lit-node/PaymentDelegation/PaymentDelegationFacet.sol#L89-L98)

Does the same as [undelegatepayments](#undelegatepayments), but accepts a list of `user`s as input.

```js
function undelegatePaymentsBatch(address[] memory users) public
```
