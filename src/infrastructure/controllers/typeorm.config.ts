import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  entities: [process.cwd() + '/dist/infrastructure/entities/*.entity.{js,ts}'],
  migrations: [process.cwd() + '/database/migrations/*.entity.{js,ts}'],
  synchronize: true,
  migrationsRun: false,
  url: 'postgres://root:root@127.0.0.1:5432/nestjs-db',
  extra: {
    ssl:
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'development',
  },
};
console.log(process.env.DATABASE_URL);
// export const AppDataSource = new DataSource(typeormConfig);
