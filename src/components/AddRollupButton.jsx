import React from 'react';

export default function AddRollupButton() {
  const addNetwork = () => {
    const params = [
      {
        chainId: '0x2AC49',
        chainName: 'Chronicle - Lit Protocol Testnet',
        nativeCurrency: {
          name: 'Lit Protocol - Chronicle Testnet Token (tstLIT)',
          symbol: 'tstLIT',
          decimals: 18,
        },
        rpcUrls: ['https://chain-rpc.litprotocol.com/replica-http'],
        blockExplorerUrls: ['https://chain.litprotocol.com'],
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
      Add Chronicle to Metamask
    </button>
  );
}
