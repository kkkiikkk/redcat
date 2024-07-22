import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

// Services
import { TransactionService } from './transaction.service';

// Dtos
import {
  CreateTransactionDto,
  CreateTransferTransactionDto,
} from './dtos/createTransaction.dto';
import { GetTransactionsQueryDto } from './dtos/getTransactionsQuery.dto';

// Instruments
import { Roles } from '../User/user.entity';
import { AccessGuard } from '../Auth/guards/access.guard';
import { RoleGuard } from '../Auth/guards/role.guard';
import { Roles as RolesDecorator } from '../Auth/decorators/roles.decorator';
import { CurrentUser } from '../Auth/decorators/currentUser.decorator';
import {
  InternalServerErrorResponseSchema,
  UnauthorizedServerErrorResponseSchema,
  ForbiddenServerErrorResponseSchema,
  BadrequestServerErrorResponseSchema,
} from '../../utils/swaggerSchemas';
import {
  GetAllTransactionsSuccessResponseSchema,
  InvalidQueryPayloadErrorResponseSchema,
  CreateTransactionSuccessResponseSchema,
  OwnedTransactionsSuccessResponseSchema,
  GetTransactionSuccessResponseSchema,
  NotFoundTransactionErrorResponseSchema,
  CancelTransactionsSuccessResponseSchema,
} from './swaggerSchema';
import {
  TRANSACTION_DEFAULT_GROUP,
  TRANSCATION_DETAIL_GROUP,
} from './transaction.entity';

@ApiTags('transactions')
@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
export class TranscationController {
  constructor(private readonly transcationService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    enum: [5, 10, 20, 50],
  })
  @ApiResponse(GetAllTransactionsSuccessResponseSchema)
  @ApiResponse(InvalidQueryPayloadErrorResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(ForbiddenServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  @SerializeOptions({ groups: [TRANSACTION_DEFAULT_GROUP] })
  async getAll(@Query() query: GetTransactionsQueryDto) {
    return this.transcationService.findAll(query);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Create a deposit transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse(CreateTransactionSuccessResponseSchema)
  @ApiResponse(BadrequestServerErrorResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  async createDepositTransactions(
    @Body() payload: CreateTransactionDto,
    @CurrentUser() userId: string,
  ) {
    return this.transcationService.deposit(payload, userId);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Create a withdrawal transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse(CreateTransactionSuccessResponseSchema)
  @ApiResponse(BadrequestServerErrorResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  async createWithdrawTransactions(
    @Body() payload: CreateTransactionDto,
    @CurrentUser() userId: string,
  ) {
    return this.transcationService.withdraw(payload, userId);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Create a transfer transaction' })
  @ApiBody({ type: CreateTransferTransactionDto })
  @ApiResponse(CreateTransactionSuccessResponseSchema)
  @ApiResponse(BadrequestServerErrorResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  async createTransferTransaction(
    @Body() payload: CreateTransferTransactionDto,
    @CurrentUser() userId: string,
  ) {
    return this.transcationService.transfer(payload, userId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get owned transactions' })
  @ApiResponse(OwnedTransactionsSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  @SerializeOptions({ groups: [TRANSACTION_DEFAULT_GROUP] })
  ownedTransactions(@CurrentUser() userId: string) {
    return this.transcationService.findById(userId);
  }

  @Get('/my/:id')
  @ApiOperation({ summary: 'Get owned transaction by ID' })
  @ApiResponse(GetTransactionSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(NotFoundTransactionErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  @SerializeOptions({
    groups: [TRANSACTION_DEFAULT_GROUP, TRANSCATION_DETAIL_GROUP],
  })
  async ownedTransaction(
    @CurrentUser() userId: string,
    @Param('id') transactionId: string,
  ) {
    return this.transcationService.findUserTransactionById(
      transactionId,
      userId,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse(GetTransactionSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(ForbiddenServerErrorResponseSchema)
  @ApiResponse(NotFoundTransactionErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  @SerializeOptions({
    groups: [TRANSACTION_DEFAULT_GROUP, TRANSCATION_DETAIL_GROUP],
  })
  async getTransaction(@Param('id') transactionId: string) {
    return this.transcationService.findById(transactionId);
  }

  @Post('/:id/cancel')
  @ApiOperation({ summary: 'Cancel transaction by ID' })
  @ApiResponse(CancelTransactionsSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(ForbiddenServerErrorResponseSchema)
  @ApiResponse(NotFoundTransactionErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  async cancelTransaction(@Param('id') transactionId: string) {
    return this.transcationService.cancelTransaction(transactionId);
  }

  @Post('/my/:id/cancel')
  @ApiOperation({ summary: 'Cancel owned transaction by ID' })
  @ApiResponse(CancelTransactionsSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(NotFoundTransactionErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @UseGuards(AccessGuard)
  async cancelMyTransaction(
    @Param('id') transactionId: string,
    @CurrentUser() userId: string,
  ) {
    return this.transcationService.cancelTransaction(transactionId, userId);
  }
}
