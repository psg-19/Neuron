// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartContractMarketplace is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    struct ContractMetadata {
        address creator;
        string[] tags;
        uint256 usageFee;
    }
    
    mapping(uint256 => ContractMetadata) public contractDetails;
    mapping(uint256 => mapping(address => bool)) public hasAccess;

    event ContractUploaded(uint256 indexed tokenId, address indexed creator, uint256 usageFee);
    event ContractAccessed(uint256 indexed tokenId, address indexed user);

    constructor() ERC721("SmartContractNFT", "SCNFT") Ownable(msg.sender) {}
    
    function uploadContract(string memory tokenURI, string[] memory tags, uint256 usageFee) public {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        contractDetails[newTokenId] = ContractMetadata({
            creator: msg.sender,
            tags: tags,
            usageFee: usageFee
        });
        
        emit ContractUploaded(newTokenId, msg.sender, usageFee);
    }
    
    function accessContract(uint256 tokenId) public payable {
        require(_exists(tokenId), "Contract does not exist");
        require(msg.value >= contractDetails[tokenId].usageFee, "Insufficient fee");
        
        address creator = contractDetails[tokenId].creator;
        payable(creator).transfer(msg.value);
        
        hasAccess[tokenId][msg.sender] = true;
        
        emit ContractAccessed(tokenId, msg.sender);
    }
    
    function getContractDetails(uint256 tokenId) public view returns (address, string[] memory, uint256) {
        require(_exists(tokenId), "Contract does not exist");
        ContractMetadata storage metadata = contractDetails[tokenId];
        return (metadata.creator, metadata.tags, metadata.usageFee);
    }
    
    function getTotalTokenIds() public view returns (uint256) {
        return _tokenIds;
    }
    
    function withdrawFunds() public {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");
        payable(owner()).transfer(balance);
    }
}
