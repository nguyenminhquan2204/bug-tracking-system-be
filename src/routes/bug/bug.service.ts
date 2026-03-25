import { Injectable, NotFoundException } from '@nestjs/common';
import { BugRepo } from './repos/bug.repo';
import { CreateBugBodyType, GetBugsQueryBodyType, UpdateBugBodyType } from './models/bug.model';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugCommentRepo } from './repos/bug-comment.repo';
import { BugAttachmentRepo } from './repos/bug-attachment.repo';
import { FileService } from '../file/file.service';
import { BugHistoryRepo } from './repos/bug-history.repo';
import { UserService } from '../user/user.service';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class BugService {
   constructor(
      private readonly bugRepo: BugRepo,
      private readonly bugCommentRepo: BugCommentRepo,
      private readonly bugAttachmentRepo: BugAttachmentRepo,
      private readonly bugHistoryRepo: BugHistoryRepo,
      private readonly fileService: FileService,
      private readonly userService: UserService,
      private readonly emailService: EmailService
   ) {}

   private async sendEmailToUsersMention(bugId: number, commentContent: string, userId: number, mentionIds: number[]) {
      const uniqueMentionIds = [...new Set(mentionIds)].filter(
         (id) => id !== userId
      );

      // Find information bug, user
      const [bugDetail, userDetail, mentionedUsers] = await Promise.all([
         this.getBugById(bugId),
         this.userService.getUserById(userId),
         this.userService.getUsersByIds(uniqueMentionIds)
      ])
      if (!bugDetail || !userDetail || !mentionedUsers?.length) return;

      const validUsers = mentionedUsers.filter((u) => !!u.email);
      if (!validUsers.length) return;

      const emailPromises = validUsers.map((user) =>
         this.emailService.sendBugCommentMention({
            receiverName: user.userName,
            receiverEmail: user.email,
            actorName: userDetail.userName,
            bugTitle: bugDetail.title,
            commentContent,
         }).catch((err) => {
            console.error(`Send email failed to ${user.email}`, err);
            return null;
         })
      );
      await Promise.all(emailPromises);
   }

   list(query: GetBugsQueryBodyType) {
      return this.bugRepo.list(query);
   }

   getAll(projectId: number, search?: string) {
      return this.bugRepo.getAll(projectId, search);
   }

   async getDashboardAdmin(projectId: number) {
      return await this.bugRepo.getDashboardAdmin(projectId);
   }

   async getDashboardTester(projectId: number) {
      return await this.bugRepo.getDashboardTester(projectId);
   }

   async postCreateComment(userId: number, data: any) {
      const { bugId, content, files, mentions } = data;

      // Send email mentions
      await this.sendEmailToUsersMention(bugId, content, userId, mentions);

      // Create comment
      const comment = await this.bugCommentRepo.create(userId, { bugId, content });
      // Upload S3
      if(files?.length) {
         const uploadResults = await Promise.all(
            files.map((file: Express.Multer.File) =>
               this.fileService.uploadFileFromFormData(file)
            )
         )

         // Create file
         const createdFiles = await this.fileService.createMany(
            uploadResults.map((upload: any, index: number) => ({
               name: files[index].originalname,
               path: upload.data.url,
               type: files[index].mimetype,
               size: files[index].size,
            }))
         );

         // Create attachment
         await this.bugAttachmentRepo.createMany(
            createdFiles.map((file: any) => ({
               commentId: comment.id,
               fileId: file.id,
            }))
         );
      }
      return comment;
   }

   async getBugById(bugId: number) {
      const bug = await this.bugRepo.getBugBugId(bugId);
      if(!bug) throw new NotFoundException('Bug not found')
      return bug;
   }

   async getBugHistoryById(bugId: number) {
      const bug = await this.bugRepo.getBugBugId(bugId);
      if(!bug) throw new NotFoundException('Bug not found');
      return await this.bugHistoryRepo.getBugHistoryById(bugId);
   }

   async create(body: CreateBugBodyType) {
      // Repoter, Developer
      const [reporter, developer] = await Promise.all([
         this.userService.getUserById(body.reporterId),
         this.userService.getUserById(body.developerId)
      ])
      if(!reporter || !developer) throw new NotFoundException('Reporter or developer not found. Plz check again');

      // Create bug
      const bug = await this.bugRepo.create(body);

      // Send email
      await this.emailService.sendBugAssignedEmail({
         email: developer.email,
         userName: developer.userName,
         bugId: bug.id,
         bugTitle: bug.title,
         priority: bug.priority,
         assignedBy: reporter.userName,
         bugUrl: ''
      })

      return bug;
   }

   async update(changeById: number, bugId: number, body: UpdateBugBodyType) {
      const bug = await this.bugRepo.getBugBugId(bugId);
      if(!bug) throw new NotFoundException('Bug not found');

      // Repoter, Developer
      const [reporter, developer] = await Promise.all([
         this.userService.getUserById(changeById),
         this.userService.getUserById(body.developerId)
      ])
      if(!reporter || !developer) throw new NotFoundException('Reporter or developer not found. Plz check again');

      // Send email
      await this.emailService.sendBugResolvedEmail({
         email: developer.email,
         userName: developer.userName,
         bugId: bugId,
         bugTitle: bug.title,
         fixedBy: reporter.userName,
         bugUrl: ''
      })

      return this.bugRepo.update(changeById, bugId, body);
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
