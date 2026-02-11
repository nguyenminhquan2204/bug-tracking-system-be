import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BugHistory } from 'src/database/entities/bug_history.entity';
import { Repository } from 'typeorm';
import { CreateBugHistoryType } from '../models/bug-history.model';

@Injectable()
export class BugHistoryRepo {
   constructor(
      @InjectRepository(BugHistory)
      private readonly repository: Repository<BugHistory>,
   ) {}

   async create(data: CreateBugHistoryType) {
      return await this.repository.save(data);
   }
}
