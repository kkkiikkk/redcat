// Core
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

// Instruments
import { ENV } from '../../../utils/env';
import { STRATEGY } from '../../../utils/strategy';
import { IJwtPayload } from '../auth.interfaces';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.ACCESS,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: <string>config.get(ENV[ENV.ACCESS_SECRET]),
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    return null;
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload;
  }
}
