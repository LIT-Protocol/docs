import React from 'react';

export default function AddRollupButton() {
  const addNetwork = () => {
    const params = [
      {
        chainId: '0x2AC54',
        chainName: 'Chronicle Yellowstone - Lit Protocol Testnet',
        nativeCurrency: {
          name: 'Lit Protocol - Chronicle Yellowstone Testnet Token (tstLPX)',
          symbol: 'tstLPX',
          decimals: 18,
        },
        rpcUrls: ['https://yellowstone-rpc.litprotocol.com'],
        blockExplorerUrls: ['https://yellowstone-explorer.litprotocol.com'],
      },
    ];

    window.ethereum
      .request({ method: 'wallet_addEthereumChain', params })
      .then(() => console.log('Success'))
      .catch(error => console.log('Error', error.message));
  };

  const buttonStyle = {
    backgroundColor: '#FF6837',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <button
      onClick={addNetwork}
      style={buttonStyle}
      onMouseOver={e => (e.target.style.backgroundColor = '#FF8B66')}
      onMouseOut={e => (e.target.style.backgroundColor = '#FF6837')}
    >
      Add Chronicle Yellowstone to Metamask
    </button>
  );
}
