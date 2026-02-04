import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectBodyDTO, GetProjectsQueryBodyDTO, UpdateProjectBodyDTO } from './project.dto';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';

@Controller('project')
export class ProjectController {
   constructor(private readonly projectService: ProjectService) {}

   @Get()
   async list(@Query() query: GetProjectsQueryBodyDTO) {
      const response = await this.projectService.list(query);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get(':projectId')
   async getProjectById(@Param('projectId', ParseIntPipe) projectId: number) {
      const response = await this.projectService.getProjectById(projectId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post()
   async create(@Body() body: CreateProjectBodyDTO) {
      const response = await this.projectService.create(body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch(':projectId')
   async update(@Param('projectId', ParseIntPipe) projectId: number, @Body() body: UpdateProjectBodyDTO) {
      const response = await this.projectService.update(projectId, body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Delete(':projectId')
   async delete(@Param('projectId', ParseIntPipe) projectId: number) {
      const response = await this.projectService.delete(projectId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
