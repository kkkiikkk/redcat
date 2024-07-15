import { IsInt, Min, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionsQueryDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of transactions per page',
    required: false,
    enum: [5, 10, 20, 50],
  })
  @IsInt()
  @Min(1)
  @IsIn([5, 10, 20, 50])
  @IsOptional()
  readonly take?: number;
}
