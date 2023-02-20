import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/domain/enum/user.role.enum';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly confirmPassword: string;

  @ApiProperty({ required: false })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
