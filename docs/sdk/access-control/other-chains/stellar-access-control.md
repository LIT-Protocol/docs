---
sidebar_position: 6
---

# Lit Action Conditions: Reading State from Stellar

Currently Stellar is not one of the [listed supported chains](../../../../versioned_docs/version-2.0/resources/supportedChains.md) by Lit. This guide provides an example of how you can use a Lit Action to make a call to Stellar's network to determine whether or not a user is allowed to decrypt some data encrypted using Lit.

The source code for this guide can be found [here](https://github.com/LIT-Protocol/developer-guides-code/tree/master/lit-actions-conditions-reading-state-from-stellar).

There are two parts to this guide:

- Using Lit to provide decryption access control by reading state from Stellar
- Creating the authorizing Stellar smart contract

## Using Lit to Provide Decryption Access Control

This guide will utilize the Lit SDK to encrypt some data, and a Lit Action with a secret number to determine whether or not authorization should be granted to decrypt the data using the Lit network.

### Encrypting and Decrypting

[This file](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/index.js) contains the Lit SDK code responsible for encrypting a string and calling the Lit Action to attempt decryption.

#### Connecting to the Lit Habanero Network

The first thing we need to do is create a Lit Client connected to the `habanero` network:

```javascript
const client = new LitJsSdk.LitNodeClientNodeJs({
  litNetwork: "habanero",
});
await client.connect();
```

#### Creating an Auth Signature

Then we need to create an [Auth Sig](../../../../versioned_docs/version-2.0/sdk/explanation/authentication/authsig):

```javascript
const authSig = await getAuthSig(client);
```

We use a provided private key (given to us as an environment variable) to create an `ethers` wallet, create a Sign in With Ethereum (SIWE) message, sign it, then return an object that is our Auth Sig.

```javascript
function getPrivateKey() {
  if (process.env.PRIVATE_KEY === undefined)
    throw new Error("Please provide the env: PRIVATE_KEY");
  return process.env.PRIVATE_KEY;
}

function getWallet() {
  return new ethers.Wallet(getPrivateKey());
}

async function getAuthSig(client) {
  const wallet = getWallet();
  const address = ethers.getAddress(await wallet.getAddress());
  const messageToSign = (
    await getSiweMessage(client, address)
  ).prepareMessage();
  const signature = await wallet.signMessage(messageToSign);

  return {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address,
  };
}
```

Our method to create the SIWE message to sign looks like:

```javascript
async function getSiweMessage(client, address) {
  const domain = "localhost";
  const origin = "https://localhost/login";
  const statement =
    "This is a test statement.  You can put anything you want here.";

  // Expiration time in ISO 8601 format. This is 7 days in the future
  const expirationTime = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();

  return new siwe.SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
    nonce: await client.getLatestBlockhash(),
    expirationTime,
  });
}
```

#### Creating Our Access Control Conditions

After obtaining an Auth Sig, our next step is to create the [Access Control Conditions](../../../sdk/access-control/condition-types/unified-access-control-conditions) (ACC):

```javascript
const accessControlConditions = [
  {
    contractAddress: "ipfs://QmcyrxqaLSDjYZpxJUQ3521fUfnVr86bSvLHRZHiaPhMyY",
    standardContractType: "LitAction",
    chain: "ethereum",
    method: "go",
    parameters: ["42"],
    returnValueTest: {
      comparator: "=",
      value: "true",
    },
  },
];
```

- `contractAddress` is the `ipfs` URI of our Lit Action that will be making the request to the Stellar network (more on this in the next section)
- `standardContractType` is us telling Lit that we intend to use a Lit Action for authorization
- `chain` should be `ethereum` even though we're using Stellar
- `method` is the name of the function for Lit Action that will be executed to determine authorization
- `parameters` is an array of arguments Lit will pass to our Lit Action when it's executed
- `returnValueTest` is a list of checks that must all pass in order for Lit to deem our request to decrypt our data as authorized. In our case we're just asserting that our Lit Action must return `true` to be considered an authorization

#### Encrypting Our String

```javascript
const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
  {
    accessControlConditions,
    authSig,
    chain: "ethereum",
    dataToEncrypt: "the answer to life, the universe, and everything is 42",
  },
  client
);
```

Here we're passing in our `accessControlConditions` and `authSig` we just defined, `chain` should be `ethereum`, and our `dataToEncrypt` is an arbitrary `string`. This guide uses `LitJsSdk.encryptString`, however, there are [other encryption methods](../../../sdk/access-control/quick-start#encryption) available if they better suite your use case. Lastly, we pass in our Lit Client (`client`) that we created in the beginning.

The return values, `ciphertext` and `dataToEncryptHash`, are important to keep track of as encryption happens entirely client side, and the Lit network has no record of these values. These values are also mandatory to have in order to perform the decryption of our data. These values will need to be stored and shared by you in order for anyone to perform decryption.

#### Decrypting Our String

```javascript
const decryptedString = await LitJsSdk.decryptToString(
  {
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig,
    chain: "ethereum",
  },
  client
);
console.log("decryptedString", decryptedString);
```

This code is what's responsible for making a request to Lit to execute our Lit Action to attempt to authorize us to decrypt the data. `accessControlConditions` is the same object we defined above, `ciphertext` and `dataToEncryptHash` are our return values from `LitJsSdk.encryptString`, `authSig` can be any valid Lit Auth Sig, here we are just reusing the one we created for encryption, `chain` should be `ethereum`, and lastly `client` is our Lit Client we created in the beginning.

`LitJsSdk.decryptToString` will use our Lit Client to submit our decryption request to the Lit Nodes running the `habanero` testnet. Each Lit Node will pull our Lit Action that we uploaded to IPFS, execute the `method` we defined in our `accessControlConditions`, passing it the `parameters` we also defined in `accessControlConditions`, and will test the value returned by the Lit Action against the `returnValueTest` s we defined in our `accessControlConditions`.

If all the `returnValueTest`s pass, then each Lit Node will provide a [private key share](../../../resources/glossary#private-key-share) that will be used to decrypt our data. Once we have enough key shares to meet the threshold for decryption, the Lit SDK will use the decryption key to decrypt our `ciphertext` and we'll get our original data `console.log`ed.

### Creating a Lit Action to Read From Stellar

#### Creating a Stellar Keypair

[This file](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/litAction_simulate.js), containing our Lit Action code, has a single function which will use the Stellar testnet to simulate a transaction that invokes our Stellar smart contract in order to determine whether or not it should return `true` or `false`, effectively authorizing our callee to decrypt our data.

There are some constraints of the Stellar network that differ from how typical EVM chains function that influence the design of our Lit Action. Stellar requires all calls to submit or simulate a transaction to the network be signed, even if we're invoking a readonly smart contract function.

Currently, Lit support for the `ed25519` signature scheme is in progress, so we must use the Stellar SDK to perform the signing of our transaction - this is why the first line of our Lit Action is creating a Stellar keypair from a hardcoded secret:

```javascript
const sourceKeypair = StellarSdk.Keypair.fromSecret(
  "SCQN3XGRO65BHNSWLSHYIR4B65AHLDUQ7YLHGIWQ4677AZFRS77TCZRB"
);
```

Of course making our secret publicly known is not ideal. Because we cannot use the Lit Network to perform `ed25519` signature needed to create a signed Stellar transaction yet, our other options include:

1. Provide the secret as a input parameter to the Lit Action
   - This option would at least keep who knows the secret to only the Lit Nodes that process our decryption request
2. Provide a pre-signed transaction to the Lit Action
   - This would mean the secret can be kept private, however our Lit Action now acts as a Stellar gateway and doesn't enforce the Stellar smart contract we interact with to aid in authorizing the callee i.e. a signed transaction to any Stellar smart contract that returns true would cause an authorization to occur instead of only a successful execution of our specific smart contract
   - There maybe an option here to lookup the transaction after execution and check the smart contract address and the function that was executed to enforce it matches our expected address and function name
3. Make a request to a server that provides our Stellar secret
   - This option would mean the secret lives on a server we control/trust, and is only exposed in the secure runtime of our Lit Nodes during execution of our Lit Action

#### Creating a Soroban Server and Stellar Contract Instance

```javascript
const server = new StellarSdk.SorobanRpc.Server(
  "https://soroban-testnet.stellar.org:443"
);

const contractAddress =
  "CCIRVLI5WAHVPOU5FXHWPKVTMBCADQFXGJS4ACSUBKT55GCOPTGN5KPQ";
const contract = new StellarSdk.Contract(contractAddress);
```

Here we're connecting to the Soraban testnet using the public RPC endpoint, and creating a `StellarSdk.Contract` instance with the contract address we got from deploying the contract in the [Deploying the Contract to Stellar Testnet](#deploying-the-contract-to-stellar-testnet) section.

#### Creating Our Stellar Transaction

```javascript
const sourceAccount = await server.getAccount(sourceKeypair.publicKey());
let builtTransaction = new StellarSdk.TransactionBuilder(sourceAccount, {
  fee: "100",
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(
    contract.call(
      "is_magic_number",
      StellarSdk.nativeToScVal(parseInt(number), { type: "u32" })
    )
  )
  .setTimeout(90)
  .build();
```

Here we're using the `publicKey` from our `sourceKeypair` to derive our Stellar address. Then we begin constructing the transaction to the Stellar testnet.

```javascript
.addOperation(
    contract.call(
      "is_magic_number",
      StellarSdk.nativeToScVal(parseInt(number), { type: "u32" })
    )
  )
```

Here is where we're setting what contract method we're calling and passing in the `number` parameter given to us by the Lit Action which gets it from `parameters` in the Access Control Conditions we created early when encrypting our data:

```javascript
const accessControlConditions = [
  {
    contractAddress: "ipfs://QmcyrxqaLSDjYZpxJUQ3521fUfnVr86bSvLHRZHiaPhMyY",
    standardContractType: "LitAction",
    chain: "ethereum",
    method: "go",
    parameters: ["42"], // <--- This gets passed into our Lit Action as the `number` parameter
    returnValueTest: {
      comparator: "=",
      value: "true",
    },
  },
];
```

#### Simulating Transaction Execution

```javascript
let preparedTransaction = await server.prepareTransaction(builtTransaction);
preparedTransaction.sign(sourceKeypair);

let simulatedResponse = await server.simulateTransaction(preparedTransaction);
```

Next we prepare the transaction for signing, sign it, and submit a request to the Stellar network to simulate our transaction execution. Ideally we'd actually submit the transaction, as shown in [`litAction_submit.js`](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/litAction_submit.js), but there's an issue with each Lit Node trying to submit a transaction from the same account at the same time. A potential workaround for this is deriving the Stellar secret from something unique to Lit Node when executing the Lit Action.

#### Parsing and Returning the Transaction Return Value

```javascript
const parsedReturnVal = StellarSdk.scValToNative(
  simulatedResponse.result.retval
);

console.log("Result", parsedReturnVal);
return parsedReturnVal;
```

Lastly, we parse the return value of our transaction simulation and return it from the Lit Action. If the provided `number` value satisfies the constraint of our `is_magic_number` method, our Lit Action will return `true`, authorizing our decryption request. Otherwise, `false` will be returned and our decryption request will be denied by the Lit Network.

#### Wrapping Everything in a Try/Catch

```javascript
try {
  // The above code...
} catch (e) {
  console.log(e);
  Lit.Actions.setResponse({ response: JSON.stringify(e) });
}
return false;
```

One thing to notice here is the logic of our Lit Action is wrapped in a `try/catch`. This means that if any of the Lit Action logic `throws`, we'll `catch` it and return `false` to deny encryption. If there is an `error`, `Lit.Actions.setResponse({ response: JSON.stringify(e) });` will set it as the request response for debugging/context purposes.

## Creating the Authorizing Stellar Smart Contract

This directory contains the [Rust Stellar smart contract](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/stellar-contracts/contracts/is_magic_number/src/lib.rs) with two functions:

- `is_magic_number` - This function is intended to showcase how some data provided to a Lit Actions can be provided to a Stellar smart contract to deem whether or not something should be authorized to perform decryption using Lit's network

```rust
pub fn is_magic_number(_env: Env, number: u32) -> bool {
    number == 42
}
```

- `always_true` - This is a test function used to always authorization

```rust
pub fn always_true(_env: Env) -> bool {
    true
}
```

This smart contract is deployed to the Stellar testnet which is periodically reset, so this contract may need to be deployed again in order for this example to function.

### Deploying the Contract to Stellar Testnet

1. Follow [this setup guide](https://developers.stellar.org/docs/smart-contracts/getting-started/setup#install-the-target) to setup the `soroban` CLI
2. Configure an identity to submit transaction to the testnet:
   ```
   soroban keys generate --global alice --network testnet
   ```
3. Compile the smart contract:
   ```
   soroban contract build
   ```
4. Deploy the contract
   ```
   soroban contract deploy \
   --wasm stellar-contracts/target/wasm32-unknown-unknown/release/is_magic_number.wasm \
   --source alice \
   --network testnet
   ```
   The output of this command will be the smart contract address we use to submit transactions to, make sure to copy it and save it for later (you're going to need to paste it in [`litAction_simulate.js`](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/litAction_simulate.js) for the `contractAddress` `const`):
   ```
   CCIRVLI5WAHVPOU5FXHWPKVTMBCADQFXGJS4ACSUBKT55GCOPTGN5KPQ
   ```

### Verifying the smart contract Works as Intended

You can manually call the smart contract functions to verify it's working as intended:

- `is_magic_number`:
  ```
  soroban contract invoke \
  --id CCIRVLI5WAHVPOU5FXHWPKVTMBCADQFXGJS4ACSUBKT55GCOPTGN5KPQ \
  --source alice \
  --network testnet \
  -- \
  is_magic_number \
  --number 42
  ```
  should return `true` while replacing `--number 42` with any other number should return `false`
- `always_true`:
  ```
  soroban contract invoke \
  --id CCIRVLI5WAHVPOU5FXHWPKVTMBCADQFXGJS4ACSUBKT55GCOPTGN5KPQ \
  --source littest \
  --network testnet \
  -- \
  always_true
  ```
  should always return `true`

## Running this Example

1. `git clone git@github.com:spacesailor24/lit-2966-la-unsupported-chains.git`
2. [Deploy an instance](#deploying-the-contract-to-stellar-testnet) of the `IsMagicNumberContract` Stellar smart contract
3. Copy the resulting contract address into [`litAction_simulate.js`](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/litAction_simulate.js)
4. `cd` into the `lit` directory and install the dependencies with `yarn`
5. Run the `build` script to bundle the Lit Action code for deployment: `yarn build`
6. Upload and pin the resulting `lit/dist/litAction_simulate.js` file to IPFS
   - See [this guide](https://www.pinata.cloud/blog/how-do-i-upload-files-to-ipfs) for assistance
7. Update the IPFS URI in [`index.js`](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/index.js):
   ```javascript
   const accessControlConditions = [
     {
       contractAddress: "ipfs://QmcyrxqaLSDjYZpxJUQ3521fUfnVr86bSvLHRZHiaPhMyY",
       // rest of the code...
     },
   ];
   ```
8. Run the example by executing [`index.js`](https://github.com/LIT-Protocol/developer-guides-code/blob/master/lit-actions-conditions-reading-state-from-stellar/lit/src/index.js): `PRIVATE_KEY=<your-private-key> node src/index.js`
   - **NOTE** Running the example requires you to have an Ethereum private key which has a [Capacity Credit](../../../sdk/capacity-credits) minted for it. You can do this using the [Lit Explorer](https://explorer.litprotocol.com/get-credits)
   - You will see a bunch of output to the console as the Lit SDK connect to the network and the decryption request is sent and executed, but at the very end you should see:
   ```
   decryptedString the answer to life, the universe, and everything is 42
   ```
   which demonstrates the successful decryption of our data. To see what happens when authorization fails, you can update the `parameters` in our `accessControlConditions` to anything other than `42`:
   ```javascript
   const accessControlConditions = [
     {
       // Changing this to any number other than `42` will result in failure
       parameters: ["24"],
       // rest of the code...
     },
   ];
   ```
