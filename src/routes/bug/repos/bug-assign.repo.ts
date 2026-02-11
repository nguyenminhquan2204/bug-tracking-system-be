import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBugHistoryType } from '../models/bug-history.model';
import { BugAssignment } from 'src/database/entities/bug_assignment.entity';

@Injectable()
export class BugAssignRepo {
   constructor(
      @InjectRepository(BugAssignment)
      private readonly repository: Repository<BugAssignment>,
   ) {}

   async create(data: any) {
      return await this.repository.save(data);
   }
}
