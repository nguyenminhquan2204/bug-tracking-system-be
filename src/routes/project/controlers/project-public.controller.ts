import { Controller, ForbiddenException, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProjectService } from '../project.service';
import { ActiveUser } from 'src/shared/common/decorators/active-user.decorator';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { ProjectMemberService } from 'src/routes/project-member/project-member.service';

@Controller('project-public')
export class ProjectPublicController {
   constructor(
      private readonly projectService: ProjectService,
      private readonly projectMemberService: ProjectMemberService
   ) {}

   @Get()
   async getProjects(@ActiveUser('userId') userId: number) {
      const response = await this.projectService.getMyProject(userId) ?? [];
      return new SuccessResponse({
         projects: response.map((item) => {
            return item.project
         })
      }, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get('dashboard/tester/:projectId')
   async getDashboardTester(@Param('projectId', ParseIntPipe) projectId: number) {
      const response = await this.projectService.getDashboardTester(projectId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get('developers/:projectId')
   async getDevelopersInProject(@Param('projectId') projectId: number) {
      const response = await this.projectService.getDevelopersInProject(projectId);
      return new SuccessResponse({
         developers: response.map((item) => {
            return item.user
         })
      }, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get(':projectId')
   async getMyProjectById(@ActiveUser('userId') userId: number, @Param('projectId', ParseIntPipe) projectId: number) {
      const valid = await this.projectMemberService.validProjectWithUserId(userId, projectId);
      if(!valid) throw new ForbiddenException('You can not access this project');

      const response = await this.projectService.getProjectById(projectId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
