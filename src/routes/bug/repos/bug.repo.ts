import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bug } from 'src/database/entities/bug.entity';
import { BugType, CreateBugBodyType, GetBugsQueryBodyType, GetBugsResType, UpdateBugBodyType } from '../models/bug.model';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugHistoryRepo } from './bug-history.repo';
import { subDays, startOfDay, format } from 'date-fns';

@Injectable()
export class BugRepo {
   constructor(
      @InjectRepository(Bug)
      private readonly repository: Repository<Bug>,
      private readonly bugHistoryRepo: BugHistoryRepo
   ) {}

   private async getSummaryStatus() {
      const result = await this.repository
         .createQueryBuilder('bug')
         .select('bug.status', 'status')
         .addSelect('COUNT(bug.id)', 'count')
         .groupBy('bug.status')
         .getRawMany();

      const summaryStatus = {
         TOTAL: 0,
         TODO: 0,
         DOING: 0,
         PR_IN_REVIEW: 0,
         DONE_IN_DEV: 0,
      };

      const fullStatusStats: Record<string, number> = 
         Object.values(BugStatus).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
         }, {} as Record<string, number>);

      result.forEach(({ status, count }) => {
         const numericCount = Number(count);

         summaryStatus.TOTAL += numericCount;

         if (summaryStatus[status] !== undefined) {
            summaryStatus[status] = numericCount;
         }

         fullStatusStats[status] = numericCount;
      });

      const fullStatus = Object.entries(fullStatusStats).map(
         ([name, value]) => ({ name, value })
      );

      return { summaryStatus, fullStatus };
   }

   private async getTrend7Days() {
      const today = startOfDay(new Date());
      const sevenDaysAgo = startOfDay(subDays(today, 7));

      const trendRaw = await this.repository
         .createQueryBuilder('bug')
         .select(`TO_CHAR(bug."createdAt", 'YYYY-MM-DD')`, 'date')
         .addSelect(`COUNT(bug.id)`, 'created')
         .addSelect(`
            COUNT(
               CASE WHEN bug.status = :doneStatus THEN 1 END
            )
         `, 'resolved')
         .where('bug."createdAt" >= :sevenDaysAgo', { sevenDaysAgo })
         .andWhere('bug."createdAt" < :today', { today })
         .setParameter('doneStatus', BugStatus.DONE_IN_DEV)
         .groupBy(`TO_CHAR(bug."createdAt", 'YYYY-MM-DD')`)
         .orderBy(`TO_CHAR(bug."createdAt", 'YYYY-MM-DD')`, 'ASC')
         .getRawMany();

      return this.buildTrendWithMissingDays(trendRaw, today);
   }

   private buildTrendWithMissingDays(trendRaw, today: Date) {
      const trendMap = trendRaw.reduce((acc, item) => {
         acc[item.date] = {
            created: Number(item.created),
            resolved: Number(item.resolved),
         };
         return acc;
      }, {} as Record<string, { created: number; resolved: number }>);

      const result: any = [];

      for (let i = 7; i > 0; i--) {
         const dateStr = format(subDays(today, i), 'yyyy-MM-dd');

         result.push({
            date: dateStr,
            created: trendMap[dateStr]?.created ?? 0,
            resolved: trendMap[dateStr]?.resolved ?? 0,
         });
      }

      return result;
   }

   private async getTop4ProjectsByOpenBug() {
      const result = await this.repository
         .createQueryBuilder('bug')
         .leftJoin('bug.project', 'project')
         .select('project.name', 'name')
         .addSelect('COUNT(bug.id)', 'open')
         .groupBy('project.id')
         .addGroupBy('project.name')
         .orderBy('COUNT(bug.id)', 'DESC')
         .limit(4)
         .getRawMany();

      return result.map(item => ({
         name: item.name,
         open: Number(item.open),
      }));
   }

   private async getTop3UsersWithMostOpenBugs() {
      const result = await this.repository
         .createQueryBuilder('bug')
         .leftJoin('bug.developer', 'user')
         .select('user.id', 'userId')
         .addSelect('user.userName', 'name')
         .addSelect('COUNT(bug.id)', 'open')
         .groupBy('user.id')
         .addGroupBy('user.userName')
         .orderBy('COUNT(bug.id)', 'DESC')
         .limit(3)
         .getRawMany();

      return result.map(item => ({
         id: item.userId,
         name: item.name,
         open: Number(item.open),
      }));
   }

   async getDashboardAdminAll() {
      const [summaryData, trend7Days, top4ProjectByOpenBug, top3UserWithOpenBugs] = await Promise.all([
         this.getSummaryStatus(),
         this.getTrend7Days(),
         this.getTop4ProjectsByOpenBug(),
         this.getTop3UsersWithMostOpenBugs()
      ]);

      return {
         summaryStatus: summaryData.summaryStatus,
         fullStatus: summaryData.fullStatus,
         trend7Days,
         top4ProjectByOpenBug,
         top3UserWithOpenBugs
      };
   }

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

   async getAll(projectId: number) {
      const [todo, doing, prInReview, merged, readyForQc, qcInProgress, doneInDev, onStg] = await Promise.all([
         this.repository.find({ where: { status: BugStatus.TODO, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.DOING, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.PR_IN_REVIEW, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.MERGED, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.READY_FOR_QC, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.QC_IN_PROGRESS, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.DONE_IN_DEV, projectId }, relations: { developer: true, reporter: true }}),
         this.repository.find({ where: { status: BugStatus.ON_STG, projectId }, relations: { developer: true, reporter: true }}),
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
      return await this.repository.findOne({
         where: { id: bugId },
         relations: {
            comments: {
               user: true,
               attachments: {
                  file: true
               }
            }
         }
      });
   }

   async create(body: CreateBugBodyType): Promise<BugType> {
      return await this.repository.save(body);
   }

   async update(changeById: number, bugId: number, body: UpdateBugBodyType): Promise<any> {
      await this.repository.update(bugId, { ...body, updatedBy: changeById });
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