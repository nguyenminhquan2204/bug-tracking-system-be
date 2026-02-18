import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { S3Service } from 'src/shared/services/s3.service';
import { FileRepo } from './file.repo';

@Injectable()
export class FileService {
   constructor(
      private readonly s3Service: S3Service,
      private readonly fileRepo: FileRepo
   ) {}

   async uploadFile(file: Express.Multer.File) {
      const res = await this.s3Service.uploadedFile({
         filename: 'images/' + file.filename,
         filepath: file.path,
         contentType: file.mimetype
      });

      await unlink(file.path);

      return {
         data: {
            url: res.Location,
            fileName: file.originalname,
            fileType: file.mimetype,
            size: file.size
         },
      };
   }

   async uploadFileFromFormData(file: Express.Multer.File, save?: boolean) {
      const res = await this.s3Service.uploadedFileFromFormData({
         filename: 'images/' + file.originalname,
         buffer: file.buffer,
         contentType: file.mimetype
      });

      let saveFile: any;
      if(save) {
         const saveFile = await this.fileRepo.create({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            path: res.Location
         })

         return saveFile;
      }

      return {
         data: {
            url: res.Location,
            fileName: file.originalname,
            fileType: file.mimetype,
            size: file.size
         }
      };
   }

   async createMany(data: any) {
      return await this.fileRepo.createMany(data);
   }
}
