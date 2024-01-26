# Capacity Credits

# Overview

By default, all users get three free requests on Lit every 24 hours. In order to use the network beyond the rate limit, you must reserve additional capacity. This can be done using capacity credits, which allow holders to reserve a configurable number of requests (measured in requests per second) over a fixed length of time (i.e. one week).

For more information on Capacity Credits and network rate limiting see [here](../../../concepts/capacity-credits-concept.md)

:::note
Currently Rate Limiting is only enabled on `Habanero` and `Manzano`
see [here](../../../network/networks/testnet) for test networks
see [here](../../../network/networks/mainnet) for mainnet networks
:::

## **Minting Capacity Credits**

In order to increase your rate limit you'll need to mint an `Capacity Credits NFT`. To do so, you can use our `contract-sdk` to mint the nft
You can download the `contracts-sdk` from `npm` [here](https://www.npmjs.com/package/@lit-protocol/contracts-sdk)

:::note
see [here](https://www.npmjs.com/package/@lit-protocol/contracts-sdk) for installing the contracts-sdk
:::

```javascript
const walletWithCapacityCredit = new Wallet("<your private key or mnemonic>");
let contractClient = new LitContracts({
  signer: dAppOwnerWallet,
  network: 'manzano'
});

await contractClient.connect();
// this identifier will be used in delegation requests. 
const { capacityTokenIdStr } = await contractClient.mintCapacityCreditsNFT({
  requestsPerDay: 14400, // 10 request per minute
  daysUntilUTCMidnightExpiration: 2,
});
```

In the above example, we are configuring 2 properties
- `requestsPerDay` - How many requests can be sent in a 24 hour period.
- `daysUntilUTCMidnightExpiration` - The number of days until the nft will expire. expiration will occur at `UTC Midnight` of the day specified.

Once you mint your NFT you will be able to send X many requests per day where X is the number specified in `requestsPerDay`.
Once the `Capacity Credit` is minted the `tokenId` can be used in delegation requests. 


:::note
To use your new Capacity Credits NFT you will have to sign an `Auth Signature` with the the wallet which holds the NFT.
:::

## **Deligating Access to your Capacity Credits NFT**

Usage of your Capacity Credits NFT may be delegated to other wallets. To create a `Capacity Credits NFT delegation` you can do so with the following example
Here we use the `capacityTokenId` we recieved when minting our Capacity Credit.

```javascript
const litNodeClient = new LitNodeClient({
    litNetwork: "habanero",
    checkNodeAttestation: true,
});

await litNodeClient.connect();

const { capacityDelegationAuthSig } =
  await litNodeClient.createCapacityDelegationAuthSig({
    uses: '1',
    dAppOwnerWallet: walletWithCapacityCredit,
    capacityTokenId: capacityTokenIdStr,
    delegateeAddresses: [secondWalletPKPInfo.ethAddress],
  });
```
To delegate your Rate Limit NFT there are 4 properties to configure

`uses` - How many time the delegation may be used
`dAppOwnerWallet` - The owner of the wallet as an `ethers Wallet instance`
`capacityTokenId` -  The `token identifier` of the Rate Limit NFT
`delegateeAddresses` - The wallet addresses which will be delegated to


## **Generating Sessions from delegation signature**
To create sesssions from your delegation signature you can use the following example.
Here we are delegating usage of `Capacity Credit` from a wallet which posseses the NFT to another self custody wallet which does not posses `Capacity Credit`.


```javascript
  const litNodeClient = new LitNodeClient({
      litNetwork: "habanero",
      checkNodeAttestation: true,
  });
  
  await litNodeClient.connect();
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

    let siweMessage = new siwe.SiweMessage({
      domain: 'localhost:3000', // change to your domain ex: example.app.com
      address: dAppOwnerWallet_address,
      statement: 'Some custom statement.', // configure to what ever you would like
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
      address: dAppOwnerWallet_address,
    };

    return authSig;
  };

  let sessionSigs = await litNodeClient.getSessionSigs({
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    chain: 'ethereum',
    resourceAbilityRequests: [
      {
        resource: new LitActionResource('*'),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback,
    capacityDelegationAuthSig,
  });
```

In the above example we are configuring a wallet to sign a `session signature` which is delegated access to a `Capacity Credits NFT` which allows another wallet to use the credit for increased network usage.


## **Delegation to a PKP**
To Delegate to a pkp wallet from a wallet which posses `Capacity Credit` we can modify the above example as shown below.
For more information on session signatures and pkps see [here](./authentication/session-sigs/intro.md)

```javascript
  const litNodeClient = new LitNodeClient({
      litNetwork: "habanero",
      checkNodeAttestation: true,
  });
  
    const pkpAuthNeededCallback = async ({
      expiration,
      resources,
      resourceAbilityRequests,
    }) => {
      // -- validate
      if (!expiration) {
        throw new Error('expiration is required');
      }

      if (!resources) {
        throw new Error('resources is required');
      }

      if (!resourceAbilityRequests) {
        throw new Error('resourceAbilityRequests is required');
      }

      const response = await litNodeClient.signSessionKey({
        statement: 'Some custom statement.',
        authMethods: [secondWalletControllerAuthMethod],
        pkpPublicKey: secondWalletPKPInfo.publicKey,
        expiration: expiration,
        resources: resources,
        chainId: 1,

        // optional (this would use normal siwe lib, without it, it would use lit-siwe)
        resourceAbilityRequests: resourceAbilityRequests,
      });

      console.log('response:', response);

      return response.authSig;
  };

  const pkpSessionSigs = await litNodeClient.getSessionSigs({
    pkpPublicKey: secondWalletPKPInfo.publicKey,
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    chain: 'ethereum',
    resourceAbilityRequests: [
      {
        resource: new LitPKPResource('*'),
        ability: LitAbility.PKPSigning,
      },
    ],
    authNeededCallback: pkpAuthNeededCallback,
    capacityDelegationAuthSig, // here is where we add the delegation to our session request
  });
  
  console.log("generated session with delegation ", pkpSessionSigs);

  const res = await litNodeClient.executeJs({
    sessionSigs: pkpSessionSigs,
    code: `(async () => {
        const sigShare = await LitActions.signEcdsa({
          toSign: dataToSign,
          publicKey,
          sigName: "sig",
        });
      })();`,
    authMethods: [],
    jsParams: {
      dataToSign: ethers.utils.arrayify(
        ethers.utils.keccak256([1, 2, 3, 4, 5])
      ),
      publicKey: secondWalletPKPInfo.publicKey,
    },
  });

  console.log("signature result ", res);

```