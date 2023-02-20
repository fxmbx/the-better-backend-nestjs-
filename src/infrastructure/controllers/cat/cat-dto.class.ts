import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ description: 'name of cat', example: 'tunde', required: true })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'age of the cat', example: '12', required: true })
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty({
    description: 'breed of the cat',
    example: 'tilion',
    required: true,
  })
  @IsNotEmpty()
  readonly breed: string;
}

export class GetCatByID {
  @ApiProperty({
    description: 'id of cat to be feteched',
    example: '1',
    required: true,
  })
  @IsNotEmpty()
  readonly id: number;
}
