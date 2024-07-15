// Core
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Tools
import { STRATEGY } from '../../../utils/strategy';

@Injectable()
export class RefreshGuard extends AuthGuard(STRATEGY.REFRESH) {
  constructor() {
    super();
  }
}
