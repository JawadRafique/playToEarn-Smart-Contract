const { expect } = require("chai");

describe("J Game Contract", function () {
    let JGame;
    let contract;
    let contractAddress;
    let owner;
    let player1;
    let players;

    beforeEach(async function () {
        JGame = await ethers.getContractFactory("JGame"); // creating instance of contract
        [owner, player1, ...players] = await ethers.getSigners();
        contract = await JGame.deploy();
        contractAddress = contract.address;
    });

    it("deployement should assign owner to deployer address", async function () {
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("should have a consistent account balance", async function () {
        expect(await contract.getContractBalance()).to.equal(0);
    });

    it("transfering 5Eth from owner to contract", async function () {
        // Tranfering 5 Eth
        await owner.sendTransaction({
            to: contractAddress,
            value: ethers.utils.parseEther("5.0"), // Sends exactly 1.0 ether
        });
        const currentBalance = ethers.utils.parseEther("5.0");
        expect(await contract.getContractBalance()).to.equal(currentBalance);
    });

    it("allowing player1 to withdraw 0.02eth", async function () {
        // Tranfering 5 Eth to contract
        await owner.sendTransaction({
            to: contractAddress,
            value: ethers.utils.parseEther("5.0"), // Sends exactly 1.0 ether
        });

        // Allowing player1 to withdraw 0.02 eth
        const ethToTransfer = ethers.utils.parseEther("0.2");
        await contract.setBalance(player1.address, ethToTransfer);

        expect(await contract.balance(player1.address)).to.equal(ethToTransfer);
    });

    it("allowing player1 to withdraw 0.04eth (0.02eth + 0.02eth)", async function () {
        // Tranfering 5 Eth to contract
        await owner.sendTransaction({
            to: contractAddress,
            value: ethers.utils.parseEther("5.0"), // Sends exactly 1.0 ether
        });

        // Allowing player1 to withdraw 0.02 eth
        const ethToTransfer = ethers.utils.parseEther("0.02");
        await contract.setBalance(player1.address, ethToTransfer);
        expect(await contract.balance(player1.address)).to.equal(ethToTransfer);

        // Allowing player1 to withdraw 0.02 eth again
        const totalEthTransfer = ethers.utils.parseEther("0.04");
        await contract.setBalance(player1.address, ethToTransfer);
        expect(await contract.balance(player1.address)).to.equal(
            totalEthTransfer
        );
    });

    it("player1 withdraw 0.02eth", async function () {
        // Tranfering 5 Eth to contract
        await owner.sendTransaction({
            to: contractAddress,
            value: ethers.utils.parseEther("5.0"), // Sends exactly 1.0 ether
        });

        // Allowing player1 to withdraw 0.02 eth
        const ethToTransfer = ethers.utils.parseEther("0.02");
        await contract.setBalance(player1.address, ethToTransfer);

        // Withdraw
        const toWithDraw = ethers.utils.parseEther("0.02");
        await contract.connect(player1).withdrawMoney(toWithDraw);

        // After withdraw balance to 0
        expect(await contract.balance(player1.address)).to.equal(0);

        // After withdraw contract balance to 4.8
        const contractCurrentBalance = ethers.utils.parseEther("4.98");
        expect(await contract.getContractBalance()).to.equal(
            contractCurrentBalance
        );

        // Trying to withdraw twice
        await expect(
            contract.connect(player1).withdrawMoney(toWithDraw)
        ).to.be.revertedWith("You are not allowed!");
    });
});
