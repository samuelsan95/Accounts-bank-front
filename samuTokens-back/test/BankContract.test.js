const truffleAssert = require('truffle-assertions');
const BankContract = artifacts.require( 'BankContract' );

let instance;
beforeEach( async () => {
    instance = await BankContract.new();
});

contract( 'BankContract', accounts => {
    it('Should owner have balance', async () => {
        const ownerBalance = await instance.getBalance();
        assert( ownerBalance > 0 );
    });

    it('should create new account', async() => {
        const name = "Samuel";
        await instance.createAccountBank(name, {from: accounts[1], gas: '500000'})
    });

    it('should not allow create account with the same address', async() => {
        try {
            const name = "Samuel";
            await instance.createAccountBank(name, {from: accounts[0], gas: '500000'});
        } catch (e) {
            return;
        }

        assert(false, 'should not allow create account with the same address');
    });

    it('should get accounts address check length', async() => {
        const name = "Samuel";
        await instance.createAccountBank(name, {from: accounts[1], gas: '500000'});
        const accountsAddress = await instance.getAccountsAddress({from: accounts[0], gas: '500000'});
        assert(accountsAddress.length, 2);
    });

    it('should transfer samu tokens and correct balance', async () => {
        const name = "Samuel";
        const tokens = 10;
        const balanceAccount0 = await instance.getBalance({from: accounts[0], gas: '500000'});
           
        await instance.createAccountBank(name, {from: accounts[1], gas: '500000'});

        const balanceAccount1 = await instance.getBalance({from: accounts[1], gas: '500000'});

        await instance.transferSamuTokens(accounts[1], tokens, {from: accounts[0], gas: '500000'});

        const newBalanceAccount0 = await instance.getBalance({from: accounts[0], gas: '500000'});
        const newBalanceAccount1 = await instance.getBalance({from: accounts[1], gas: '500000'});

        assert(newBalanceAccount0.toNumber(), balanceAccount0.toNumber() - tokens);
        assert(newBalanceAccount1.toNumber(), balanceAccount1.toNumber() + tokens);
    });

    it('should not allow tranfer tokens if sender balance < tokens to send', async() => {
        try {
            const tokens = 10;
            const name = "Samuel";
            await instance.createAccountBank(name, {from: accounts[1], gas: '500000'});
            await instance.transferSamuTokens(accounts[0], tokens, {from: accounts[1], gas: '500000'});
        } catch (e) {
            return;
        }

        assert(false, 'should not allow tranfer tokens if sender balance < tokens to send');
    });

    it('should check event onTransferSamuTokens', async () => {
        const name = "Samuel";
        const tokens = 10;
        await instance.createAccountBank(name, {from: accounts[1], gas: '500000'});
        let result = await instance.transferSamuTokens(accounts[1], tokens, {from: accounts[0], gas: '500000'});
        truffleAssert.eventEmitted(result, 'onTransferSamuTokens', (ev) => {
            const { to, from, samuTokens } = ev;
            return to === accounts[1] && from === accounts[0] && samuTokens.toNumber() === tokens; 
        });
    });

    it('should is owner true', async() => {
        const isOwner = await instance.isOwner({from: accounts[0], gas: '500000'});
        assert(isOwner, true);
    });

    it('should is owner false', async() => {
        const isOwner = await instance.isOwner({from: accounts[1], gas: '500000'});
        assert(!isOwner);
    });

    it('should add tokens to the owner balance', async() => {
        const tokens = 100;
        const balanceInit = await instance.getBalance();
        await instance.mint(tokens);
        const balanceFinal = await instance.getBalance();
        assert(balanceFinal.toNumber(), balanceInit.toNumber() + tokens);
    });

    it('should not allow add tokens to the owner balance if sender is not owner', async() => {
        try {
            const tokens = 100;
            await instance.mint(tokens, {from: accounts[1], gas: '500000'});
        } catch (e) {
            return;
        }

        assert(false, 'should not allow add tokens to the owner balance if sender is not owner');
    });
});