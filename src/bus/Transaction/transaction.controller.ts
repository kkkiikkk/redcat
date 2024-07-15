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
import { TranscationService } from './transaction.service';

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
  TRANSACTION_DEFAULT_GROUP,
  TRANSCATION_DETAIL_GROUP,
} from './transaction.entity';

@ApiTags('transactions')
@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
export class TranscationController {
  constructor(private readonly transcationService: TranscationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    enum: [5, 10, 20, 50],
  })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          transactionType: {
            type: 'string',
            enum: ['deposit', 'withdraw', 'transfer'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: ['Invalid query parameters'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'Forbidden',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  @SerializeOptions({ groups: [TRANSACTION_DEFAULT_GROUP] })
  async getAll(@Query() query: GetTransactionsQueryDto) {
    return this.transcationService.findAll(query);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Create a deposit transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        amount: { type: 'number' },
        fromUser: { type: 'string' },
        toUser: { type: 'string' },
        transactionType: {
          type: 'string',
          enum: ['deposit', 'withdraw', 'transfer'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: ['Validation error'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
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
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        amount: { type: 'number' },
        fromUser: { type: 'string' },
        toUser: { type: 'string' },
        transactionType: {
          type: 'string',
          enum: ['deposit', 'withdraw', 'transfer'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: ['Validation error'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
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
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        amount: { type: 'number' },
        fromUser: { type: 'string' },
        toUser: { type: 'string' },
        transactionType: {
          type: 'string',
          enum: ['deposit', 'withdraw', 'transfer'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: ['Validation error'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @UseGuards(AccessGuard)
  async createTransferTransaction(
    @Body() payload: CreateTransferTransactionDto,
    @CurrentUser() userId: string,
  ) {
    return this.transcationService.transfer(payload, userId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get owned transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of owned transactions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          transactionType: {
            type: 'string',
            enum: ['deposit', 'withdraw', 'transfer'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @UseGuards(AccessGuard)
  @SerializeOptions({ groups: [TRANSACTION_DEFAULT_GROUP] })
  ownedTransactions(@CurrentUser() userId: string) {
    return this.transcationService.findById(userId);
  }

  @Get('/my/:id')
  @ApiOperation({ summary: 'Get owned transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Owned transaction information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        amount: { type: 'number' },
        fromUser: { type: 'string' },
        toUser: { type: 'string' },
        transactionType: {
          type: 'string',
          enum: ['deposit', 'withdraw', 'transfer'],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    schema: {
      example: {
        message: 'Transaction not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Transaction information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        amount: { type: 'number' },
        fromUser: { type: 'string' },
        toUser: { type: 'string' },
        transactionType: {
          type: 'string',
          enum: ['deposit', 'withdraw', 'transfer'],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'Forbidden',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    schema: {
      example: {
        message: 'Transaction not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Transaction cancelled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'Forbidden',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    schema: {
      example: {
        message: 'Transaction not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  async cancelTransaction(@Param('id') transactionId: string) {
    return this.transcationService.cancelTransaction(transactionId);
  }

  @Post('/my/:id/cancel')
  @ApiOperation({ summary: 'Cancel owned transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction cancelled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    schema: {
      example: {
        message: 'Transaction not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @UseGuards(AccessGuard)
  async cancelMyTransaction(
    @Param('id') transactionId: string,
    @CurrentUser() userId: string,
  ) {
    return this.transcationService.cancelTransaction(transactionId, userId);
  }
}
