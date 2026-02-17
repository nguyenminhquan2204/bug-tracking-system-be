import { Injectable, NotFoundException } from '@nestjs/common';
import { BugRepo } from './repos/bug.repo';
import { CreateBugBodyType, GetBugsQueryBodyType, UpdateBugBodyType } from './models/bug.model';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugCommentRepo } from './repos/bug-comment.repo';
import { S3Service } from 'src/shared/services/s3.service';
import { BugAttachmentRepo } from './repos/bug-attachment.repo';
import { FileRepo } from '../file/file.repo';
import { FileService } from '../file/file.service';

@Injectable()
export class BugService {
   constructor(
      private readonly bugRepo: BugRepo,
      private readonly bugCommentRepo: BugCommentRepo,
      private readonly bugAttachmentRepo: BugAttachmentRepo,
      private readonly fileRepo: FileRepo,
      private readonly fileService: FileService
   ) {}

   list(query: GetBugsQueryBodyType) {
      return this.bugRepo.list(query);
   }


   getAll(projectId: number) {
      return this.bugRepo.getAll(projectId);
   }

   async postCreateComment(userId: number, data: any) {
      const { bugId, content, files } = data;
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
         const createdFiles = await this.fileRepo.createMany(
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

   async create(body: CreateBugBodyType) {
      const bug = await this.bugRepo.create(body);
      return bug;
   }

   async update(changeById: number, bugId: number, body: UpdateBugBodyType) {
      const bug = await this.bugRepo.getBugBugId(bugId);
      if(!bug) throw new NotFoundException('Bug not found');

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
