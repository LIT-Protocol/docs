---
sidebar_position: 1
---

# Lit Networks

You can set your Lit Network in the LitNodeClient config of the Lit SDK, by passing the network name to the `litNetwork` parameter.

| Name     | Supported Algorithms | Supported Features               | ETA            | Description                                                                                   | Status                                   |
| -------- | -------------------- | -------------------------------- | -------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Jalapeno | BLS                  | Encryption                       | Live Now       | Centralized alpha network. Persistent, so keys will not be deleted.                           | https://jalapeno-status.litprotocol.com/ |
| Serrano  | BLS, ECDSA           | Encryption, Signing, Lit Actions | Live Now       | Deprecated centralized test network. Not persistent. Will likely be turned off in 2024.       | https://serrano-status.litprotocol.com/  |
| Cayenne  | BLS, ECDSA           | Encryption, Signing, Lit Actions | July 2023      | Centralized test network. No persistency guarantees, but will try to keep keys if possible.   | Coming Soon                              |
| Manzano  | ECDSA                | Signing                          | July 2023      | Decentralized test network. No persistency guarantees, but will try to keep keys if possible. | Coming Soon                              |
| Habanero | ECDSA                | Signing                          | September 2023 | Decentralized main network. Persistent, so keys will not be deleted.                          | Coming Soon                              |
| Datil    | BLS                  | Encryption                       | October 2023   | Decentralized main network. Persistent, so keys will not be deleted.                          | Coming Soon                              |
| Naga     | ECDSA                | Signing, Lit Actions             | November 2023  | Decentralized main network. Persistent, so keys will not be deleted                           | Coming Soon                              |
