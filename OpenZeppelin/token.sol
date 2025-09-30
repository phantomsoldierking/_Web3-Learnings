// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ExampleNFT - A simple ERC721 NFT with mint, transfer, and burn
contract ExampleNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("ExampleNFT", "ENFT") Ownable(msg.sender) {}

    /// @notice Mint a new NFT to a recipient with a given metadata URI
    /// @param to The recipient address
    /// @param tokenURI The metadata URI (e.g., IPFS link)
    function mint(address to, string memory tokenURI) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    /// @notice Burn an existing NFT
    /// @param tokenId The token ID to burn
    function burn(uint256 tokenId) external {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Not owner nor approved"
        );
        _burn(tokenId);
    }

    /// @notice Transfer function is already provided by ERC721:
    /// - transferFrom(from, to, tokenId)
    /// - safeTransferFrom(from, to, tokenId)
    /// - safeTransferFrom(from, to, tokenId, data)
}
