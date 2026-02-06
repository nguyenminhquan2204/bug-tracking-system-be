import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepo } from './role.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepo],
  exports: [RoleService]
})
export class RoleModule {}
