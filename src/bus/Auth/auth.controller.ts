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
import {
  InternalServerErrorResponseSchema,
  UnauthorizedServerErrorResponseSchema,
} from '../../utils/swaggerSchemas';
import {
  RegisterSuccessResponseSchema,
  RegisterInvalidPayloadErrorResponseSchema,
  ConflictUserErrorResponseSchema,
  LoginSuccessResponseSchema,
  LoginUserNotFoundErrorResponseSchema,
  LoginBlockedUserErrorResponseSchema,
  RefreshTokenSuccessResponseSchema,
  LogoutSucccessResponseSchema,
} from './swaggerSchemas';

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
  @ApiResponse(RegisterSuccessResponseSchema)
  @ApiResponse(RegisterInvalidPayloadErrorResponseSchema)
  @ApiResponse(ConflictUserErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
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
  @ApiResponse(LoginSuccessResponseSchema)
  @ApiResponse(LoginUserNotFoundErrorResponseSchema)
  @ApiResponse(LoginBlockedUserErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
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
  @ApiResponse(RefreshTokenSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
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
  @ApiResponse(LogoutSucccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.setAccessTokenToCookies(res, '');
    this.authService.setRefreshTokenToCookies(res, '');

    return { logout: true };
  }
}
