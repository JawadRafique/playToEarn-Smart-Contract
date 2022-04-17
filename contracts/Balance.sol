//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Balance is Ownable {
    // To override openzepplin renounceOwnership function
    function renounceOwnership() public view override onlyOwner {
        revert("can't renounce ownership"); //not possible with this smart contract
    }

    event BalanceChanged(address indexed _forWho, address indexed _byWhom, uint _oldAmount, uint _newAmount);

    function isOwner() internal view returns(bool) {
        return owner() == msg.sender;
    }

    mapping(address => uint) public balance;

    function setBalance(address _who, uint _amount) public onlyOwner {
        emit BalanceChanged(_who, msg.sender, balance[_who], (balance[_who] + _amount));
        balance[_who] += _amount;
    }

    modifier ownerOrAllowed(uint _amount) {
        require(isOwner() || balance[msg.sender] >= _amount, "You are not allowed!");
        _;
    }

    function reduceBalance(address _who, uint _amount) internal ownerOrAllowed(_amount) {
        emit BalanceChanged(_who, msg.sender, balance[_who], balance[_who] - _amount);
        balance[_who] -= _amount;
    }

}