import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  IPaginationMeta,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CatM } from 'src/domain/model/cats.model';
import { ICatRepository } from 'src/domain/repositories/catRepository.interface';
import { FindOptionsWhere, FindManyOptions, Repository } from 'typeorm';
import { Cats } from '../entities/cat.entity';

@Injectable()
export class CatRepository implements ICatRepository {
  constructor(
    @InjectRepository(Cats)
    private readonly catRepository: Repository<Cats>,
  ) {}

  async insert(data: CatM): Promise<CatM> {
    const cat = this.catRepository.create(data);
    const result = await this.catRepository.save(cat);
    if (!result) {
      throw new BadRequestException('error saving cat');
    }
    return result;
  }

  async findAll(): Promise<CatM[]> {
    const cats = await this.catRepository.find();
    return cats;
  }

  async findById(id: number): Promise<CatM> {
    const cat = await this.catRepository.findOne({ where: { id: id } });
    if (!cat) {
      throw new NotFoundException('Not Dound');
    }
    return cat;
  }

  async paginate?(
    option: IPaginationOptions<IPaginationMeta>,
    searchOptions?: FindOptionsWhere<CatM> | FindManyOptions<CatM>,
  ): Promise<Pagination<CatM, IPaginationMeta>> {
    return await paginate(this.catRepository, option, searchOptions);
  }
}
