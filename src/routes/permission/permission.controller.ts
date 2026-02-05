import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionBodyDTO, GetPermissionsQueryDTO, UpdatePermissionBodyDTO } from './permission.dto';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';

@Controller('permission')
export class PermissionController {
   constructor(private readonly permissionService: PermissionService) {}

   @Get()
   async list(@Query() query: GetPermissionsQueryDTO) {
      const response = await this.permissionService.list(query);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get(':id')
   async getPermissionById(@Param('id', ParseIntPipe) id: number) {
      const response = await this.permissionService.getPermissionById(id);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post()
   async create(@Body() body: CreatePermissionBodyDTO) {
      const response = await this.permissionService.create(body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch(':id')
   async update(@Param('id', ParseIntPipe) id: number, body: UpdatePermissionBodyDTO) {
      const response = await this.permissionService.update(id, body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Delete(':id')
   async delete(@Param('id', ParseIntPipe) id: number) {
      const response = await this.permissionService.delete(id);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
