/** Angular core */
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

/** Services */
import { ToastrService } from 'ngx-toastr';
import { EthcontractService } from './services/ethcontract.service';
import { BankService } from './services/bank.service';
import { getBankContractInstance } from './contracts/BankContract.js';

/** Components */
import { CreateModalComponent } from './components/modals/create-modal/create-modal.component';
import { TransferFormComponent } from './components/transfer-form/transfer-form.component';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('transferForm') transferForm: TransferFormComponent;
  isShowFormNewAccount: boolean;
  nameNewAccount: string;
  web3: any;
  BankInstance: any;
  bankService: any;
  transferFrom: string;
  accounts = [];
  isNotExistAccount: boolean;

  constructor(private ethcontractService: EthcontractService,
              private toastr: ToastrService,
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

      // reload page when change account
      window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
        window.location.reload();
      });

      // get balance and show notification when watch transfer samu tokens
      this.BankInstance.onTransferSamuTokens({}, async (error: any, event: any) => {
        const { to, from, samuTokens } = event.args;
        if (!error) {
          if ( this.transferFrom === to) {
            await this.transferForm.getBalanceByAddress();
            this.showNotificationOfReceivedTransfer(from, Number(samuTokens));
          } else {
            console.log(`${samuTokens} samuTokens enviados a ${to}`);
          }
        }
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

/**
 * Function for show notification when received a transfer
 * @param from - Account that sent transfer
 * @param samuTokens - coin of the contract
 */
  showNotificationOfReceivedTransfer(from: string, samuTokens: number): any {
    console.log('Notifications sent ', from, samuTokens);
    this.toastr.success(`${from} has sent you ${samuTokens} samuTokens`, 'Received Transfer', {
      timeOut: 20000
    });
  }
}
