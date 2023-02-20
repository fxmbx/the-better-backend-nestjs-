import { NotFoundException } from '@nestjs/common';
import { IUseCaseResponse } from 'src/domain/adapter/use.case.response.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { CatM } from 'src/domain/model/cats.model';
import { ICatRepository } from 'src/domain/repositories/catRepository.interface';
import { CatRepository } from 'src/infrastructure/repositories/cat.repository';

export class catUseCases {
  constructor(
    private readonly catRepository: ICatRepository,
    private readonly logger: ILogger,
  ) {}

  async getCatByID(id: number): Promise<IUseCaseResponse> {
    const cat = await this.catRepository.findById(id);
    this.logger.log('getCatByID execute ', `${cat.name}. cat feteched`);

    return {
      data: {
        message: 'cat fetched',
        cat,
      },
    };
  }

  async createCatUseCase(
    name: string,
    age: number,
    breed: string,
  ): Promise<IUseCaseResponse> {
    const result = await this.catRepository.insert({
      age,
      name,
      breed,
    } as CatM);
    this.logger.log(`createCatUseCase execute`, `${name}. cat created`);

    return {
      data: {
        message: 'cat added',
        result,
      },
    };
  }
}
