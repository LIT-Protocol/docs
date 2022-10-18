---
sidebar_position: 4
---

# NFT Smart Contract

This is our NFT smart contract which will contain the encrypted metadata.

The NFT's name & imageUrl are **not** encrypted & hence will be visible to all our users. But, we have to store an encrypted description string: `encryptedDescription` & the associated `encryptedSymmetricKey`, which will come in handy when we decrypt the string, as we've seen on the previous page.

## To Start
Create a file `LitNFT.sol` in the contracts directory.

## 1. Set the URI for each NFT
Our contract should inherit from ERC721URIStorage, a standard implementation of an NFT provided by Openzepplin. We have to set the URI for each NFT (see below):
```js
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LitNft is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; // for NFT ids
}
```

## 2. Define the struct for the NFT and a mapping
Let's define the struct for our NFT & a mapping which will give us the NFT from its token:
```js
    mapping(uint256 => nft) private tokenIdToNft;

    struct nft {
        string name;
        string imageUrl;
        string encryptedDescription;
        string encryptedSymmetricKey;
    }
```

## 3. Define a function to get the URI for an NFT
Let's define a function to get the URI for an NFT given its `name`, `imageUrl`, `encryptedDescription` & `encryptedSymmetricKey`. Then we're returning a string containing the array of bytes representing the Base64 encoded version of the dataURI with the JSON metadata:
```json
    function getTokenURI(
        string memory name,
        string memory imageUrl,
        string memory encryptedDescription,
        string memory encryptedSymmetricKey
    ) private pure returns (string memory) {
        bytes memory dataURI = abi.encodePacked( // we're encoding a JSON
            '{',
                '"name": "', name, '",',
                '"image": "', imageUrl, '",',
                '"description": "', encryptedDescription, '",',
                '"symmetricKey": "', encryptedSymmetricKey, '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }
```

## 4. Mint the NFT & set URI
Finally, we can mint the NFT & then set its URI using the `getTokenURI` function defined above:
```js
    function mintLitNft(
        string memory name,
        string memory imageUrl,
        string memory encryptedDescription,
        string memory encryptedSymmetricKey
    ) public nonReentrant {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _safeMint(msg.sender, newNftTokenId); // from ERC721URIStorage
        _setTokenURI(newNftTokenId, getTokenURI(name, imageUrl, encryptedDescription, encryptedSymmetricKey));
        tokenIdToNft[newNftTokenId] = nft(name, imageUrl, encryptedDescription, encryptedSymmetricKey); // using our struct defined above
    }
```

## Putting it all together
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LitNft is ERC721URIStorage, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721 ("Lit NFT", "LITNFT"){}

    mapping(uint256 => nft) private tokenIdToNft;

    struct nft {
        string name;
        string imageUrl;
        string encryptedDescription;
        string encryptedSymmetricKey;
    }

    function getTokenURI(
        string memory name,
        string memory imageUrl,
        string memory encryptedDescription,
        string memory encryptedSymmetricKey
    ) private pure returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "', name, '",',
                '"image": "', imageUrl, '",',
                '"description": "', encryptedDescription, '",',
                '"symmetricKey": "', encryptedSymmetricKey, '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function mintLitNft(
        string memory name,
        string memory imageUrl,
        string memory encryptedDescription,
        string memory encryptedSymmetricKey
    ) public nonReentrant {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _safeMint(msg.sender, newNftTokenId);
        _setTokenURI(newNftTokenId, getTokenURI(name, imageUrl, encryptedDescription, encryptedSymmetricKey));
        tokenIdToNft[newNftTokenId] = nft(name, imageUrl, encryptedDescription, encryptedSymmetricKey);
    }

    // Fetch all the NFTs to display
    function fetchNfts() public view returns (nft[] memory) {
        nft[] memory nfts = new nft[](_tokenIds.current());
        for (uint256 idx = 1; idx < _tokenIds.current() + 1; idx++) {
            nft memory currNft = tokenIdToNft[idx];
            nfts[idx - 1] = currNft;
        }

        return nfts;
    }
}
```