import { Module } from '@nestjs/common';
import { InstallmentPurchasesService } from './services/installment-purchases.service';
import { InstallmentPurchasesController } from './installment-purchases.controller';
import { ValidateInstallmentPurchaseOwnershipService } from './services/validate-installment-purchase-ownership.service';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [BankAccountsModule, CategoriesModule, TransactionsModule],
  controllers: [InstallmentPurchasesController],
  providers: [
    InstallmentPurchasesService,
    ValidateInstallmentPurchaseOwnershipService,
  ],
})
export class InstallmentPurchasesModule {}