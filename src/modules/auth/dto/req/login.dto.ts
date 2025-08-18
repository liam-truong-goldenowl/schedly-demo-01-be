import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ format: 'email', example: 'johndoe@goldenowl.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ format: 'password', example: 'StrongP@ssw0rd!' })
  password: string;
}
