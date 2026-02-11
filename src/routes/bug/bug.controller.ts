import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BugService } from './bug.service';
import { CreateBugBodyDTO, GetBugsQueryBodyDTO, UpdateBugBodyDTO, UpdateBugPriorityParamsDTO, UpdateBugStatusParamsDTO } from './bug.dto';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { ZodValidationPipe } from 'src/shared/common/pipes/zod-validation.pipe';
import { UpdateBugPriorityParamsSchema, UpdateBugStatusParamsSchema } from './models/bug.model';
import { ActiveUser } from 'src/shared/common/decorators/active-user.decorator';

@Controller('bug')
export class BugController {
   constructor(private readonly bugService: BugService) {}

   @Get()
   async list(@Query() query: GetBugsQueryBodyDTO) {
      const response = await this.bugService.list(query);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get('all')
   async getAll() {
      const response = await this.bugService.getAll()
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get(':bugId')
   async getBugById(@Param('bugId', ParseIntPipe) bugId: number) {
      const response = await this.bugService.getBugById(bugId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post()
   async create(@Body() body: CreateBugBodyDTO) {
      const response = await this.bugService.create(body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch(':bugId')
   async update(@Param('bugId', ParseIntPipe) bugId: number, @Body() body: UpdateBugBodyDTO) {
      const response = await this.bugService.update(bugId, body);
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
