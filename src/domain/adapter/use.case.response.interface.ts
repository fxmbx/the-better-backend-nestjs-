import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export interface IUseCaseResponse {
  data?: Record<string, any>;
  metadata?: IPaginationMeta;
}
