# Cross Chain EVM Swap
In this section, we will demonstrate how you can use PKPs and Lit Actions to perform a cross-chain swap. There are three parts to this flow:

- Understanding Lit PKPs as escrow
- Lit Action
- Implementing Mint/Grant/Burn with SDK

## 1) Understanding Lit PKPs as escrow

A Private key is meant for signing transactions which are executed on the blockchain, a network verifies if the transaction is a legitimate one and then executes it. With Lit Network we can generate a special type of private keys which can be programmed to sign transactions only when certain conditions are met. With this, we can create several escrow mechanisms, and we will look into how we can execute a cross-chain swap.

### A swap example would be:
Suppose Alice holds 100 token A on Base and Bob holds 100 token B on Chronicles and they both agree to a swap of,
- 4 token A from Alice to Bob on Base
- 8 token B from Bob to Alice on Chronicles

We have an [example code](https://github.com/anshss/lit-evm-swap) for the below solution.

### How does this work?
When you generate a PKP on the LIT Network, a PKP NFT is first minted to your wallet, representing your ownership over the underlying private key residing on the LIT Network. This PKP NFT is responsible for managing auth methods over the private key.

Lit Actions are programmable code written in Javascript which can run on the LIT Network. We can program a Lit Action so that if certain permissions are met for a pkp, it must sign specific transactions that can be sent to the blockchain. We need to grant a Lit Action as a permitted action to the PKP to allow the Lit Action to generate signatures with it.

We can create an escrow pkp in the following way (Mint/ Grant/ Burn)

- Mint a PKP on Lit
- Grant a permitted Lit Action
- Burn the PKP NFT so that no more auth methods can be modified

This approach will allow us to create scenarios where a private key can generate signs based on conditions and unlock robust opportunities like cross-chain swapping, messaging or bridging.

For a Swap Lit Action, both parties need to deposit their funds to the PKP and based on the conditions the PKP should be completing the swap:

- Alice (or Bob) creates a Mint/Grant/Burn PKP
- Alice deposits 4 token A on Base Sepolia to the PKP
- Bob deposits 8 token B on Chronicles to the PKP
- Alice (or Bob) executes the Lit Action.

Lit Action execution, checks conditions and executes the swap from the PKP

If the swap conditions aren't met then the Lit Action execution shall revert the funds to their depositors.

### Architecture for Mint/Grant/Burn

![accessControl](/img/mgb-flow.png)

## 2) Lit Action

Now we'll dive into the depths of the Lit Action and explore how we can conduct conditional signing.

Below are the parameters that decide the swapping conditions.

```js
const chainAParams = {
    from: "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB",
    to: "0x291B0E3aA139b2bC9Ebd92168575b5c6bAD5236C",
    tokenAddress: "0xad50f302a957C165d865eD398fC3ca5A5A2cDA85",
    chain: "baseSepolia",
    amount: "4",
    decimals: 18,
    chainId: 84532,
};

const chainBParams = {
    from: "0x291B0E3aA139b2bC9Ebd92168575b5c6bAD5236C",
    to: "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB",
    tokenAddress: "0x2dcA1a80c89c81C37efa7b401e2d20c1ED99C72F",
    chain: "yellowstone",
    amount: "8",
    decimals: 18,
    chainId: 175188,
};
/* 
deposit1: wallet A deposits on chain B, if action executes, funds are transferred to wallet B
deposit2: wallet B deposits on chain A, if action executes, funds are transferred to wallet A
*/
```
:::info
On the chains section, we can specify any of the chains [supported](../resources/supported-chains) by LIT.
:::

You can find a generator which takes the above params to generate a Lit Action for swap: [swapActionGenerator.js](https://github.com/anshss/lit-evm-swap/blob/main/lit/swapActionGenerator.js)

Remember, once a Mint/Grant/Burn PKP is created, anyone can execute the Lit Action on the Lit Network. This execution needs to define the parameters needed by the Lit Action to run. While generating a sign or checking conditions on the action, we need information around the pkp for which we are doing it. Due to this, we need to construct our Lit Action in a way that works with any PKP.

Our Lit Action primarily focuses on three factors:

- Access Conditions for checking funds on both chains
- Transaction objects for transferring funds between swap parties
- Clawback Transaction objects for revert transferring funds to their owners
- Lit Action conditions which decide which transaction object to sign and return

We'll use [Lit's Access Control](../sdk/access-control/evm/basic-examples#must-posess-at-least-one-erc20-token) here to verify if the conditions are being met for the swap. There need to be 2 conditions for a swap to execute,

- Have token A funds reached on Chain A?
- Have token B funds reached on Chain B?

If yes, then forward the funds and complete the swap or else revert them.

A condition on Base Sepolia for checking if the PKP contains the exact amount of token A in Wei will look like this:

```js
const chainACondition = {
    conditionType: "evmBasic",
    contractAddress: "0xad50f302a957C165d865eD398fC3ca5A5A2cDA85",
    standardContractType: "ERC20",
    chain: "baseSepolia",
    method: "balanceOf",
    parameters: ["address"],
    returnValueTest: { comparator: "==", value: "4000000000000000000" },
};
// parameter field would be later replaced by the pkpAddress in the action
```

There need to be two transaction objects, each of which transfers funds between the swap parties. Each of them will be calling function `transfer(address, uint256)` on the token's smart contract. This information is captured in the "data" field of the object. We can get that in the following way,

```js
function generateCallData(counterParty, amount) {
    const transferInterface = new ethers.utils.Interface([
        "function transfer(address, uint256) returns (bool)",
    ]);
    return transferInterface.encodeFunctionData("transfer", [
        counterParty,
        amount,
    ]);
}
```

A transaction object would then look something like below

```js
let chainATransaction = {
    to: "0xad50f302a957C165d865eD398fC3ca5A5A2cDA85",
    gasLimit: "60000",
    from: "0x291B0E3aA139b2bC9Ebd92168575b5c6bAD5236C",
    data: "0xa9059cbb000000000000000000000000291b0e3aa139b2bc9ebd92168575b5c6bad5236c0000000000000000000000000000000000000000000000003782dace9d900000",
    type: 2,
};
// "to" field specifies tokenA contract
// "from" field would be later replaced by the pkpAddress in the action
```

Clawback transaction objects are transactions that transfer funds back to the depositors if the swap conditions aren't met. These will have a different value for the `data` field and can be generated again using the `generateCallData()` function, with the `counterParty` value set to the depositor.

Let's start with writing a Lit Action,

```js
const go = async () => {
    const chainACondition = {"conditionType":"evmBasic","contractAddress":"0xad50f302a957C165d865eD398fC3ca5A5A2cDA85","standardContractType":"ERC20","chain":"baseSepolia","method":"balanceOf","parameters":["address"],"returnValueTest":{"comparator":">=","value":"4000000000000000000"}}
    const chainBCondition = {"conditionType":"evmBasic","contractAddress":"0x2dcA1a80c89c81C37efa7b401e2d20c1ED99C72F","standardContractType":"ERC20","chain":"yellowstone","method":"balanceOf","parameters":["address"],"returnValueTest":{"comparator":">=","value":"8000000000000000000"}}
    let chainATransaction = {"to":"0xad50f302a957C165d865eD398fC3ca5A5A2cDA85","gasLimit":"60000","from":"0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB","data":"0xa9059cbb000000000000000000000000291b0e3aa139b2bc9ebd92168575b5c6bad5236c0000000000000000000000000000000000000000000000003782dace9d900000","type":2}
    let chainBTransaction = {"to":"0x2dcA1a80c89c81C37efa7b401e2d20c1ED99C72F","gasLimit":"60000","from":"0x291B0E3aA139b2bC9Ebd92168575b5c6bAD5236C","data":"0xa9059cbb00000000000000000000000048e6a467852fa29710aaacdb275f85db4fa420eb0000000000000000000000000000000000000000000000006f05b59d3b200000","type":2}
    let chainAClawbackTransaction = {"to":"0xad50f302a957C165d865eD398fC3ca5A5A2cDA85","gasLimit":"60000","from":"0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB","data":"0xa9059cbb00000000000000000000000048e6a467852fa29710aaacdb275f85db4fa420eb0000000000000000000000000000000000000000000000003782dace9d900000","type":2}
    let chainBClawbackTransaction = {"to":"0x2dcA1a80c89c81C37efa7b401e2d20c1ED99C72F","gasLimit":"60000","from":"0x291B0E3aA139b2bC9Ebd92168575b5c6bAD5236C","data":"0xa9059cbb000000000000000000000000291b0e3aa139b2bc9ebd92168575b5c6bad5236c0000000000000000000000000000000000000000000000006f05b59d3b200000","type":2}
    
    chainATransaction.from = chainBTransaction.from = pkpAddress;

    chainACondition.parameters = chainBCondition.parameters = [
      pkpAddress,
    ];

    chainATransaction = {...chainATransaction, ...chainAGasConfig}
    chainBTransaction = {...chainBTransaction, ...chainBGasConfig}
    chainAClawbackTransaction = {...chainAClawbackTransaction, ...chainAGasConfig}
    chainBClawbackTransaction = {...chainBClawbackTransaction, ...chainBGasConfig}
```

Here, we are substituting the `from` field in the transaction objects with `pkpAddress` and replacing the `parameters` the field in the conditions object with `pkpAddress`.

We then, extend our transaction object with the gas configs which will be received during the execution of the action. We'll look into this later.

```js
    const chainAConditionsPass = await Lit.Actions.checkConditions({
      conditions: [chainACondition],
      authSig: JSON.parse(authSig),
      chain: chainACondition.chain,
    });
  
    const chainBConditionsPass = await Lit.Actions.checkConditions({
      conditions: [chainBCondition],
      authSig: JSON.parse(authSig),
      chain: chainBCondition.chain,
    });

    console.log("chainAConditionsPass: ", chainAConditionsPass, "chainBConditionsPass: ", chainBConditionsPass);
```

Now our action checks if the conditions are passed on both chains, it takes `authSig` as a parameter here and then logs the result of both condition checks. We'll look into auth sigs while we learn to execute lit actions.

For generating signatures inside our Lit Action, we'll use `Lit.Actions.signEcdsa`. This method allows us to use a pkp (which lets an action generate a sign) for generating signatures. Our Lit Action will now decide based on checked conditions and generate appropriately signed transactions which we can send to the blockchain later.

```js
    if (chainAConditionsPass && chainBConditionsPass) {
      await generateSwapTransactions();
      return;
    }

    if (chainAConditionsPass) {
      await Lit.Actions.signEcdsa({
        toSign: hashTransaction(chainAClawbackTransaction),
        publicKey: pkpPublicKey,
        sigName: "chainASignature",
      });
      Lit.Actions.setResponse({
        response: JSON.stringify({
          chainATransaction: chainAClawbackTransaction,
        }),
      });
      return;
    }
  
    if (chainBConditionsPass) {
      await Lit.Actions.signEcdsa({
        toSign: hashTransaction(chainBClawbackTransaction),
        publicKey: pkpPublicKey,
        sigName: "chainBSignature",
      });
      Lit.Actions.setResponse({
        response: JSON.stringify({
          chainBTransaction: chainBClawbackTransaction,
        }),
      });
      return;
    }

    const generateSwapTransactions = async () => {
      await LitActions.signEcdsa({
        toSign: hashTransaction(chainATransaction),
        publicKey: pkpPublicKey,
        sigName: "chainASignature",
      });
      await LitActions.signEcdsa({
        toSign: hashTransaction(chainBTransaction),
        publicKey: pkpPublicKey,
        sigName: "chainBSignature",
      });
      Lit.Actions.setResponse({
        response: JSON.stringify({ chainATransaction, chainBTransaction }),
      });
    };
```

As everything on the blockchain works on hexadecimal hashes, we need to hash our transactions as well.

```js
    const hashTransaction = (tx) => {
      return ethers.utils.arrayify(
        ethers.utils.keccak256(
          ethers.utils.arrayify(ethers.utils.serializeTransaction(tx)),
        ),
      );
    }

    Lit.Actions.setResponse({ response: "Conditions for swap not met!" });
  }
go();
```

A must `Lit.Actions.setResponse` needs to be set before we are closing the execution of a Lit Action. This is the response which is shown after the execution of a Lit Action.

Complete Lit Action can be found at [swapAction.js](https://github.com/anshss/lit-evm-swap/blob/main/lit/swapAction.js).

## 3) Implementing Mint/Grant/Burn with SDK

### Installing Packages

```bash
npm i @lit-protocol/lit-node-client @lit-protocol/contracts-sdk 
@simplewebauthn/browser  @lit-protocol/types ethers
```

### Imports Declarations

```js
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNetwork, AuthMethodScope, LIT_CHAINS } from "@lit-protocol/constants";
import { LitAbility } from "@lit-protocol/types";
import {
    LitActionResource,
    createSiweMessageWithRecaps,
    generateAuthSig,
    LitPKPResource,
} from "@lit-protocol/auth-helpers";
import { ethers } from "ethers";
import bs58 from "bs58";
```

### Create Wallet instances

These wallets will represent the two parties involved in the swap.

```js
async function getWalletA() {
    const provider = new ethers.providers.JsonRpcProvider(
        `https://yellowstone-rpc.litprotocol.com/`
    );
    const wallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_PRIVATE_KEY_1,
        provider
    );
    return wallet;
}

