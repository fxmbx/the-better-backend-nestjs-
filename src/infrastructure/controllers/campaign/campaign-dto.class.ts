import { IsNotEmpty } from 'class-validator';

export class CreateCampignDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}
