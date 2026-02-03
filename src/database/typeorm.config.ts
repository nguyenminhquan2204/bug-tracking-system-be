import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import envConfig from '../shared/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envConfig.DATABASE_HOST,
  port: Number(envConfig.DATABASE_PORT),
  username: envConfig.DATABASE_USERNAME,
  password: envConfig.DATABASE_PASSWORD,
  database: envConfig.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: false,
};
