import { Controller, MaxFileSizeValidator, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipeWithUnlink } from './parse-file-pipe-with-unlink.pipe';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';

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
      const response = await this.fileSerive.uploadFile(file);
      return new SuccessResponse(response.data, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK)
   }
}
