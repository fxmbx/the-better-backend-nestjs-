import { CatM } from '../model/cats.model';
import { BaseRepository } from './baseRepository.interface';

export type ICatRepository = BaseRepository<CatM>;
