import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'src/database/entities/file.entity';

@Injectable()
export class FileRepo {
   constructor(
      @InjectRepository(File)
      private readonly repository: Repository<File>,
   ) {}

   async createMany(data: any) {
      return await this.repository.save(data);
   }

   async create(data: any) {
      return await this.repository.save(data);
   }
}
