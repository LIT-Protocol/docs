---
sidebar_position: 3
---

# Mint, Grant, Burn


## What is Mint/Grant/Burn?

Mint/Grant/Burn is an optional pattern that allows you to prove that a PKP was not used to sign anything before it was approved to use a Lit Action.

Suppose you have a Lit Action that will check if a number is prime, and if it is, sign that number. If it is not prime, the Lit Action will abort. If you were able to mint a PKP, assign it to that Lit Action, and then burn the PKP in a single atomic transaction, then it would be provable that the PKP was not used to sign anything before it was approved to use the Lit Action. In this case, you could trust that any numbers signed with that PKP are indeed prime, without needing to check them yourself. This creates a powerful way to prove the output of any JS code by checking that 1) the signature is valid, 2) the lit action code is correct, and 3) that the PKP was minted using this Mint/Grant/Burn pattern.

The function to do this is called Mint/Grant/Burn. You mint the PKP, grant access for a Lit Action to use it, and then burn the PKP in a single transaction. Burning the PKP destroys the ability to grant access for a Lit Action to use it, so you know that no other Lit Action can ever use that PKP.
You can see the definition of a MintGrantBurn fuction in the contract source code [here](https://github.com/LIT-Protocol/LitNodeContracts/blob/main/contracts/PKPNFT.sol#L157)
