//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Balance.sol";

contract JGame is Balance {

    event MoneySent(address indexed _beneficiary, uint _amount);
    event MoneyReceived(address indexed _from, uint _amount);

    function withdrawMoney(uint _amount) public ownerOrAllowed(_amount)  {
        require(_amount <= address(this).balance, "Contract doesn't own enough money");
        if(!isOwner()){
            reduceBalance(msg.sender,_amount);
        } 
        emit MoneySent(msg.sender, _amount);
        payable (msg.sender).transfer(_amount);
    }

    function getContractBalance() view public returns(uint256) {
        return address(this).balance;
    }

    receive() external  payable {
        emit MoneyReceived(msg.sender, msg.value);
    }
}   