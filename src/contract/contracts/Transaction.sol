// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Transaction {
    string public name;

    constructor() public {
        name = 'Send Ether App';
    }
    event SendAndGetBack(
        address payable sender,
        uint256 price
    );
   
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    function sendEtherAndGetItBack(address payable addr) public payable {
        require(getBalance() >= msg.value);
        require(addr == msg.sender);
        addr.transfer(msg.value);
        emit SendAndGetBack(addr, msg.value);
    }
}
