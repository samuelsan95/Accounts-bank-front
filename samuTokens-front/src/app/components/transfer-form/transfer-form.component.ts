/** Angular */
import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/** Components */
import { CreateModalComponent } from './../modals/create-modal/create-modal.component';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.css']
})
export class TransferFormComponent implements OnInit {

  @Input() accounts: Array<string>;
  @Input() transferFrom: string;
  @Input() bankService: any;
  @Output() isErrorGetBalance: EventEmitter<any> = new EventEmitter();
  web3: any;
  balance = 0;
  transferTo = '';
  amount = 0;
  isOwner: boolean;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.initAndDisplayAccount();
  }

  /**
   * Function for init component and display account
   * 1 - Get balance by address
   * 2 - Check if address is owner
   * 3 - Alerts you if this account exists
   */
  async initAndDisplayAccount() {
    try {
      await this.getBalanceByAddress();
      await this.checkIsOwner();
      this.isErrorGetBalance.emit(false);
    } catch (err) {
      this.isErrorGetBalance.emit(true);
    }
  }

  /**
   * Function calling the bank service to transfer samutokens to another account
   */
  async transferSamuTokens() {
    try {
      await this.bankService.transferSamuTokens(this.transferTo, this.amount);
      this.getBalanceByAddress();
      this.resetForm();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Funtcion that call the bank service to get balance by address
   */
  async getBalanceByAddress() {
    this.balance = await this.bankService.getBalanceByAddress(this.transferFrom);
  }

  /**
   * Function that call the bank service to increase balance of the owner
   * @param samuTokens - coin of bank contract
   */
  async increaseBalance(samuTokens: number) {
    try {
      await this.bankService.increaseBalance(samuTokens);
      this.getBalanceByAddress();
      this.resetForm();
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Function that call the bank service to check if the addres is owner
   */
  async checkIsOwner() {
    this.isOwner = await this.bankService.isOwner();
    console.log('Is owner ', this.isOwner);
  }

  /**
   * Function for reset the form
   * @returns void
   */
  resetForm(): void {
    this.transferTo = '';
    this.amount = 0;
  }

  /**
   * Function for open dialog, for increase balance of the owner
   * @returns void
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      width: '250px',
      data: {
        result: 0,
        title: 'Increase Balance',
        question: 'How many samuTokens you want to add?',
        type: 'number'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== 'cancel') {
        await this.increaseBalance(result);
        this.getBalanceByAddress();
      }
    });
  }
}
