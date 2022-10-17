---
sidebar_position: 7
---

# Deploy to Polygon Mumbai network

Before deploying the contract to Polygon Mumbai testnet ensure it's correct working on the local hardhat network. After that, you may add the contract to Polygon. Since this is not a tutorial on deploying a smart contract to Polygon I'm going to leave it to the reader.

After deploying, set the contract address & the testnet params, which you will use to initialize the `ethers.Contract` object:
```
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

Congratulations, you're done! You have successfully deployed an NFT Smart Contract on Polygon Mumbai Testnet, which stores Lit encrypted metadata. You've also successfully decrypted the encrypted metadata using Lit SDK.