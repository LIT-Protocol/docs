---
sidebar_position: 6
---

# Deploy to Polygon Mumbai network

Before deploying the contract to Polygon Mumbai testnet ensure it's correctly working on the local hardhat network. After that, you may add the contract to Polygon. 

:::note

This is **not** a tutorial on deploying a smart contract to Polygon, check out the [Polygon documentation](https://wiki.polygon.technology/docs/develop/getting-started) to get more info.
:::

After deploying, set the contract address & the testnet params, which you will use to initialize the `ethers.Contract` object:
```js
  const litNFTContractAddress = "0xBb6fd36bf6E45FBd29321c8f915E456ED42fDc13"; // this is our contract, replace it with yours
  const mumbaiTestnet = {
    chainId: "0x13881",
    chainName: "Matic Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  }
```

Congratulations, you're done! You have successfully deployed a Lit encrypted metadata NFT smart contract on the Polygon Mumbai testnet. You've also successfully decrypted the metadata using the Lit SDK.

For the best experience please open the web app in a new tab.

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@lit/Encrypt-and-Decrypt-On-chain-NFT-Metadata#encrypt_and_decrypt_on-chain_nft_metadata/src/App.js"></iframe>