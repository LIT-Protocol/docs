# Distributed Key Generation

All Lit Protocol node operators use a [Distributed Key Generation](https://github.com/LIT-Protocol/whitepaper/blob/main/Lit%20Protocol%20Whitepaper%20(2024).pdf) (DKG) process to collectively generate all of the signing and encryption keys managed by the network. DKG ensures that no single node or party ever has access to any key in its entirety, as the entire key never exists at all. Instead, more than a threshold of the Lit nodes must come together (more than two-thirds of the network) to generate these keys and perform signing and decryption operations.

## Root Keys

All signing keys are derived hierarchically from a set of root keys. These root keys are periodically refreshed or reshared (see below) and are backed up regularly. See the [recovery](../security/backup-and-recover.md) section below for more information on the backup process.

## Key Refresh and Resharing

Periodically, key shares are updated with a refresh scheme. This rotates the private key shares among an existing set of participating node operators without changing the underlying private key, a process known as [Proactive Secret Sharing](https://github.com/LIT-Protocol/whitepaper/blob/main/Lit%20Protocol%20Whitepaper%20(2024).pdf). This method helps ensure the integrity of private key material for long periods of time while minimizing the risk of key compromise.

The key refresh protocol is performed by first linearizing all of the key shares, running the same DKG algorithm with existing participants, then checking that the public key doesn't change.

Key resharing includes the additional ability to update the set of participating node operators. This scheme allows nodes to leave and join without disrupting the service of the network. This process involves transitioning from the existing participant set to the new participant set, and can be performed as long as there are enough existing participants with key shares. The end result is that the new node operator who is dealt into the active set holds threshold shares of the same private key. This works by having existing participants linearize their shares, and new participants set their share to zero and run the same DKG while checking that the same public key is generated.

Key refresh can be seen as a natural case of key resharing, with the participants and threshold potentially changing.
