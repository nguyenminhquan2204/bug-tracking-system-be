import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BugAttachment } from 'src/database/entities/bug_attactment.entity';

@Injectable()
export class BugAttachmentRepo {
   constructor(
      @InjectRepository(BugAttachment)
      private readonly repository: Repository<BugAttachment>,
   ) {}

   async createMany(data: any) {
      return await this.repository.save(data);
   }
}
