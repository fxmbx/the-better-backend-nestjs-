import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ICacheService } from 'src/domain/adapter/cache.interface';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCache implements ICacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async get<T>(key: string): Promise<T> {
    return await this.cache.get<T>(key);
  }
  async set<T>(key: string, value: T, option?: number): Promise<void> {
    await this.cache.set(key, value, option);
  }
  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
