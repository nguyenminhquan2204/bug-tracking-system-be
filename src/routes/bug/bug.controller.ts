import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BugService } from './bug.service';
import { BugGetListQueryDTO, CreateBugBodyDTO, GetBugsQueryBodyDTO, UpdateBugBodyDTO, UpdateBugPriorityParamsDTO, UpdateBugStatusParamsDTO } from './dtos/bug.dto';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { ZodValidationPipe } from 'src/shared/common/pipes/zod-validation.pipe';
import { UpdateBugPriorityParamsSchema, UpdateBugStatusParamsSchema } from './models/bug.model';
import { ActiveUser } from 'src/shared/common/decorators/active-user.decorator';
import { CreateBugCommentDTO } from './dtos/bug-comment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('bug')
export class BugController {
   constructor(private readonly bugService: BugService) {}

   @Get()
   async list(@Query() query: GetBugsQueryBodyDTO) {
      const response = await this.bugService.list(query);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get('all/:projectId')
   async getAll(@Param('projectId', ParseIntPipe) projectId: number, @Query() query: BugGetListQueryDTO) {
      const response = await this.bugService.getAll(projectId, query?.search);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get(':bugId')
   async getBugById(@Param('bugId', ParseIntPipe) bugId: number) {
      const response = await this.bugService.getBugById(bugId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get('/history/:bugId')
   async getBugHistoryById(@Param('bugId', ParseIntPipe) bugId: number) {
      const response = await this.bugService.getBugHistoryById(bugId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post()
   async create(@ActiveUser('userId') userId: number, @Body() body: CreateBugBodyDTO) {
      const data = {
         ...body,
         createdBy: userId
      }
      const response = await this.bugService.create(data);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post(':bugId')
   @UseInterceptors(FilesInterceptor('files'))
   async createComment(@ActiveUser('userId') userId: number, @Param('bugId', ParseIntPipe) bugId: number, @Body() body: CreateBugCommentDTO, @UploadedFiles() files: Express.Multer.File[]) {
      const response = await this.bugService.postCreateComment(userId, { ...body, bugId, files });
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch(':bugId')
   async update(@ActiveUser('userId') changeById: number, @Param('bugId', ParseIntPipe) bugId: number, @Body() body: UpdateBugBodyDTO) {
      const response = await this.bugService.update(changeById, bugId, body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch(':id/status')
   async changeStatus(@ActiveUser('userId') userId: number, @Param('id', ParseIntPipe) bugId: number, @Body(new ZodValidationPipe(UpdateBugStatusParamsSchema)) body: UpdateBugStatusParamsDTO) {
      const response = await this.bugService.changeStatus(userId, bugId, body.status);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch(':id/priority')
   async changePriority(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(UpdateBugPriorityParamsSchema)) body: UpdateBugPriorityParamsDTO) {
      const response = await this.bugService.changePriority(id, body.priority);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Delete(':bugId')
   async delete(@Param('bugId', ParseIntPipe) bugId: number) {
      const response = await this.bugService.delete(bugId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
