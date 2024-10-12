# Custom Access Control for Stellar

The guide will walk you through an implementation of custom authentication and authorization using Lit Actions for the Stellar blockchain. Our goal is to authenticate who we are (by signing a Stellar transaction), and make a call to a Stellar smart contract to check if our authenticated address is on an allow list.

The full implementation of this code example is available [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-access-control-conditions-stellar/nodejs). Instruction on running the example are provided in the code example's `README.md`.

## Signing a Stellar Transaction for Authentication

The following code for this section can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-access-control-conditions-stellar/nodejs/src/index.ts)

The first step in our code example is authenticating the address that we're going to check the allow list for. To do this, we're going to initialize a Stellar wallet:

```js
const stellarKeyPair = StellarBase.Keypair.fromSecret(STELLAR_SECRET);
const stellarAccount = new StellarBase.Account(
    stellarKeyPair.publicKey(),
    STELLAR_ACCOUNT_SEQUENCE_NUMBER
);
```

and then sign an empty Stellar transaction:

```js
const stellarAuthTx = new StellarBase.TransactionBuilder(stellarAccount, {
    fee: StellarBase.BASE_FEE,
    networkPassphrase: StellarBase.Networks.TESTNET,
})
    .setTimeout(60 * 60 * 24) // 24 hours
    .build();
stellarAuthTx.sign(stellarKeyPair);
```

This signed transaction is what we're going to submit to our Lit Action in order to authenticate an address.

## Calling our Lit Action

### Connecting to the Lit Network

The first step to calling our Lit Action is to connect to the Lit Network:

```js
litNodeClient = new LitNodeClientNodeJs({
    litNetwork: LitNetwork.Cayenne,
});
await litNodeClient.connect();
```
Once we have a connected client, the next step is authenticating and authorizing ourselves to use the Lit Network. To do this, we're going to instantiate an instance of ethers.js `Wallet`:

```js
const ethersWallet = new Ethers.Wallet(
    ETHEREUM_PRIVATE_KEY,
    new Ethers.providers.JsonRpcProvider(
        "https://chain-rpc.litprotocol.com/http"
    )
);
```

And then create a [Session Signature](../../../sdk/authentication/session-sigs/intro.md):

```js
const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    resourceAbilityRequests: [
      {
        resource: new LitPKPResource("*"),
        ability: LitAbility.PKPSigning,
      },
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback: async ({
      resourceAbilityRequests,
      expiration,
      uri,
    }) => {
      const toSign = await createSiweMessageWithRecaps({
        // @ts-ignore
        uri,
        // @ts-ignore
        expiration,
        // @ts-ignore
        resources: resourceAbilityRequests,
        walletAddress: await ethersWallet.getAddress(),
        nonce: await litNodeClient!.getLatestBlockhash(),
        litNodeClient,
      });
      return await generateAuthSig({
        signer: ethersWallet,
        toSign,
      });
    },
});
```

### Generating a Session Signature

You can visit the doc page on [Session Signature](../../../sdk/authentication/session-sigs/intro.md) to learn more about them and why we need to create one to call our Lit Action. For this guide, the most important thing to note are the `resourceAbilityRequests` we're allowing for our Session Signature:

```js
resourceAbilityRequests: [
    {
    resource: new LitPKPResource("*"),
    ability: LitAbility.PKPSigning,
    },
    {
    resource: new LitActionResource("*"),
    ability: LitAbility.LitActionExecution,
    },
],
```

The first ability we're granting is `LitAbility.PKPSigning`, this ability is what allows us to get a signature from the Lit Nodes that authorizes our Stellar address. The second ability `LitAbility.LitActionExecution` is what allows us to call our Lit Action.

### Calling our Lit Action

The last bit of the code example is the actual call to the Lit Network to execute our Lit Action:

```js
const litPkpSignature = await litNodeClient.executeJs({
    sessionSigs,
    ipfsId: LIT_ACTION_IPFS_CID,
    jsParams: {
      stellarPublicKey: stellarKeyPair.publicKey(),
      stellarAuthTxHash: stellarAuthTx.hash(),
      stellarAuthTxSignature: stellarAuthTx.signatures[0].signature(),
      stellarAccountSequenceNumber: STELLAR_ACCOUNT_SEQUENCE_NUMBER,
      litPkpPublicKey: LIT_PKP_PUBLIC_KEY,
    },
});
```

