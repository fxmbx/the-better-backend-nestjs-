import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface BaseRepository<T> {
  insert(data: T): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  paginate?(
    option: IPaginationOptions,
    searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
  ): Promise<Pagination<T>>;
}
