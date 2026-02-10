import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { AddMembersDTO, DeleteMemberParamsDTO } from './project-member.dto';

@Controller('project-member')
export class ProjectMemberController {
   constructor(private readonly projectMemberService: ProjectMemberService) {}

   @Get(':id')
   async getMembers(@Param('id', ParseIntPipe) id: number) {
      const response = await this.projectMemberService.members(id);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Put(':id')
   async addMembers(@Param('id', ParseIntPipe) id: number, @Body() payload: AddMembersDTO) {
      const response = await this.projectMemberService.addMembers(id, payload);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   } 

   @Delete(':id/:userId')
   async deleteMember(@Param() params: DeleteMemberParamsDTO) {
      const response = await this.projectMemberService.deleteMember(params.id, params.userId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