You can read more about `litNodeClient.executeJs` in the Lit SDK API docs [here](https://v5.api-docs.getlit.dev/classes/lit_node_client_src.LitNodeClientNodeJs.html#executeJs).

The first parameter we're passing to `litNodeClient.executeJs` is the Session Signature we created earlier that allows us to make requests to the Lit Network.

```js
const litPkpSignature = await litNodeClient.executeJs({
    sessionSigs,
```

The second parameter is `ipfsId` which it the [IPFS Content Identifier](https://docs.ipfs.tech/concepts/content-addressing/) that points to our Lit Action code. We'll cover this in more detail later, but at this point we should have already bundled our Lit Action code to run in a [Deno](https://docs.deno.com/runtime/manual) environment, and uploaded it to IPFS.

```js
    ipfsId: LIT_ACTION_IPFS_CID,
```

Next are our `jsParams` that are parameters made available to us withing our Lit Action:

```js
 jsParams: {
    stellarPublicKey: stellarKeyPair.publicKey(),
    stellarAuthTxHash: stellarAuthTx.hash(),
    stellarAuthTxSignature: stellarAuthTx.signatures[0].signature(),
    stellarAccountSequenceNumber: STELLAR_ACCOUNT_SEQUENCE_NUMBER,
    litPkpPublicKey: LIT_PKP_PUBLIC_KEY,
},
```

- `stellarPublicKey` is the Stellar address we're authenticating and authorizing
- `stellarAuthTxHash` is the hash of the Stellar transaction we signed earlier and is what we'll use to do the authentication of `stellarPublicKey`
- `stellarAuthTxSignature` is the signature of our Stellar transaction that will also be used in the authentication of `stellarPublicKey`
- `stellarAccountSequenceNumber` is the index of the address we're deriving from `stellarPublicKey` and will submit to the Stellar contract for authorization
- `litPkpPublicKey` this is the public key of the [Lit PKP](../../../sdk/wallets/minting.md) we like to sign the Stellar account authorizing transaction

Now when executing the code, we'll get back a signed message from the Lit Nodes using our `litPkpPublicKey` if the Stellar address we provide is on the allow list within the Stellar smart contract.

## The Lit Action

:::danger
The following code that performs the signature verification for `stellarPublicKey` is unsafe and shouldn't be used in production. Because we're verifying an arbitrary `stellarAuthTxHash` was signed by the corresponding private key for `stellarPublicKey`, and not actually verifying an app specific message was signed, a user could all this Lit Action with any signed transaction and the corresponding public key and be able to authenticate with that address.

Ideally, for a production implementation, you would want to implement the [SEP-10](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) standard.
:::

The following code for this section can be found [here](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-access-control-conditions-stellar/nodejs/src/litAction.js).

### Deno Compatibility Workarounds

Because our Lit Action code has to be bundled into a single file, and compiled to run within a Deno environment, we have to employ some workarounds to get the code to run.

```js
import "jsr:/@kitsonk/xhr";
```

Is a Deno import that polyfills `XMLHttpRequest`.

```js
import * as StellarSdk from "https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/12.0.0-rc.2/stellar-sdk.js";
```
We're importing the browser built version of the `stellar-sdk`.

And lastly, we're creating a shim for `Buffer` as the Stellar SDK relies on it.

```js
class BufferShim extends Uint8Array {
  toJSON() {
    // Return an object similar to Node.js Buffer's .toJSON output
    return {
      type: "Buffer",
      data: Array.from(this),
    };
  }
}
```

### Verifying the Stellar Signature

Our first step for the Lit Action is verify the given `stellarPublicKey` actually signed `stellarAuthTxHash`:

```js
const stellarKeyPair = StellarSdk.Keypair.fromPublicKey(stellarPublicKey);
const signatureVerified = stellarKeyPair.verify(
    new BufferShim(stellarAuthTxHash),
    new BufferShim(stellarAuthTxSignature)
);
if (!signatureVerified) {
    LitActions.setResponse({
      response:
        "provided signature does not verify with provided stellarPublicKey and stellarAuthTxHash",
    });
return;
}
```

When `signatureVerified` is `true`, we've authenticated the provided `stellarPublicKey`, and we know the user calling this Lit Action has control of the corresponding private key.

The next step is to instantiate a Stellar account using the provided `stellarPublicKey` and `stellarAccountSequenceNumber`:

```js
const stellarSenderAccount = new StellarSdk.Account(
    stellarPublicKey,
    stellarAccountSequenceNumber
);
```

Then we use `stellarSenderAccount` to call the `is_allowed` function on our Stellar contract:

```js
const builtTransaction = new StellarSdk.TransactionBuilder(
    stellarSenderAccount,
    {
      fee: "100",
      networkPassphrase: StellarSdk.Networks.TESTNET,
    }
)
    .addOperation(
      new StellarSdk.Contract(ALLOW_LIST_CONTRACT_ADDRESS).call(
        "is_allowed",
        StellarSdk.nativeToScVal(stellarPublicKey, {
          type: "address",
        })
      )
    )
    .setTimeout(90)
    .build();
```

Then we call `STELLAR_TESTNET_RPC_URL` so that a Stellar node can run our transaction simulation:

```js
const requestBody = {
    jsonrpc: "2.0",
    id: 42,
    method: "simulateTransaction",
    params: {
      transaction: builtTransaction.toXDR(),
      resourceConfig: {
        instructionLeeway: 3000000,
      },
    },
};
const result = await fetch(STELLAR_TESTNET_RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
});
```

We parse the result and get a boolean the represents whether or not our Stellar address is on the allow list:

```js
const xdrObject = StellarSdk.xdr.ScVal.fromXDR(
    (await result.json()).result.results[0].xdr,
    "base64"
);
const isAllowed = xdrObject.value();
  if (!isAllowed) {
    LitActions.setResponse({
      response: "provided Stellar address is not authorized",
    });
    return;
}
```

Lastly, when `isAllowed` is `true`, we execute the `LitActions.signEcdsa` function which sends a request to the Lit Network to generate signature shares for our message (`${stellarPublicKey} is authorized`) using our `litPkpPublicKey`:

```js
// sigShare is a special variable that's automatically returned by the Lit Action
const sigShare = await LitActions.signEcdsa({
    toSign: ethers.utils.arrayify(
      ethers.utils.keccak256(
        new TextEncoder().encode(`${stellarPublicKey} is authorized`)
      )
    ),
    publicKey: litPkpPublicKey,
    sigName: "authorizationSignature",
});

LitActions.setResponse({
    response: "provided Stellar address is authorized",
});
```
