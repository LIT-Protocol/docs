import React from "react";

export default function AddRollupButton() {
  const addNetwork = () => {
    const params = [
      {
        chainId: "0x2AC54",
        chainName: "Chronicle Yellowstone - Lit Protocol Testnet",
        nativeCurrency: {
          name: "Lit Protocol - Chronicle Yellowstone Testnet Token (tstLPX)",
          symbol: "tstLPX",
          decimals: 18,
        },
        rpcUrls: ["https://yellowstone-rpc.litprotocol.com"],
        blockExplorerUrls: ["https://yellowstone-explorer.litprotocol.com"],
      },
    ];

    window.ethereum
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => console.log("Success"))
      .catch((error) => console.log("Error", error.message));
  };

  return (
    <button onClick={addNetwork}>Add Chronicle Yellowstone to Metamask</button>
  );
}
