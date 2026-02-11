import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bug } from 'src/database/entities/bug.entity';
import { BugType, CreateBugBodyType, GetBugsQueryBodyType, GetBugsResType, UpdateBugBodyType } from '../models/bug.model';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugHistoryRepo } from './bug-history.repo';

@Injectable()
export class BugRepo {
   constructor(
      @InjectRepository(Bug)
      private readonly repository: Repository<Bug>,
      private readonly bugHistoryRepo: BugHistoryRepo
   ) {}

   async list(query: GetBugsQueryBodyType): Promise<GetBugsResType> {
   const { limit, page } = query;
      const skip = (page - 1) * limit;
      const take = limit;

      const [items, total] = await this.repository.findAndCount({
         skip,
         take,
         order: { createdAt: 'DESC' }
      });

      return {
         data: items,
         totalItems: total,
         page: page,
         limit: limit,
         totalPages: Math.ceil(total / limit)
      }
   }

   async getAll() {
      const [todo, doing, prInReview, merged, readyForQc, qcInProgress, doneInDev, onStg] = await Promise.all([
         this.repository.find({ where: { status: BugStatus.TODO }}),
         this.repository.find({ where: { status: BugStatus.DOING }}),
         this.repository.find({ where: { status: BugStatus.PR_IN_REVIEW }}),
         this.repository.find({ where: { status: BugStatus.MERGED }}),
         this.repository.find({ where: { status: BugStatus.READY_FOR_QC }}),
         this.repository.find({ where: { status: BugStatus.QC_IN_PROGRESS }}),
         this.repository.find({ where: { status: BugStatus.DONE_IN_DEV }}),
         this.repository.find({ where: { status: BugStatus.ON_STG }}),
      ])
      return {
         bugs: {
            todo: todo,
            doing: doing,
            pr_in_review: prInReview,
            merged: merged,
            ready_for_qc: readyForQc,
            qc_in_progress: qcInProgress,
            done_in_dev: doneInDev,
            on_stg: onStg
         }
      }
   }

   async getBugBugId(bugId: number): Promise<BugType | null> {
      return await this.repository.findOneBy({ id: bugId });
   }

   async create(body: CreateBugBodyType): Promise<BugType> {
      return await this.repository.save(body);
   }

   async update(bugId: number, body: UpdateBugBodyType): Promise<any> {
      await this.repository.update(bugId, body);
      return { message: 'Update project successfully!' }
   }

   async delete(bugId: number, isHard?: boolean): Promise<any> {
      if(isHard) {
         await this.repository.delete(bugId);
         return { message: 'Bug deleted permanently' }
      }
      await this.repository.softDelete(bugId);
      return { message: 'Bug deleted successfully' };
   }

   async changeStatus(userId: number, bugId: number, status: BugStatus): Promise<BugType | NotFoundException> {
      const bug = await this.repository.findOneBy({ id: bugId });
      if(!bug) throw new NotFoundException('Bug not found')
      
      const oldStatus = bug.status;

      if (status && status !== oldStatus) {
         bug.status = status;

         await this.bugHistoryRepo.create({
            bugId,
            fieldChanged: 'Status',
            oldValue: oldStatus,
            newValue: status,
            updatedBy: userId
         });

         return await this.repository.save(bug);
      }

      return await this.repository.save(bug);
   }

   async changePriority(bugId: number, priority: BugPriority): Promise<BugType | NotFoundException> {
      const bug = await this.repository.findOneBy({ id: bugId });
      if(!bug) return new NotFoundException('Bug not found')

      if(priority) bug.priority = priority;

      return await this.repository.save(bug);
   }
}
