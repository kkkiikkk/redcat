// Core
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

// Instruments
import { ENV } from '../../utils/env';
import { IJwtPayload, ITokens, IJwtPayloadRefresh } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async generateTokens(payload: IJwtPayload): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.configService.get(ENV[ENV.ACCESS_SECRET]),
        expiresIn: this.configService.get(ENV[ENV.JWT_ACCESS_EXPIRE_TIME]),
      }),
      this.jwt.signAsync(payload, {
        secret: this.configService.get(ENV[ENV.REFRESH_SECRET]),
        expiresIn: this.configService.get(ENV[ENV.JWT_REFRESH_EXPIRE_TIME]),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  validateRefreshToken(
    request: Request,
    payload: IJwtPayload,
  ): IJwtPayloadRefresh {
    const refreshToken = request
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }

  setAccessTokenToCookies(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: this.configService.get(ENV[ENV.COOKIE_MAX_AGE]),
      secure: this.configService.get(ENV[ENV.NODE_ENV]) === 'production',
    });
  }

  setRefreshTokenToCookies(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: this.configService.get(ENV[ENV.COOKIE_MAX_AGE]),
      secure: this.configService.get(ENV[ENV.NODE_ENV]) === 'production',
    });
  }
}
