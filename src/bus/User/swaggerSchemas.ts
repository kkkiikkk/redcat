export const GetAllUsersSuccessResponseSchema = {
  status: 200,
  description: 'List of all users',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string' },
        name: { type: 'string' },
      },
    },
  },
};

export const GetUserSuccessResponseSchema = {
  status: 200,
  description: 'Current user information',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string' },
      name: { type: 'string' },
      amount: { type: 'number' },
    },
  },
};

export const UserNotFoundErrorResponseSchema = {
  status: 404,
  description: 'User not found',
  schema: {
    example: {
      message: 'User not found',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

export const UserBlockSuccessResponseSchema = {
  status: 200,
  description: 'User blocked successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string' },
      name: { type: 'string' },
      amount: { type: 'number' },
      isBlocked: { type: 'boolean' },
    },
  },
};
