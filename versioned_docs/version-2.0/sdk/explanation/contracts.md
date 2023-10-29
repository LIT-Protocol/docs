# LitContracts 

The `LitContracts` class serves as a hub for managing and interacting with various smart contracts. This class provides a structured way to handle smart contract instances and offers utility methods for common operations.

## Class Properties

- `provider`: The Ethereum provider used to interact with the blockchain.
- `rpc`: The URL of the JSON-RPC endpoint.
- `signer`: The signer used to send transactions.
- `privateKey`: The private key used for signing transactions (if provided).
- `connected`: A flag indicating whether the class is connected to the blockchain.

## Smart Contract Instances

The class encapsulates several smart contract instances, each with a `read` and `write` version. The `read` version is used for calling view functions that don't modify the blockchain, while the `write` version is used for sending transactions that modify the blockchain. The smart contracts included are:

- Allowlist Contract
- LITToken Contract
- Multisender Contract
- PKPHelper Contract
- PKPNFT Contract
- PKPPermissions Contract
- PubkeyRouter Contract
- RateLimitNFT Contract
- Staking Contract

## Utility Methods

### `asyncForEachReturn`

Executes a provided callback function for each item in an array asynchronously.

```javascript
const result = await LitContracts.asyncForEachReturn(array, asyncCallback);
```

### `getBytesFromMultihash`

Converts a multihash string into an object representing multihash.

```javascript
const bytes = LitContracts.utils.getBytesFromMultihash(multihash);
```

### `getMultihashFromBytes`

Converts bytes32 to IPFS ID.

```javascript
const multihash = LitContracts.utils.getMultihashFromBytes(byte32);
```

### `timestamp2Date`

Converts a timestamp to a formatted date string.

```javascript
const formattedDate = LitContracts.utils.timestamp2Date(timestamp);
```

## Methods for Interacting with Smart Contracts

### `connect`

Connects to the blockchain using the provided or default settings.

```javascript
await LitContracts.connect();
```

### PKPNFT Contract Utility Methods

#### `getTokensByAddress`

Retrieves all PKP tokens owned by a given address.

```javascript
const tokens = await LitContracts.pkpNftContractUtils.read.getTokensByAddress(ownerAddress);
```

#### `mint`

Mints a new PKP token.

```javascript
const mintResult = await LitContracts.pkpNftContractUtils.write.mint();
```

### PKPPermissions Contract Utility Methods

#### `isPermittedAddress`

Checks if an address is permitted for a given PKP token.

```javascript
const isPermitted = await LitContracts.pkpPermissionsContractUtils.read.isPermittedAddress(tokenId, address);
```

#### `addPermittedAction`

Adds a permitted action to a given PKP token.

```javascript
const tx = await LitContracts.pkpPermissionsContractUtils.write.addPermittedAction(pkpId, ipfsId);
```

### RateLimitNFT Contract Utility Methods

#### `getCapacityByIndex`

Gets the capacity of a Rate Limit NFT by index.

```javascript
const capacity = await LitContracts.rateLimitNftContractUtils.read.getCapacityByIndex(index);
```

#### `mint`

Mints a new Rate Limit NFT.

```javascript
const mintResult = await LitContracts.rateLimitNftContractUtils.write.mint({mintCost, timestamp});
```

## Example Usage

```javascript
// Instantiate the LitContracts class
const litContracts = new LitContracts(
    signer: "<your - rpc signer>" // can be an instance of `PkpEthersWallet` or a different signer of your choosing
);

// Connect to the blockchain
await litContracts.connect();

// Mint a new PKP token
const mintResult = await litContracts.pkpNftContractUtils.write.mint();

// Check if an address is permitted for a PKP token
const isPermitted = await litContracts.pkpPermissionsContractUtils.read.isPermittedAddress(tokenId, address);

// Add a permitted action to a PKP token
const tx = await litContracts.pkpPermissionsContractUtils.write.addPermittedAction(pkpId, ipfsId);

// mint a new pkp with specific auth methods, ipfsIds, and addresses.
const tx = await litContracts.pkpHelperContractUtils.write.mintNextAddAuthMethods({
    keyType,
    permittedAuthMethodTypes,
    permittedAuthMethodIds,
    permittedAuthMethodPubkeys,
    permittedAuthMethodScopes,
    addPkpEthAddressAsPermittedAddress,
    sendPkpToItself
});

const tx = await litContracts.pkpHelperContractUtils.write.claimAndmintNextAndAddAuthMethods({
    keyType;
    derivedKeyId;
    signatures;
},
{
    keyType,
    permittedAuthMethodTypes,
    permittedAuthMethodIds,
    permittedAuthMethodPubkeys,
    permittedAuthMethodScopes,
    addPkpEthAddressAsPermittedAddress,
    sendPkpToItself
});
```

