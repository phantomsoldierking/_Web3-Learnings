// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {
    mapping(address => uint256) private balances;

    // Define an event
    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    // Deposit Ether into the bank
    function deposit() external payable {
        require(msg.value > 0, "Must send Ether");
        balances[msg.sender] += msg.value;

        // Emit Deposit event
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw Ether from the bank
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        // Transfer Ether to user
        payable(msg.sender).transfer(amount);

        // Emit Withdraw event
        emit Withdraw(msg.sender, amount);
    }

    // Check account balance
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
