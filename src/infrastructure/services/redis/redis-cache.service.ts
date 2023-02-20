import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ICacheService } from 'src/domain/adapter/cache.interface';
// import { Cache } from 'cache-manager';

@Injectable()
export class RedisCache implements ICacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManaher: Cache,
  ) {}

  get<T>(key: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
  set<T>(key: string, value: T, option?: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
