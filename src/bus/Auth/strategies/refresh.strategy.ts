// Core
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Instruments
import { ENV } from '../../../utils/env';
import { STRATEGY } from '../../../utils/strategy';
import { IJwtPayload, IJwtPayloadRefresh } from '../auth.interfaces';

// Services
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.REFRESH,
) {
  constructor(
    config: ConfigService,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: <string>config.get(ENV[ENV.REFRESH_SECRET]),
      passReqToCallback: true,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  validate(request: Request, payload: IJwtPayload): IJwtPayloadRefresh {
    return this.authService.validateRefreshToken(request, payload);
  }
}
