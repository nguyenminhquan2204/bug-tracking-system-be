import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UPLOAD_DIR } from 'src/shared/constants/other.constant';
import { generateRandomFileName } from 'src/shared/helpers/helper';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const newFilename = generateRandomFileName(file.originalname);
    cb(null, newFilename);
  }
})

@Module({
  imports: [
    MulterModule.register({
      storage
    })
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {
  constructor() {
    if(!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }
  }
}
