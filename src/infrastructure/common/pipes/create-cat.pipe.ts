import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateCatDto } from 'src/infrastructure/controllers/cat/cat-dto.class';

@Injectable()
export class ValidateCreateCatPipe implements PipeTransform {
  minAge = 4;
  transform(value: CreateCatDto, metadata: ArgumentMetadata) {
    if (value.age < this.minAge) {
      throw new HttpException('cat too young lol', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
