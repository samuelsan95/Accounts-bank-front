import { Injectable, Inject, Optional } from '@angular/core';
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class BankService {
  web3: any;
  addressFrom: string;

  constructor(@Inject('contract') @Optional() private contract: any ) {
    this.contract = contract;
    this.web3 = new Web3(window.web3.currentProvider);
  }

  /**
   * Function that call the contract for get if the address is owner
   * @returns Promise<boolean>
   */
  async isOwner(): Promise<boolean> {
    const addressFrom = (await this.web3.eth.getAccounts())[0];
    return await this.contract.isOwner({from: addressFrom});
  }

  /**
   *  Function that call the contract for get all account address
   * @returns Promise<string>
   */
  async getAccountsAddress(): Promise<Array<string>> {
    return await this.contract.getAccountsAddress();
  }

  /**
   * Function that call the contract for get balance by address
   * @returns Promise<number>
   */
  async getBalanceByAddress(): Promise<number> {
    const addressFrom = (await this.web3.eth.getAccounts())[0];
    return (await this.contract.getBalance({from: addressFrom})).toNumber();
  }

  /**
   * Function that call the contract for create new account
   * @param name - name of the new account
   * @returns Promise
   */
  async createAccount(name: string): Promise<any> {
    const addressFrom = (await this.web3.eth.getAccounts())[0];
    return await this.contract.createAccountBank(name, {from: addressFrom});
  }

  /**
   * @param to - addres of the account to send samuTokens
   * @param samuTokens - coin of the contract
   * @returns Promise
   */
  async transferSamuTokens(to: string, samuTokens: number): Promise<any> {
    const addressFrom = (await this.web3.eth.getAccounts())[0];
    return await this.contract.transferSamuTokens(to, samuTokens, {from: addressFrom});
  }

  /**
   * @param samuTokens - coin of the contract
   * @returns Promise
   */
  async increaseBalance(samuTokens: number): Promise<any> {
    const addressFrom = (await this.web3.eth.getAccounts())[0];
    return await this.contract.mint(samuTokens, {from: addressFrom});
  }
}
