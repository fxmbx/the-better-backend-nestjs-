import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/domain/enum/user.role.enum';
import { RegisterDto } from 'src/infrastructure/controllers/auth/auth-dto';

@Injectable()
export class ValidateCreateUserPipe implements PipeTransform {
  minNumberOfChasr = 8;
  transform(value: RegisterDto, metadata: ArgumentMetadata) {
    if (value.password.length < this.minNumberOfChasr) {
      throw new HttpException(
        'password length too short',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordRegEx = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );
    if (!value.password.match(passwordRegEx)) {
      throw new HttpException(
        'password not strong enough. password must contain at least 8 characters, at least 1 lovercase alphabet and 1 uppercase alphabet, at least 1 number',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.confirmPassword !== value.password) {
      throw new HttpException(
        'password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.role.length < 1) {
      value.role = UserRoleEnum.REGULARUSER;
    }
    return value;
  }
}
