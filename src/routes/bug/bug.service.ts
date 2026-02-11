import { Injectable, NotFoundException } from '@nestjs/common';
import { BugRepo } from './repos/bug.repo';
import { CreateBugBodyType, GetBugsQueryBodyType, UpdateBugBodyType } from './models/bug.model';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugAssignRepo } from './repos/bug-assign.repo';

@Injectable()
export class BugService {
   constructor(
      private readonly bugRepo: BugRepo,
      private readonly bugAssignRepo: BugAssignRepo
   ) {}

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

   async create(userId: number, developerId: number, body: CreateBugBodyType) {
      const bug = await this.bugRepo.create(body);
      await this.bugAssignRepo.create({ 
         bugId: bug.id,
         userId: developerId,
         assignedBy: userId,
         assignedAt: new Date()
      })
      return bug;
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
