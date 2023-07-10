# Encryption

Access control conditions can be used to encrypt any static content such that its decryption is "gated".

The Lit network uses an identity-based encryption scheme to encrypt data, which means that decryption is only permitted to those who satisfy a certain identity. This is made possible because the BLS network signature is the decryption key for a particular set of access control conditions and private data, and the BLS network will only produce signature shares to the client if the user can prove that they satisfy the corresponding access control conditions.

This scheme is highly efficient, as encrypting private data is a entirely a client-side operation, and only 1 round of network interactivity with the nodes is required upon decryption (in order to request signature shares to assemble into a decryption key).

The identity-based encryption scheme necessitates the construction of an identity parameter, and it is this parameter that the BLS network is producing signature shares over. In order to prevent the same network signature (decryption key) to be used for multiple distinct ciphertexts, we choose this identity parameter to be a combination of the hash of the access control conditions and the hash of the private data itself.

Refer to the [SDK docs](../SDK/Explanation/jwt-auth) for more details and code examples.

## High-Level Overview

Here is a high-level, step-by-step breakdown of encryption and decryption:

### Encryption

1. Alice chooses some access control condition and private data and constructs the identity parameter
2. Alice encrypts the private data using the BLS network public key and the identity parameter to get a ciphertext
3. Alice stores the encryption metadata - set of access control conditions, hash of the private data etc. - and the ciphertext wherever she wants

### Decryption

1. Bob fetches the ciphertext and corresponding encryption metadata from the public data store
2. Bob presents the encryption metadata to the BLS network and requests for signature shares over the identity parameter
3. The BLS network nodes checks whether the user satisfies the access control conditions before signing the constructed identity parameter
4. Bob assembles the signature shares into a decryption key and successfully decrypts the ciphertext