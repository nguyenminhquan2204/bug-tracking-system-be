import { ParseFileOptions, ParseFilePipe } from '@nestjs/common';
import { unlink } from 'fs/promises';

export class ParseFilePipeWithUnlink extends ParseFilePipe {
   constructor(options?: ParseFileOptions) {
      super(options);
   }

   async transform(file: Express.Multer.File): Promise<any> {
      try {
         return await super.transform(file);
      } catch (error) {
         if (file?.path) {
            await unlink(file.path).catch(() => {});
         }
         throw error;
      }
   }
}