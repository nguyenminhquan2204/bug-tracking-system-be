import { Controller, Get } from '@nestjs/common';
import { ProjectService } from '../project.service';
import { ActiveUser } from 'src/shared/common/decorators/active-user.decorator';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';

@Controller('project-public')
export class ProjectPublicController {
   constructor(private readonly projectService: ProjectService) {}

   @Get()
   async getProjects(@ActiveUser('userId') userId: number) {
      const response = await this.projectService.getMyProject(userId) ?? [];
      return new SuccessResponse({
         projects: response.map((item) => {
            return item.project
         })
      }, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
