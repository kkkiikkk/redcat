// Core
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Modules
import { UserModule } from '../User/user.module';

// Instruments
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { AccessGuard } from './guards/access.guard';
import { RefreshGuard } from './guards/refresh.guard';

@Module({
  imports: [forwardRef(() => UserModule), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    AccessGuard,
    RefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
