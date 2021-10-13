const Transaction = artifacts.require('./Transaction.sol');
require('chai').use(require('chai-as-promised')).should();

contract('Transaction', ([addr, addr2]) => {
    let transaction;

    before(async () => {
        transaction = await Transaction.deployed();
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await transaction.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has a name', async () => {
            const name = await transaction.name();
            assert.equal(name, 'Send Ether App');
        })

    })

    describe('transactions', async () => {

        it('send eth and get it back to sender', async () => {
            let oldBalance = await web3.eth.getBalance(addr);
            let price = web3.utils.toWei('1', 'Ether');
            price = new web3.utils.BN(price);
            let result = await transaction.sendEtherAndGetItBack(addr, { from: addr, value: price });

            const event = result.logs[0].args;
            //Is sender of transaction correct
            assert.equal(event.sender, addr, 'sender is correct');
            // Is price of transaction correct
            assert.equal(event.price, '1000000000000000000', 'price is correct');

            let newBalance = await web3.eth.getBalance(addr);
            const tx = await web3.eth.getTransaction(result.tx);
            const gasPrice = tx.gasPrice;
            const gasUsed = result.receipt.gasUsed;
            const gasCost = gasUsed * gasPrice;
            // Is balance after operation same as before
            assert.equal(Number(newBalance) + (gasPrice * gasUsed), oldBalance);

            // FAILURE: Tries to send ether from one address to another
            await transaction.sendEtherAndGetItBack(addr, { from: addr2, to: addr, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
            // FAILURE: Tries to send ether from one address to another
            await transaction.sendEtherAndGetItBack(addr, { from: addr, value: web3.utils.toWei(newBalance + 1, 'Ether')}).should.be.rejected;
        });
    });
})