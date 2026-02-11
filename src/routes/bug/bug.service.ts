import { Injectable, NotFoundException } from '@nestjs/common';
import { BugRepo } from './repos/bug.repo';
import { CreateBugBodyType, GetBugsQueryBodyType, UpdateBugBodyType } from './models/bug.model';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';

@Injectable()
export class BugService {
   constructor(private readonly bugRepo: BugRepo) {}

   list(query: GetBugsQueryBodyType) {
      return this.bugRepo.list(query);
   }

   getAll() {
      return this.bugRepo.getAll();
   }

   async getBugById(bugId: number) {
      const bug = await this.bugRepo.getBugBugId(bugId);
      if(!bug) throw new NotFoundException('Bug not found')
      return bug;
   }

   create(body: CreateBugBodyType) {
      return this.bugRepo.create(body);
   }

   async update(bugId: number, body: UpdateBugBodyType) {
      const bug = await this.bugRepo.getBugBugId(bugId);
      if(!bug) throw new NotFoundException('Bug not found');

      return this.bugRepo.update(bugId, body);
   }

   delete(bugId: number) {
      return this.bugRepo.delete(bugId);
   }

   changeStatus(userId: number, bugId: number, status: BugStatus) {
      return this.bugRepo.changeStatus(userId, bugId, status);
   }

   changePriority(bugId: number, priority: BugPriority) {
      return this.bugRepo.changePriority(bugId, priority);
   }
}
