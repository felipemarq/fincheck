import { Injectable } from '@nestjs/common';
import { CreateInstallmentPurchaseDto } from '../dto/create-installment-purchase.dto';
import { UpdateInstallmentPurchaseDto } from '../dto/update-installment-purchase.dto';
import { InstallmentsPurchasesRepository } from 'src/shared/database/repositories/installment-purchases.repositories';
import { InstallmentsRepository } from 'src/shared/database/repositories/installments.repositories';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateInstallmentPurchaseOwnershipService } from './validate-installment-purchase-ownership.service';
import { ValidateBankAccountOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnershipService } from 'src/modules/transactions/services/validate-transaction-ownership.service';

@Injectable()
export class InstallmentPurchasesService {
  constructor(
    private readonly installmentPurchasesRepo: InstallmentsPurchasesRepository,
    private readonly installmentsRepo: InstallmentsRepository,
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateInstallmentOwnership: ValidateInstallmentPurchaseOwnershipService,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
    private readonly validateInstallmentPurchaseOwnershipService: ValidateInstallmentPurchaseOwnershipService,
  ) {}

  async create(
    userId: string,
    createInstallmentPurchaseDto: CreateInstallmentPurchaseDto,
  ) {
    const {
      bankAccountId,
      categoryId,
      name,
      numberOfInstallments,
      startDate,
      totalValue,
      type,
    } = createInstallmentPurchaseDto;

    await this.validateEntitiesOwnership({ userId, bankAccountId, categoryId });
    const installmentValue = totalValue / numberOfInstallments;

    const installmentPurchase = await this.installmentPurchasesRepo.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        name,
        totalValue,
        numberOfInstallments,
        startDate,
        type,
      },
    });

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const transaction = await this.transactionsRepo.create({
        data: {
          userId: userId,
          bankAccountId: bankAccountId,
          installmentPurchaseId: installmentPurchase.id,
          categoryId,
          name: `${name} - Parcela ${i + 1}`,
          value: installmentValue,
          date: dueDate,
          type: type,
          isPaid: false,
        },
      });

      await this.installmentsRepo.create({
        data: {
          transactionId: transaction.id,
          installmentPurchaseId: installmentPurchase.id,
          value: installmentValue,
          dueDate: dueDate,
          paid: false,
        },
      });
    }

    return installmentPurchase;
  }

  findAll() {
    return `This action returns all installmentPurchases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} installmentPurchase`;
  }

  async update(
    userId: string,
    installmentPurchaseId: string,
    updateInstallmentPurchaseDto: UpdateInstallmentPurchaseDto,
  ) {
    const {
      bankAccountId,
      categoryId,
      name,
      numberOfInstallments,
      startDate,
      totalValue,
      type,
    } = updateInstallmentPurchaseDto;
    await this.validateEntitiesOwnership({
      userId,
      installmentPurchaseId,
      bankAccountId,
      categoryId,
    });

    const updatedInstallmentPurchase =
      await this.installmentPurchasesRepo.update({
        data: {
          userId,
          bankAccountId,
          categoryId,
          name,
          totalValue,
          numberOfInstallments,
          startDate,
          type,
        },
        where: { id: installmentPurchaseId },
      });

    await this.installmentsRepo.deleteMany({
      where: { installmentPurchaseId: installmentPurchaseId },
    });

    await this.transactionsRepo.deleteMany({
      where: { installmentPurchaseId: installmentPurchaseId },
    });

    const installmentValue = totalValue / numberOfInstallments;

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const updatedTransaction = await this.transactionsRepo.create({
        data: {
          userId: userId,
          bankAccountId: bankAccountId,
          installmentPurchaseId: updatedInstallmentPurchase.id,
          categoryId,
          name: `${name} - Parcela ${i + 1}`,
          value: installmentValue,
          date: dueDate,
          type: type,
          isPaid: false,
        },
      });

      await this.installmentsRepo.create({
        data: {
          transactionId: updatedTransaction.id,
          installmentPurchaseId: updatedInstallmentPurchase.id,
          value: installmentValue,
          dueDate: dueDate,
          paid: false,
        },
      });
    }
    return updatedInstallmentPurchase;
  }

  remove(id: number) {
    return `This action removes a #${id} installmentPurchase`;
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
    installmentPurchaseId,
  }: {
    userId: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
    installmentPurchaseId?: string;
  }) {
    await Promise.all([
      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
      bankAccountId &&
        this.validateBankAccountOwnershipService.validate(
          userId,
          bankAccountId,
        ),
      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),
      installmentPurchaseId &&
        this.validateInstallmentPurchaseOwnershipService.validate(
          userId,
          installmentPurchaseId,
        ),
    ]);
  }
}