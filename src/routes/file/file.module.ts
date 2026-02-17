import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UPLOAD_DIR } from 'src/shared/constants/other.constant';
import { generateRandomFileName } from 'src/shared/helpers/helper';
import { FileRepo } from './file.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/database/entities/file.entity';

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
    }),
    TypeOrmModule.forFeature([File])
  ],
  controllers: [FileController],
  providers: [FileService, FileRepo],
  exports: [FileRepo, FileService]
})
export class FileModule {
  constructor() {
    if(!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true })
    }
  }
}
