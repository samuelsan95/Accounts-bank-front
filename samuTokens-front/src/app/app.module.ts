/** Modules */
import { MaterialModule } from './modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/** Services */
import { EthcontractService } from './services/ethcontract.service';
import { BankService } from './services/bank.service';

/** Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { TransferFormComponent } from './components/transfer-form/transfer-form.component';
import { CreateModalComponent } from './components/modals/create-modal/create-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TransferFormComponent,
    CreateModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [
    CreateModalComponent,
  ],
  providers: [
    EthcontractService,
    BankService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
