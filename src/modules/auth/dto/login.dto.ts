import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ format: 'email' })
  email: string;

  @IsStrongPassword({
    minLength: 8,
  })
  @ApiProperty({ format: 'password' })
  password: string;
}
