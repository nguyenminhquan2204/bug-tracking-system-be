import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleBodyDTO, GetRolesBodyDTO } from './role.dto';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
@Controller('role')
export class RoleController {
   constructor(private readonly roleService: RoleService) {}

   @Get()
   async list(@Query() query: GetRolesBodyDTO) {
      const response = await this.roleService.list(query);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get(':id')
   async getRoleDetailById(@Param('id', ParseIntPipe) id: number) {
      const response = await this.roleService.getRoleDetailById(id);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post()
   async create(@Body() body: CreateRoleBodyDTO) {
      const response = await this.roleService.createRole(body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

}
