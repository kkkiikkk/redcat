import { OmitType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferTransactionDto {
  @ApiProperty({ example: 100, description: 'Amount to transfer' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @ApiProperty({
    example: 'recipient_user_id',
    description: 'Recipient user ID',
  })
  @IsString()
  @IsNotEmpty()
  toUser: string;
}

export class CreateTransactionDto extends OmitType(
  CreateTransferTransactionDto,
  ['toUser'],
) {
  @ApiProperty({ example: 100, description: 'Amount for the transaction' })
  amount: number;
}
