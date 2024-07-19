import {
  Controller,
  Get,
  Post,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// Services
import { UserService } from '../User/user.service';

// Instruments
import {
  User,
  USER_DEFAULT_GROUP,
  USER_DETAIL_GROUP,
  Roles,
} from '../User/user.entity';
import { AccessGuard } from '../Auth/guards/access.guard';
import { RoleGuard } from '../Auth/guards/role.guard';
import { Roles as RolesDecorator } from '../Auth/decorators/roles.decorator';
import { CurrentUser } from '../Auth/decorators/currentUser.decorator';
import {
  UnauthorizedServerErrorResponseSchema,
  InternalServerErrorResponseSchema,
  ForbiddenServerErrorResponseSchema,
} from '../../utils/swaggerSchemas';
import {
  GetAllUsersSuccessResponseSchema,
  GetUserSuccessResponseSchema,
  UserNotFoundErrorResponseSchema,
  UserBlockSuccessResponseSchema,
} from './swaggerSchemas';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse(GetAllUsersSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  @SerializeOptions({ groups: [USER_DEFAULT_GROUP] })
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse(GetUserSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(UserNotFoundErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  @SerializeOptions({ groups: [USER_DEFAULT_GROUP, USER_DETAIL_GROUP] })
  async getMe(@CurrentUser() userId: string): Promise<User> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post('/me/block')
  @ApiOperation({ summary: 'Block current user' })
  @ApiResponse(UserBlockSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @UseGuards(AccessGuard)
  async blockMyself(@CurrentUser() userId: string) {
    const user = await this.userService.findOneById(userId);
    user.isBlocked = true;
    return this.userService.updateOne(user);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string' },
        name: { type: 'string' },
        amount: { type: 'number' },
      },
    },
  })
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(ForbiddenServerErrorResponseSchema)
  @ApiResponse(UserNotFoundErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @ApiParam({ name: 'id', description: 'User ID' })
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  @SerializeOptions({ groups: [USER_DEFAULT_GROUP, USER_DETAIL_GROUP] })
  async getUserInfoById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post('/:id/block')
  @ApiOperation({ summary: 'Block user by ID' })
  @ApiResponse(UserBlockSuccessResponseSchema)
  @ApiResponse(UnauthorizedServerErrorResponseSchema)
  @ApiResponse(ForbiddenServerErrorResponseSchema)
  @ApiResponse(UserNotFoundErrorResponseSchema)
  @ApiResponse(InternalServerErrorResponseSchema)
  @ApiParam({ name: 'id', description: 'User ID' })
  @RolesDecorator(Roles.Admin)
  @UseGuards(AccessGuard, RoleGuard)
  async blockUserById(@Param('id') userId: string) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBlocked = true;

    return this.userService.updateOne(user);
  }
}
