import BankContractJson from "../../../../samuTokens-back/build/contracts/BankContract.json";
import contractTruffle from "truffle-contract";
/**
 * Function for deployed contract and get instance
 * @param  {any} provider - provider for instance the contract
 */
async function getBankContractInstance (provider) {
    const contract = contractTruffle(BankContractJson);
    contract.setProvider(provider);
    let instance = await contract.deployed();
    return instance;
}

export {
    getBankContractInstance
}
