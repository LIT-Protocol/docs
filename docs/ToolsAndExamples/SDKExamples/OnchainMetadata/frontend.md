---
sidebar_position: 6
---

# Using Lit SDK on Frontend

Here we're going to discuss **only** the parts concerned with using the Lit SDK & interfacing with our deployed Smart Contract. The reader is expected to take care of:
* The user inputs for NFTs (i.e. it's name, description & imageUrl)
* Fetching the NFTs using the `fetchNfts()` function we defined in `LitNFT.sol`
* Displaying the fetched NFTs.


If you want to take a look at a complete **React** project which takes care of all that, please take a look at this [Replit](https://replit.com/@lit/Encrypt-and-Decrypt-On-chain-NFT-Metadata#encrypt_and_decrypt_on-chain_nft_metadata/src/App.js).

## Mint NFT with encrypted description metadata

1. Let's see how a user can mint an NFT given its name, imageUrl & description. First, we encrypt the description using our Lit class' function `encryptText`:
```
  const mintLitNft = async (name, imageUrl, description) => {
    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(description);
```

:::note

`encryptedString` is a **Blob** and not a string.
:::

2. Since our smart contract function `mintLitNFT()` takes a string for the encryptedDescription we convert the Blob to a string below:
```
    // Convert blob to base64 to pass as a string to Solidity
    const blobToBase64 = blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    const encryptedDescriptionString = await blobToBase64(encryptedString);

    let transaction = await litNftContract.mintLitNft(name, imageUrl, encryptedDescriptionString, encryptedSymmetricKey);
    await transaction.wait();
```

### Putting it together

```
  const mintLitNft = async (name, imageUrl, description) => {
    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(description);

    // Convert blob to base64 to pass as a string to Solidity
    const blobToBase64 = blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    const encryptedDescriptionString = await blobToBase64(encryptedString);

		let transaction = await litNftContract.mintLitNft(name, imageUrl, encryptedDescriptionString, encryptedSymmetricKey);
    await transaction.wait();

    // You may want to fetch & set all the NFTs after minting a new one
    // const _nfts = await litNftContract.fetchNfts();
    // setNFTs(_nfts);
  }
```

## Decrypting description from fetched NFTs

1. Since all our NFT fields are strings, the first step is to convert the returned description string to a Blob to pass it to Lit's `decryptText()`.

```
  const decryptDescription = async (encryptedDescriptionString, encryptedSymmetricKeyString) => {
    // Convert base64 to blob to pass in the litSDK decrypt function
    const encryptedDescriptionBlob = await (await fetch(encryptedDescriptionString)).blob();
```

2. Now, we can pass it to `decryptText()`.

```
    let decryptedDescription;
    try {
      decryptedDescription = await lit.decryptText(encryptedDescriptionBlob, encryptedSymmetricKeyString);
    } catch (error) {
        console.log(error);
    }
  }
```

### Putting it together
```
  const decryptDescription = async (encryptedDescriptionString, encryptedSymmetricKeyString) => {
    // Convert base64 to blob to pass in the litSDK decrypt function
    const encryptedDescriptionBlob = await (await fetch(encryptedDescriptionString)).blob();

    let decryptedDescription;
    try {
      decryptedDescription = await lit.decryptText(encryptedDescriptionBlob, encryptedSymmetricKeyString);
      setShowButton(false);
    } catch (error) {
        console.log(error);
    }

    // Set decrypted string
    // setDescription(decryptedDescription);
  }
```