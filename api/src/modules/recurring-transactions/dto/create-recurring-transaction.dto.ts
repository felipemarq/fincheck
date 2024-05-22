// src/recurring-transactions/dto/create-recurring-transaction.dto.ts
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RecurrenceType } from '@prisma/client';

export class CreateRecurringTransactionDto {
  @IsString()
  userId: string;

  @IsString()
  bankAccountId: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endDate?: Date;

  @IsEnum(RecurrenceType)
  recurrence: RecurrenceType;
}