async function getWalletB() {
    const provider = new ethers.providers.JsonRpcProvider(
        `https://yellowstone-rpc.litprotocol.com/`
    );
    const wallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_PRIVATE_KEY_2,
        provider
    );
    return wallet;
}c
```

### Create Lit Action and upload it to IPFS

Once we are done with our Lit Action, we need to upload it to IPFS so we get an immutable CID which will always point to our action.

```js
export async function createLitAction() {
    console.log("creating lit action..");
    const action = createERC20SwapLitAction(chainAParams, chainBParams);
    const ipfsCid = await uploadViaPinata(action);

    console.log("Lit Action code:\n", action);
    console.log("IPFS CID: ", ipfsCid);
    return ipfsCid;
}
```

### Create a Mint/Grant/Burn PKP
We'll create a single function to perform 3 calls at once

- Mint a PKP with the user's wallet
- Add the Lit Action as a permitted auth Method
- Burn the PKP NFT by transferring it to itself so auth methods become immutable

Now, our PKP will only be used to execute the Lit Action we permitted. It will generate signatures only when the Lit Action is running and not in any other situations. We have already designed the Lit Action to create the correct signed transactions based on the conditions.
```js
export async function mintGrantBurnPKP(action_ipfs, mintedPKP) {
    console.log("minting started..");
    const signerA = await getWalletA();

// instantiating Contracts SDK
    const litContracts = new LitContracts({
        signer: signerA,
        network: LitNetwork.DatilDev,
        debug: false,
    });
    await litContracts.connect();

// minting a new PKP
    const mintPkp = await litContracts.pkpNftContractUtils.write.mint();
    const pkp = mintPkp.pkp;
    console.log("PKP: ", pkp);

    console.log("adding permitted action..");

// adding a permitted lit action
    await litContracts.addPermittedAction({
        pkpTokenId: pkp.tokenId,
        ipfsId: action_ipfs,
        authMethodScopes: [AuthMethodScope.SignAnything],
    });

    console.log("transfer started..");

// burning the PKP NFT
    const transferPkpOwnership =
        await litContracts.pkpNftContract.write.transferFrom(
            signerA.address,
            pkp.ethAddress,
            pkp.tokenId,
            {
                gasLimit: 125_000,
            }
        );

    const receipt = await transferPkpOwnership.wait();

    console.log(
        "Transferred PKP ownership to itself: ",
        receipt
    );
    return pkp;
}
```

### Deposit Methods

To deposit swap tokens along with some native tokens for gas

```js
export async function depositOnChainA(action_ipfs, mintedPKP) {
    console.log(
        `deposit started from wallet A on chain A (${chainAParams.chain})..`
    );
    let wallet = await getWalletA();

    // chain provider
    const chainAProvider = new ethers.providers.JsonRpcProvider(
        LIT_CHAINS[chainAParams.chain].rpcUrls[0]
    );
    wallet = wallet.connect(chainAProvider);

    // sometimes you may need to add gasLimit
    const transactionObjectToken = {
        to: chainAParams.tokenAddress,
        from: await wallet.getAddress(),
        data: generateCallData(
            mintedPKP.ethAddress,
            ethers.utils
                .parseUnits(chainAParams.amount, chainAParams.decimals)
                .toString()
        ),
    };

    const tx = await wallet.sendTransaction(transactionObjectToken);
    const receipt = await tx.wait();

    console.log("token deposit executed: ", receipt);

    console.log("depositing some funds for gas..");

    // gas value differs for chains, check explorer for more info
    const transactionObjectGas = {
        to: mintedPKP.ethAddress,
        value: ethers.BigNumber.from("1000000000000000"),
        gasPrice: await chainAProvider.getGasPrice(),
    };

    const tx2 = await wallet.sendTransaction(transactionObjectGas);
    const receipt2 = await tx2.wait();

    console.log("gas deposit executed: ", receipt2);
}
```

The deposit method needs to be called each for token A from wallet A (Alice) as well as token B from wallet B (Bob).

### Executing Swap Action

Now, we will execute the swap action we wrote earlier using the PKP we just generated. To do this, we'll use the `executeJs` method on the SDK. We'll pass the Lit Action, Session Signature, and the parameters for the Lit Action.

```js
export async function executeSwapAction(action_ipfs, mintedPKP) {
    console.log("executing action started..");
    const sessionSigs = await sessionSigUser();
    const authSig = await getAuthSig();
```

Session Signatures are used to authenticate with the Lit nodes and create a secure connection to the Lit network. This essentially informs the network about the user attempting to use the Lit Network. In a Session Signature, we also include the resources we are requesting from the Lit Network. For us, that would be:
- executing the Lit action
- signing with the PKP

```js
export async function sessionSigUser() {
    console.log("creating session sigs..");
    const ethersSigner = await getWalletA();

    await litNodeClient.connect();

    const sessionSigs = await litNodeClient.getSessionSigs({
        pkpPublicKey: mintedPKP.publicKey,
        chain: "ethereum",
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
        authNeededCallback: async (params) => {
            if (!params.uri) {
                throw new Error("Params uri is required");
            }

            if (!params.resourceAbilityRequests) {
                throw new Error("Params uri is required");
            }

            const toSign = await createSiweMessageWithRecaps({
                uri: params.uri,
                expiration: new Date(
                    Date.now() + 1000 * 60 * 60 * 24
                ).toISOString(), // 24 hours,
                resources: params.resourceAbilityRequests,
                walletAddress: await ethersSigner.getAddress(),
                nonce: await litNodeClient.getLatestBlockhash(),
                litNodeClient,
                domain: "localhost:3000",
            });

            return await generateAuthSig({
                signer: ethersSigner,
                toSign,
            });
        },
    });

    console.log("sessionSigs: ", sessionSigs);
    return sessionSigs;
}
```

The parameters for the Lit Action we mentioned above include the auth signature and gas configurations. The auth signature is used to verify conditions on the Lit Action we discussed earlier. An AuthSig is a signature created through the user's wallet and is used for authentication.

We can generate an AuthSig as shown below:

```js
export async function getAuthSig() {
    const signer = await getWalletA();

    await litNodeClient.connect();

    const toSign = await createSiweMessageWithRecaps({
        uri: "http://localhost:3000",
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
        walletAddress: await signer.getAddress(),
        nonce: await litNodeClient.getLatestBlockhash(),
        litNodeClient,
    });

    const authSig = await generateAuthSig({
        signer: signer,
        toSign,
    });
    return authSig;
}
// this remains valid for 24hrs
```

Gas configuration may vary from chain to chain but for the current chains, the configurations below work well. You may need to sometime specify more parameters while constructing a transaction object.

```js

    const chainAProvider = new ethers.providers.JsonRpcProvider(
        LIT_CHAINS[chainAParams.chain].rpcUrls[0]
    );

    const chainBProvider = new ethers.providers.JsonRpcProvider(
        LIT_CHAINS[chainBParams.chain].rpcUrls[0]
    );

    // sometimes you may need to configure gas values manually, try checking test minting methods for more info
    const gasConfigA = {
        gasLimit: ethers.BigNumber.from("54000"),
        maxPriorityFeePerGas: ethers.BigNumber.from("1500000000"),
        maxFeePerGas: ethers.BigNumber.from("1500000000"),
        chainId: LIT_CHAINS[chainAParams.chain].chainId,
        nonce: await chainAProvider.getTransactionCount(mintedPKP.ethAddress),
    };

    const gasConfigB = {
        maxFeePerGas: ethers.BigNumber.from("1500000000"),
        chainId: LIT_CHAINS[chainBParams.chain].chainId,
        nonce: await chainBProvider.getTransactionCount(mintedPKP.ethAddress),
    };

    await litNodeClient.connect();

    const results = await litNodeClient.executeJs({
        ipfsId: action_ipfs,
        sessionSigs: sessionSigs,
        jsParams: {
            pkpPublicKey: mintedPKP.publicKey,
            pkpAddress: mintedPKP.ethAddress,
            authSig: JSON.stringify(authSig),
            chainAGasConfig: gasConfigA,
            chainBGasConfig: gasConfigB,
        },
    });

    console.log("results: ", results);
```

Based on the results returned by the nodes, we can execute the signed transactions by sending them to the blockchain networks.

```js

    if (results.signatures == undefined) {
        return;
    }

    else if (results.signatures.chainBSignature == undefined) {
        console.log("executing clawbackA tx..")
        await executeTxA(results, chainAProvider);
    }

    else if (results.signatures.chainASignature == undefined) {
        console.log("executing clawbackB tx..")
        await executeTxB(results, chainBProvider);
    }

    else {
        console.log("executing swap txs..")
        await executeTxA(results, chainAProvider);
        await executeTxB(results, chainBProvider);
    }
}
```

These two functions will handle sending individual transactions on each network.

```js

