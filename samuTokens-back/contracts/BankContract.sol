pragma solidity >= 0.4.22 < 0.6.0;
contract BankContract {
    struct ClientAccount {
        string propertaryName;
        address propetary;
        uint balance;
    }
    address owner;
    mapping (address => ClientAccount) clientAccounts;
    mapping (address => bool) clientAccountsExist;
    address[] clientAccountsAddress;

    modifier hasBalance(uint _samuTokens) {
        require(clientAccounts[msg.sender].balance >= _samuTokens);
        _;
    }

    constructor() public {
        createAccountBank("Owner");
        clientAccounts[msg.sender].balance = 100;
        owner = msg.sender;
    }

    function createAccountBank(string memory _name) public {
        require(!clientAccountsExist[msg.sender]);
        clientAccounts[msg.sender] = ClientAccount(_name, msg.sender, 0);
        clientAccountsExist[msg.sender] = true;
        clientAccountsAddress.push(msg.sender);
    }

    function getBalance() public view returns(uint) {
        require(clientAccountsExist[msg.sender]);
        return clientAccounts[msg.sender].balance;
    }

    function getAccountsAddress() public view returns(address[] memory) {
        return clientAccountsAddress;
    }

    function transferSamuTokens(address _to, uint _samuTokens) public hasBalance(_samuTokens) {
        clientAccounts[_to].balance += _samuTokens;
        clientAccounts[msg.sender].balance -= _samuTokens;
    }

    function isOwner() public view returns(bool) {
        bool result = false;
        if (owner == msg.sender) {
            result = true;
        }
        return result;
    }

    function mint(uint _samuTokens) public {
        require(msg.sender == owner);
        clientAccounts[msg.sender].balance += _samuTokens;
    }
}