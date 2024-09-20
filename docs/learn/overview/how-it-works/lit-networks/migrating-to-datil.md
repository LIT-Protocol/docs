import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrating to Datil from Earlier Networks

Lit has launched three new networks: **Datil-dev**, **Datil-test**, and **Datil** to improve performance and stability for users compared to previous Lit networks like Cayenne, Manzano, and Habanero.

The Datil networks use a new rollup blockchain called [Chronicle Yellowstone](../lit-blockchains/chronicle-yellowstone). This new blockchains replace the original [Chronicle](../lit-blockchains/chronicle) blockchain that powered Lit's earlier networks. Below, you'll learn how to migrate data between these chains.

Depending on the Lit network you are currently using, you should migrate to its corresponding Datil network to take advantage of these improvements:

| Requires Payment for Network Usage | Minimum Lit Package Version | Your Current Network | Network to Migrate To | Description                                                  |
|------------------|-----------------------------|----------------------|-----------------------|--------------------------------------------------------------|
| ✅                | `6.x.x`                     | `habanero`           | `datil`               | Decentralized mainnet designed for production use cases      |
| ✅                | `6.x.x`                     | `manzano`            | `datil-test`          | Decentralized testnet designed for pre-production deployment |
| ❌                | `6.x.x`                     | `cayenne`            | `datil-dev`           | Centralized testnet designed for early-stage development     |

Like their counterparts, **datil** and **datil-test** require developers to pay for usage of the Lit network you can learn how to do this [here](../../../paying-for-lit/overview).

## Breaking Changes and Important Updates

### New Network, New PKPs

[PKPs (Programmable Key Pairs)](../../../signing-data/pkps) minted on earlier Lit networks (`cayenne`, `manzano`, and `habanero`) exist on the **Chronicle** blockchain. When migrating to the new Datil networks (`datil-dev`, `datil-test`, and `datil`), your PKPs will need to be re-minted on the **Chronicle Yellowstone** blockchain. This also involves transferring ownership of assets owned by PKPs minted on Chronicle to the newly minted PKPs on Chronicle Yellowstone.

To reduce the friction of re-minting PKPs on Chronicle Yellowstone, we've provided a [migration script](https://github.com/LIT-Protocol/developer-guides-code/tree/master/pkp-migration/nodejs). This script takes a list of PKP public keys, fetches their configured Auth Methods and Scopes, and mints new PKPs on a target Lit Network, setting the same Auth Methods and Scopes for each PKP.

After re-minting PKPs on Chronicle Yellowstone, your users can use both the old Chronicle-based PKPs and the new Chronicle Yellowstone PKPs with the same auth methods. However, the corresponding Ethereum addresses for each PKP will be different. Users may have assets or permissions tied to the old PKP Ethereum address, such as tokens or Account Abstraction wallets that recognize the PKP as an authorized signer. You'll need to migrate these items for your users or notify them to migrate to the new Ethereum addresses themselves.

:::caution
The migration script **does not** handle migration of any assets the existing PKPs own, such as tokens. Assets held by existing PKPs will need to be manually transferred to the new PKP's Ethereum address (or another address of your choosing) via blockchain transactions.

Additionally, the newly minted PKPs on the target Lit network will have new Ethereum addresses. Anything that uses the existing PKP's Ethereum address for permissions will need to be manually updated to use the new PKP's Ethereum address.
:::

### Encrypted Data

Because each Lit network undergoes its own Distributed Key Generation (DKG) and therefore has its own BLS root key, any data encrypted on one Lit network **cannot** be decrypted using a different Lit network. For example, data encrypted using `cayenne`'s public BLS key cannot be decrypted using the `datil-dev` network.

To migrate existing encrypted data, you must first decrypt it using the Lit network it was originally encrypted on, then re-encrypt that data using the Datil network you're migrating to.

There were no API changes made to the SDK for encrypting and decrypting, so your existing code should work with Datil. For more information on encrypting and decrypting data, see [the Encrypting Data with Lit](../../../encryption-access-control/encrypting-data-with-lit) page.

## How to Connect to a Datil Network

To connect to the new Datil networks, make the following changes:

1. **Upgrade Lit Packages:**

   - Upgrade the Lit SDK packages to the latest version `6` release.

    <Tabs
    defaultValue="npm"
    values={[
    {label: 'npm', value: 'npm'},
    {label: 'yarn', value: 'yarn'},
    ]}>
    <TabItem value="npm">

    ```bash
    npm install @lit-protocol/lit-node-client
    ```

    </TabItem>

    <TabItem value="yarn">

    ```bash
    yarn add @lit-protocol/lit-node-client
    ```

    </TabItem>
    </Tabs>

2. **Specify the Datil Network:**

   - When instantiating the `LitNodeClient`, specify the `litNetwork` property with the appropriate Datil network:

     - `datil`
     - `datil-test`
     - `datil-dev`

   ```ts
    import { LitNodeClient } from '@lit-protocol/lit-node-client';
    import { LitNetwork } from "@lit-protocol/constants";

    const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Datil, // <-- Change this to the Datil network you're migrating to
    });
    await litNodeClient.connect();
    ```

These changes should not break your existing implementations, assuming you've handled the migration of PKPs and encrypted data as mentioned above.

If you encounter issues after migrating from an existing network to a Datil network, please reach out to us on our [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.
