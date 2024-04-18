---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Package Changes

The **Lit JS SDK V3** replaces the existing access control condition based encryption and JWT signing processes with new cryptographic primitives to offer a more secure and seamless user experience.

:::info
[Habanero Mainnet](../network/networks/mainnet) and [Manzano Testnet](../network/networks/testnet) are now live. Check out the [docs on migration](../network/migration-guide) to learn how you can start building on Habanero and Manzano today. 
:::

## `@lit-protocol/bls-sdk`

:::note

You should only use this package if you know what you are doing. Otherwise, please use `@lit-protocol/encryption` as a higher-level helper library.

:::

### Encryption

Previously in V2, you would have to:

- Generate a symmetric key
- Encrypt private data using this symmetric key
- Encrypt this symmetric key using the BLS network key
- Save this encrypted symmetric key with some access control conditions in the BLS network

Now in V3, all you would have to do is to call the `encrypt` method to perform client-side encryption:

```javascript
const publicKey =
  '8e29447d7b0666fe41c357dbbdbdac0ac8ac973f88439a07f85fa31fa6fa3cea87c2eaa8b367e1c97764800fb5636892';

const secretMessage = new Uint8Array([
  240, 23, 185, 6, 87, 33, 173, 216, 53, 84, 80, 135, 190, 16, 58, 85, 97, 75,
  3, 192, 215, 82, 217, 5, 40, 65, 2, 214, 40, 177, 53, 150,
]);

const identityParam = new Uint8Array([
  101, 110, 99, 114, 121, 112, 116, 95, 100, 101, 99, 114, 121, 112, 116, 95,
  119, 111, 114, 107, 115,
]);

const ciphertext = blsSdk.encrypt(
  publicKey,
  uint8arrayToString(secretMessage, 'base64'),
  uint8arrayToString(identityParam, 'base64')
);
```

### Decryption

Previously in V2, you would have to:

- Make a request to the BLS network for decryption shares
- Combine decryption shares using `blsSdk.combine_decryption_shares` to get a decryption key
- Use this decryption key to decrypt the ciphertext

Now in V3, you can use the `verify_and_decrypt_with_signature_shares` method after obtaining BLS network signature shares:

```javascript
const privateData = blsSdk.decrypt_with_signature_shares(
  ciphertext,
  sigShares
);
```

The signature shares must be obtained via the new BLS network endpoint.

### Signature Verification

Previously in V2, you would have to call the `verify` method.

Now in V3, you can use the `verify_signature` method. The signature must be combined using signature shares obtained via the new BLS network endpoint.

## `@lit-protocol/crypto`

:::note

You should only use this package if you know what you are doing. Otherwise, please use `@lit-protocol/encryption` as a higher-level helper library.

:::

### Encryption

Previously in V2, you would have to:

- Generate a symmetric key
- Encrypt private data using this symmetric key
- Encrypt this symmetric key using the BLS network key
- Save this encrypted symmetric key with some access control conditions in the BLS network

Now in V3, you can perform client-side encryption using the `encrypt` method:

```javascript
const publicKey =
  '8e29447d7b0666fe41c357dbbdbdac0ac8ac973f88439a07f85fa31fa6fa3cea87c2eaa8b367e1c97764800fb5636892';

const secretMessage = new Uint8Array([
  240, 23, 185, 6, 87, 33, 173, 216, 53, 84, 80, 135, 190, 16, 58, 85, 97, 75,
  3, 192, 215, 82, 217, 5, 40, 65, 2, 214, 40, 177, 53, 150,
]);

const identityParam = new Uint8Array([
  101, 110, 99, 114, 121, 112, 116, 95, 100, 101, 99, 114, 121, 112, 116, 95,
  119, 111, 114, 107, 115,
]);

const ciphertext = encrypt(publicKey, secretMessage, identityParam);
```

### Decryption

Previously in V2, you would have to:

- Make a request to the BLS network for decryption shares
- Combine decryption shares using `combineBlsShares` to get a decryption key
- Use this decryption key to decrypt the ciphertext using `decryptWithSymmetricKey`

Now in V3, you can use the `verifyAndDecryptWithSignatureShares` method after obtaining BLS network signature shares:

```javascript
const ciphertext =
  'l9a/01WDJB/euKxtbWcuQ8ez/c9eZ+jQryTHZVLN0kfd7XHoLs6FeWUVmk89ovQGkQJnnFDKjq6kgJxvIIrxXd9DaGuRBozLdA1G9Nk413YhTEqsENuHU0nSa4i6F912KltE15sbWKpDfPnZF6CA2UKBAw==';
const signatureShares = [
  '01b2b44a0bf7184f19efacad98e213818edd3f8909dd798129ef169b877d68d77ba630005609f48b80203717d82092a45b06a9de0e61a97b2672b38b31f9ae43e64383d0375a51c75db8972613cc6b099b95c189fd8549ed973ee94b08749f4cac',
  '02a8343d5602f523286c4c59356fdcfc51953290495d98cb91a56b59bd1a837ea969cc521382164e85787128ce7f944de303d8e0b5fc4becede0c894bec1adc490fdc133939cca70fb3f504b9bf7b156527b681d9f0619828cd8050c819e46fdb1',
  '03b1594ab0cb56f47437b3720dc181661481ca0e36078b79c9a4acc50042f076bf66b68fbd12a1d55021a668555f0eed0a08dfe74455f557b30f1a9c32435a81479ca8843f5b74b176a8d10c5845a84213441eaaaf2ba57e32581584393541c5aa',
];

const plaintext = verifyAndDecryptWithSignatureShares(
  publicKey,
  identityParam,
  ciphertext,
  signatureShares.map((s) => ({
    ProofOfPossession: s,
  }))
);
```

## `@lit-protocol/encryption`

All of the methods now require `ILitNodeClient` in the function argument.

## `@lit-protocol/lit-node-client` and `lit-node-client-nodejs`

All of the functionality for encrypting and decrypting private data is now implemented by the `encrypt` and `decrypt` methods.

All of the functionality for obtaining a BLS network signature over a JWT is now implemented by the `getSignedToken` method.
