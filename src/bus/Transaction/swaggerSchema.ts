export const GetAllTransactionsSuccessResponseSchema = {
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
};

export const InvalidQueryPayloadErrorResponseSchema = {
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      message: ['Invalid query parameters'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

export const CreateTransactionSuccessResponseSchema = {
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
};

export const OwnedTransactionsSuccessResponseSchema = {
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
};

export const GetTransactionSuccessResponseSchema = {
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
};

export const NotFoundTransactionErrorResponseSchema = {
  status: 404,
  description: 'Transaction not found',
  schema: {
    example: {
      message: 'Transaction not found',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

export const CancelTransactionsSuccessResponseSchema = {
  status: 200,
  description: 'Transaction cancelled successfully',
};
