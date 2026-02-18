import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Token } from './entities/token.entity';
import envConfig from '../shared/config';
import { File } from './entities/file.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: envConfig.DATABASE_HOST,
  port: Number(envConfig.DATABASE_PORT),
  username: envConfig.DATABASE_USERNAME,
  password: envConfig.DATABASE_PASSWORD,
  database: envConfig.DATABASE_NAME,

  entities: [User, Role, Permission, Token, File],
  synchronize: false,
  // migrations: [__dirname + '/migrations/*.ts'],  // nếu chưa có thì thêm để migration hoạt động
  // logging: true,  // bật tạm để debug
});