async function executeTxA(results, chainAProvider) {
    const signatureA = formatSignature(results.signatures.chainASignature);
    const tx1 = await chainAProvider.sendTransaction(
        ethers.utils.serializeTransaction(
            results.response.chainATransaction,
            signatureA
        )
    );
    console.log(tx1);
    
    const receipt1 = await tx1.wait();
    const blockExplorer1 = LIT_CHAINS[chainAParams.chain].blockExplorerUrls[0];
    
    console.log(`tx: ${blockExplorer1}/tx/${receipt1.transactionHash}`);
}

async function executeTxB(results, chainBProvider) {
    const signatureB = formatSignature(results.signatures.chainBSignature);
    const tx2 = await chainBProvider.sendTransaction(
        ethers.utils.serializeTransaction(
            results.response.chainBTransaction,
            signatureB
        )
    );
    const receipt2 = await tx2.wait();
    const blockExplorer2 = LIT_CHAINS[chainBParams.chain].blockExplorerUrls[0];

    console.log(`tx: ${blockExplorer2}/tx/${receipt2.transactionHash}`);
}
```

A signed transaction returned by the Lit Network has a different structure for signatures that we need to reconstruct as follows:

```js
function formatSignature(signature) {
    const encodedSig = ethers.utils.joinSignature({
        v: signature.recid,
        r: `0x${signature.r}`,
        s: `0x${signature.s}`,
    });
    return encodedSig;
}
```

You can also explore other methods, such as checking permissions on the PKP, checking the fund status of each wallet, or the PKP itself [here](https://github.com/anshss/lit-evm-swap/blob/main/lit/utils.js).