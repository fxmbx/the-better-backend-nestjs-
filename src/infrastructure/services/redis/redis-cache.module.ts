import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || '6379',
        ttl: 60 * 5,
      }),
    }),
  ],
})
export class RedisCacheModule {}
