/** Angular core */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

/** Services */
import { EthcontractService } from './services/ethcontract.service';
import { BankService } from './services/bank.service';
import { getBankContractInstance } from './contracts/BankContract.js';

/** Components */
import { CreateModalComponent } from './components/modals/create-modal/create-modal.component';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isShowFormNewAccount: boolean;
  nameNewAccount: string;
  web3: any;
  BankInstance: any;
  bankService: any;
  transferFrom: string;
  accounts = [];
  isNotExistAccount: boolean;

  constructor(private ethcontractService: EthcontractService,
              public dialog: MatDialog) {
    this.init();
  }

  /**
   * Function for init app.
   *  1 - Inis contract
   *  2 - event on change accounts metamask
   *  3 - get accounts
   */
  async init() {
    try {
      this.web3 = await this.ethcontractService.getWeb3();
      this.BankInstance = await getBankContractInstance(this.web3.currentProvider);

      window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
        window.location.reload();
      });
      console.log(this.BankInstance);

      this.BankInstance.onTransferSamuTokens({}, (error, event) => {
        console.log(event);
      });

      const accountsWeb3 = await this.web3.eth.getAccounts();
      this.transferFrom = accountsWeb3[0];
      this.bankService = new BankService(this.BankInstance);
      this.getAccounts();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Function for create new account in the contract
   */
  async createNewAccount() {
    try {
      await this.bankService.createAccount(this.nameNewAccount);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Function for get all accounts of the contract
   */
  async getAccounts() {
    try {
      const accountsAll = await this.bankService.getAccountsAddress();
      this.accounts = accountsAll.filter((account: string) => account !== this.transferFrom);
    } catch (err) {
      console.log('err', err);
    }
  }

  /**
   * Function for open dialog, for create a new account
   * @returns void
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      width: '250px',
      data: {
        result: this.nameNewAccount,
        title: 'Creation of new account',
        question: 'Who is the new account holder?',
        type: 'text'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== 'cancel') {
        this.nameNewAccount = result;
        await this.createNewAccount();
        this.isNotExistAccount = false;
        this.getAccounts();
      }
    });
  }

  /**
   * Check if exist account or no.
   * @param event - says whether or not the account exists
   * @returns void
   */
  checkExistAccount(event: boolean): void {
    this.isNotExistAccount = event;
  }
}
