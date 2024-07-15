import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UserRegisterDto } from './userRegister.dto';

export class UserLoginDto extends OmitType(UserRegisterDto, ['name'] as const) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    minLength: 6,
  })
  password: string;
}
