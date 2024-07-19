export const RegisterSuccessResponseSchema = {
  status: 201,
  description: 'The user has been successfully created.',
  schema: {
    example: {
      email: 'johnmail@test.com',
      password: '$2b$10$wzVz0pc3dV2qqt.niednxuylsASkAEESJzSK2aJ47dgyuI3fuWgT2',
      name: 'John',
      amount: 0,
      id: 'f2a96240-b045-43ba-96a4-3d2f60b59aa5',
      role: 'client',
      isBlocked: false,
    },
  },
};

export const RegisterInvalidPayloadErrorResponseSchema = {
  status: 400,
  description: 'Bad Request.',
  schema: {
    example: {
      message: ['email must be an email'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};

export const ConflictUserErrorResponseSchema = {
  status: 409,
  description: 'Conflict. User with such email already exists.',
  schema: {
    example: {
      message: 'User with such email already exists',
      error: 'Conflict',
      statusCode: 409,
    },
  },
};

export const LoginSuccessResponseSchema = {
  status: 200,
  description: 'User successfully logged in.',
  schema: {
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    },
  },
};

export const LoginUserNotFoundErrorResponseSchema = {
  status: 404,
  description: 'Not Found. User with such email does not exist.',
  schema: {
    example: {
      message: 'User with such email does not exist',
      error: 'Not Found',
      statusCode: 404,
    },
  },
};

export const LoginBlockedUserErrorResponseSchema = {
  status: 403,
  description: 'Forbidden. User is blocked.',
  schema: {
    example: {
      message: 'User is blocked',
      error: 'Forbidden',
      statusCode: 403,
    },
  },
};

export const RefreshTokenSuccessResponseSchema = {
  status: 200,
  description: 'Tokens successfully refreshed.',
  schema: {
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    },
  },
};

export const LogoutSucccessResponseSchema = {
  status: 200,
  description: 'User successfully logged out.',
  schema: {
    example: { logout: true },
  },
};
