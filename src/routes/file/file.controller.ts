import { Controller, MaxFileSizeValidator, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipeWithUnlink } from './parse-file-pipe-with-unlink.pipe';

@Controller('file')
export class FileController {
   constructor(private readonly fileSerive: FileService) {}

   @Post('images/upload')
   @UseInterceptors(
      FileInterceptor('file', {
         limits: {
            fileSize: 5 * 1024 * 1024,
         },
      }),
   )
   async uploadFile(
      @UploadedFile(
         new ParseFilePipeWithUnlink({
            validators: [
               new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
               // new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/ })
            ],
         }),
      )
      file: Express.Multer.File,
   ) {
      return this.fileSerive.uploadFile(file);
   }
}
