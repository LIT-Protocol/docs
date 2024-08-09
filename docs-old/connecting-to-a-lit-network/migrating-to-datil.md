import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrating To Datil From Earlier Networks

Lit is launching three new networks, Datil-dev, Datil-test, and Datil, to improve performance and stability for production users compared to previous Lit networks like Cayenne, Manzano, and Habanero.

The Datil-dev and Datil-test networks use a new rollup blockchain called [Chronicle Yellowstone](./lit-blockchains/chronicle-yellowstone.md). These new blockchains replace the [Chronicle](./lit-blockchains/chronicle) blockchain that powered Lit's earlier networks. You will learn how to migrate data between these chains below.

Depending on the existing Lit network you are using, you should migrate to its corresponding Datil network to take advantage of these improvements:

| Currently Available | Requires Payment | Minimum Lit Package Version | Your Current Network | Network to Migrate to | Description                                                  |
|---------------------|------------------|-----------------------------|----------------------|-----------------------|--------------------------------------------------------------|
| ❌                   | ✅                | n/a                         | `habanero`           | `datil-prod`               | Decentralized mainnet designed for production use cases      |
| ✅                   | ✅                | `6.2.2`                     | `manzano`            | `datil-test`          | Decentralized testnet designed for pre-production deployment |
| ✅                   | ❌                | `6.2.2`                     | `cayenne`            | `datil-dev`           | Centralized testnet designed for early-stage development     |

Like their counterparts, `datil-prod` and `datil-test` require developers to pay for usage of the Lit network via [Capacity Credits](../capacity-credits); however, `datil-dev` does not.

## Breaking Changes and Important Updates

- Chronicle Yellowstone's chain facts are available [here](./lit-blockchains/chronicle-yellowstone.md#connecting-to-chronicle-yellowstone).

### New Network, New PKPs

PKPs minted on the existing Lit networks: `cayenne`, `manzano`, and `habanero` exist on the Chronicle blockchain. Because of this, when migrating to the new Datil networks: `datil-dev`, `datil-test`, and `datil-prod`, your PKPs will need to be re-minted on the Chronicle Yellowstone blockchain. This also means transferring ownership of assets owned by PKPs minted on Chronicle, to the newly minted ones on Chronicle Yellowstone.

:::info
If you're migrating from `habanero`, `manzano`, or `cayenne` to any of the Datil networks, you will be migrating from Chronicle to Chronicle Yellowstone.

:::

To reduce the friction of re-minting PKPs on Chronicle Yellowstone, we've written a [migration script](https://github.com/LIT-Protocol/developer-guides-code/tree/wyatt/pkp-migration-script/pkp-migration/nodejs) that will take a list of PKP public keys, fetch their configured Auth Methods and Scopes, and mint new PKPs on a target Lit Network, setting the same Auth Methods and Scopes for each PKP.

After re-minting PKPs on Chronicle Yellowstone, your users could use both the old Chronicle based network PKPs and the new Chronicle Yellowstone PKPs with the same auth methods. However, the corresponding Ethereum address for each PKP will be different. Your users may have things tied to the old PKP Ethereum address, like assets, or Account Abstraction wallets that see that PKP as an authorized signer. So the next step is to migrate these items for your users, or notify them they need to migrate to the new Ethereum address themselves.

:::caution
The migration script **will not** handle migration of any assets the existing PKPs own such as tokens. Assets held by existing PKPs will need to be manually transferred to a new PKP's Ethereum address (or some another address of your choosing) using a blockchain transaction.

Additionally, the newly minted PKPs on the target Lit network will have new Ethereum addresses, so anything that uses the existing PKP's Ethereum address for things like permissions, will need to be manually updated to us the new PKP's Ethereum address.
:::

### Encrypted Data

Because each Lit network undergoes it's own Distributed Key Generation (DKG), and therefore has it's own BLS root key, any encrypted data on one Lit network is **not** able to be decrypted using a different Lit network. For example, data encrypted using `cayenne`'s public BLS key, will **not** be able to be decrypted using the `datil-dev` network.

As a result, to migrate existing encrypted data, you must first decrypt it using the Lit network it was encrypted on, then re-encrypt that data using the Datil network you're migrating to.

There were no API changes made to the SDK for encrypting and decrypting, so you're existing code should work with Datil. See [here](../../sdk/access-control/quick-start#performing-encryption) for a guide on encrypting data, and [here](../../sdk/access-control/quick-start#performing-decryption) for decrypting.

## How to Connect to a Datil Network

:::note
For latest on which Datil networks are available to connect to, please refer to [this page](./connecting.md).
:::

The only code changes required to make use of the new Datil networks are as follows:

- Upgrade the Lit packages to the latest version that supports Datil
  - `6.2.2` is the minimum version of the packages that support `datil-test` and `datil-dev`
- Specify the Datil network when instantiating Lit node clients from the SDK
  - This is done by specifying the `litNetwork` property when [connecting a Lit client](./connecting) to one of the following Datil networks:
    - `datil-prod`
    - `datil-test`
    - `datil-dev`

Making these changes shouldn't cause your existing implementations to break, assuming you've handled migration of PKPs and encrypted data as mentioned above.

If you do run into issues after migrating from an existing network to a Datil network, please reach out to us on our [Telegram](https://t.me/+aa73FAF9Vp82ZjJh) for support.
