import React from "react";

export default function AddRollupButton() {
  const addNetwork = () => {
    const params = [
      {
        chainId: "0x2AC49",
        chainName: "Chronicle - Lit Protocol Testnet",
        nativeCurrency: {
          name: "LIT",
          symbol: "LIT",
          decimals: 18,
        },
        rpcUrls: ["https://chain-rpc.litprotocol.com/replica-http"],
        blockExplorerUrls: ["https://chain.litprotocol.com"],
      },
    ];

    window.ethereum
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => console.log("Success"))
      .catch((error) => console.log("Error", error.message));
  };

  return <button onClick={addNetwork}>Add Chronicle to Metamask</button>;
}
