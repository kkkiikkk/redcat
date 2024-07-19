// Core
// import { SwaggerCustomOptions } from '@nestjs/swagger';
export const BadrequestServerErrorResponseSchema = {
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      message: ['Validation error'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

export const UnauthorizedServerErrorResponseSchema = {
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: {
      message: 'Unauthorized',
      error: 'Unauthorized',
      statusCode: 401,
    },
  },
};

export const ForbiddenServerErrorResponseSchema = {
  status: 403,
  description: 'Forbidden',
  schema: {
    example: {
      message: 'Forbidden',
      error: 'Forbidden',
      statusCode: 403,
    },
  },
};

export const InternalServerErrorResponseSchema = {
  status: 500,
  description: 'Internal Server Error.',
  schema: {
    example: {
      message: 'Internal Server Error',
      error: 'Internal Server Error',
      statusCode: 500,
    },
  },
};
