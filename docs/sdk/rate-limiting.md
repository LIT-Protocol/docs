# Overview

By default, all users get three free requests on Lit every 24 hours. In order to use the network beyond the rate limit, you must reserve additional capacity. This can be done using capacity credits, which allow holders to reserve a configurable number of requests (measured in requests per second) over a fixed length of time (i.e. one week).


## **Minting A Rate Limit NFT**

In order to increase your rate limit you'll need to mint an `Rate Limit NFT`. To do so, you can use our `contract-sdk` to mint the nft

```javascript
let contractClient = new LitContracts({
    signer: dAppOwnerWallet,
    debug: process.env.DEBUG === 'true' ?? LITCONFIG.TEST_ENV.debug,
    network: process.env.NETWORK ?? LITCONFIG.TEST_ENV.litNetwork,
  });

  await contractClient.connect();

  const { rliTokenIdStr } = await contractClient.mintRLI({
     requestsPerDay: 14400, // 10 request per minute
     daysUntilUTCMidnightExpiration: 2,
  });
```

In the above example, we are configuring 2 properties
- `requestsPerDay` - How many requests can be sent in a 24 hour period.
- `daysUntilUTCMidnightExpiration` - The number of days until the nft will expire. expiration will occur at `UTC Midnight` of the day specified.

Once you mint your NFT you will be able to send X many requests per day where X is the number specified in `requestsPerDay`.

:::note
To use your new Rate Limit Increase NFT you will have to sign an `Auth Signature` with the the wallet which holds the NFT.
:::

## **Deligating Access to your Rate Limit NFT**

Usage of your Rate Limit NFT may be delegated to other wallets. To create a `Rate Limit Delegation` you can do so with the following example

```javascript
const litNodeClient = new LitNodeClient({
    litNetwork: "manzano",
    checkNodeAttestation: true,
});

await litNodeClient.connect();

// we will create an delegation auth sig, which internally we will create
// a recap object, add the resource "lit-ratelimitincrease://{tokenId}" to it, and add it to the siwe
// message. We will then sign the siwe message with the dApp owner's wallet.
const { rliDelegationAuthSig, litResource } =
await litNodeClient.createRliDelegationAuthSig({
    uses: '0',
    dAppOwnerWallet: dAppOwnerWallet,
    rliTokenId: rliTokenIdStr,
    addresses: [
    dAppOwnerWallet_address.replace('0x', '').toLowerCase(),
    delegatedWalletB_address.replace('0x', '').toLowerCase(),
    ],
});
```
To delegate your Rate Limit NFT there are 4 properties to configure

uses - How many time the delegation may be used
dAppOwnerWallet - The owner of the wallet as an `ethers Wallet instance`
rliTokenId -  The `token identifier` of the Rate Limit NFT
addresses - The wallet addresses which will be delegated to.


## **Generating Sessions from delegation signature**
To create sesssions from your delegation signature you can use the following example:

```javascript
 const authNeededCallback = async ({ resources, expiration, uri }) => {
    // you can change this resource to anything you would like to specify
    const litResource = new LitActionResource('*');

    const recapObject =
      await litNodeClient.generateSessionCapabilityObjectWithWildcards([
        litResource,
      ]);

    recapObject.addCapabilityForResource(
      litResource,
      LitAbility.LitActionExecution
    );

    const verified = recapObject.verifyCapabilitiesForResource(
      litResource,
      LitAbility.LitActionExecution
    );

    if (!verified) {
      throw new Error('Failed to verify capabilities for resource');
    }

    console.log('authCallback verified:', verified);

    let siweMessage = new siwe.SiweMessage({
      domain: 'localhost:3000',
      address: dAppOwnerWallet_address,
      statement: 'Some custom statement.',
      uri,
      version: '1',
      chainId: '1',
      expirationTime: expiration,
      resources,
    });

    siweMessage = recapObject.addToSiweMessage(siweMessage);

    const messageToSign = siweMessage.prepareMessage();
    const signature = await dAppOwnerWallet.signMessage(messageToSign);

    const authSig = {
      sig: signature.replace('0x', ''),
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: messageToSign,
      address: dAppOwnerWallet_address.replace('0x', '').toLowerCase(),
      algo: null,
    };

    return authSig;
  };

  let sessionSigs = await litNodeClient.getSessionSigs({
    // sessionKey,
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    chain: 'ethereum',
    resourceAbilityRequests: [
      {
        resource: new LitActionResource('*'),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback,
    rliDelegationAuthSig,
  });
```