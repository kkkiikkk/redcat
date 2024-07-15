import {
  Controller,
  Post,
  Body,
  ConflictException,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Res,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

// Services
import { UserService } from '../User/user.service';
import { AuthService } from './auth.service';

// Dtos
import { UserRegisterDto } from './dtos/userRegister.dto';
import { UserLoginDto } from './dtos/userLogin.dto';

// Entities
import { User, USER_DEFAULT_GROUP } from '../User/user.entity';

// Instruments
import { ITokens } from './auth.interfaces';
import { AccessGuard } from './guards/access.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { CurrentUser } from './decorators/currentUser.decorator';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        email: 'johnmail@test.com',
        password:
          '$2b$10$wzVz0pc3dV2qqt.niednxuylsASkAEESJzSK2aJ47dgyuI3fuWgT2',
        name: 'John',
        amount: 0,
        id: 'f2a96240-b045-43ba-96a4-3d2f60b59aa5',
        role: 'client',
        isBlocked: false,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    schema: {
      example: {
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. User with such email already exists.',
    schema: {
      example: {
        message: 'User with such email already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @ApiBody({ type: UserRegisterDto })
  @SerializeOptions({
    groups: [USER_DEFAULT_GROUP],
    excludeExtraneousValues: true,
  })
  async register(@Body() payload: UserRegisterDto): Promise<User> {
    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      throw new ConflictException('User with such email already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    return this.userService.createOne({ ...payload, password: hashedPassword });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. User with such email does not exist.',
    schema: {
      example: {
        message: 'User with such email does not exist',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User is blocked.',
    schema: {
      example: {
        message: 'User is blocked',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @ApiBody({ type: UserLoginDto })
  async login(
    @Body() payload: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ITokens> {
    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('User with such email does not exist');
    }

    if (user.isBlocked) {
      throw new ForbiddenException('User is blocked');
    }
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      { userId: user.id },
    );

    this.authService.setAccessTokenToCookies(res, accessToken);
    this.authService.setRefreshTokenToCookies(res, refreshToken);
    return { accessToken, refreshToken };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh user tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid refresh token.',
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
    description: 'Internal Server Error.',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @UseGuards(RefreshGuard)
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() userId: string,
  ) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      { userId },
    );
    this.authService.setAccessTokenToCookies(res, accessToken);
    this.authService.setRefreshTokenToCookies(res, refreshToken);
    return { accessToken, refreshToken };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out.',
    schema: {
      example: { logout: true },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid access token.',
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
    description: 'Internal Server Error.',
    schema: {
      example: {
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @UseGuards(AccessGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.setAccessTokenToCookies(res, '');
    this.authService.setRefreshTokenToCookies(res, '');

    return { logout: true };
  }
}
