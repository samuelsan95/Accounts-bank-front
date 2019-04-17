import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthcontractService {
  /**
   * Function for get a new object web3
   * @param provider? - provider for create new web3
   * @returns Promise
   */
  getWeb3(provider?: string): Promise<object> {
    return new Promise((resolve, reject) => {
      window.addEventListener('load', async () => {
        let web3: any;
        if (typeof window.web3 !== 'undefined') {
          if (provider) {
            web3 = new Web3(provider);
          } else {
            web3 = new Web3(window.web3.currentProvider);
          }
          await window.ethereum.enable();
          resolve(web3);
        } else {
          console.error('No provider found, please install metamask');
          reject();
        }
      });
    });
  }
}
