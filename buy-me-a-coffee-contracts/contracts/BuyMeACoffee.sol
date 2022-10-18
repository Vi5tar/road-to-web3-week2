// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deployed to goerli at 0xf16913f04F66b0710382290fE5661c4021121065 (unable to change owner)

// Deployed to goerli at 0x6BC697ba5768b497C194023156485e7688acae74 (able to change owner)

contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Array of Memos
    Memo[] memos;

    // Address of the owner of the contract.
    address payable owner;

    // Constructor
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Buy a coffee and leave a message for the contract owner.
     * @param _name Name of coffee buyer.
     * @param _message Message from the coffee buyer.
     */
    function buyCoffee(string memory _name, string memory _message ) public payable {
        require(msg.value > 0, "I can't buy coffee with 0 ETH");

        // Create a new Memo and add it to the array of Memos.
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a NewMemo event.
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev Get the Memos stored on the blockchain.
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev Send the ETH stored in this contract to the contract owner.
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev Change the owner of the contract
     */
    function changeOwner(address newOwner) public {
        require(msg.sender == owner, "Only the owner can change the owner");
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = payable(newOwner);
    }
}
