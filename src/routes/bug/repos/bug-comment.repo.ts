import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BugComment } from 'src/database/entities/bug_comment.entity';
import { CreateBugCommentType } from '../models/bug-comment.model';

@Injectable()
export class BugCommentRepo {
   constructor(
      @InjectRepository(BugComment)
      private readonly repository: Repository<BugComment>,
   ) {}

   async create(userId: number, data: CreateBugCommentType & { bugId: number }) {
      return await this.repository.save({...data, userId: userId });
   }
}
