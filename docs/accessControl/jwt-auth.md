# JWT Auth

Access control conditions can be used to "gate" the signing of JWTs that are used to load dynamic content from a server.

Dapp developers can declare which URLs require certain access control conditions before proceeding to serve content when developing their application, and this can either be done statically (explicitly declared) or programmatically (declared on-the-fly).

The BLS network attest to a user meeting certain access control conditions by checking that they satisfy these conditions before signing a JWT with claims containing these access control conditions.

## High-Level Overview

Here is a high-level, step-by-step breakdown of generating a signed JWT:

1. Client requests BLS network to produce signature shares for a JWT with the claims containing the matching access control conditions for a particular dapp URL.
2. The BLS network nodes checks whether the user satisfies the access control conditions before constructing the JWT payload and signing it.
3. Client recombines the signature shares to assemble the fully formed JWT using the signature and presents the JWT to the dapp URL.
4. The dapp web page would verify that the JWT was signed by the BLS network and check that the access control conditions in the JWT claims matches that which is required for that dapp web page.