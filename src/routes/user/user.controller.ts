import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  DEFAULT_SUCCESS_MESSAGE,
  HttpStatus,
  SuccessResponse,
} from 'src/shared/helpers/response';
import { CreateUserBodyDTO, GetUsersQueryDTO, GetUsersResDTO, UpdateUserBodyDTO } from './user.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserBodyDTO) {
    const response = await this.userService.create(body);
    return new SuccessResponse(
      response,
      DEFAULT_SUCCESS_MESSAGE,
      HttpStatus.OK,
    );
  }

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  async list(@Query() query: GetUsersQueryDTO) {
    const response = await this.userService.list(query);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Get('get-admins')
  async listAdmin() {
    const response = await this.userService.listAdmin();
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Get(':userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number) {
    const response = await this.userService.getUserById(userId);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Patch(':userId')
  async updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() payload: UpdateUserBodyDTO) {
    const response = await this.userService.update(userId, payload);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }

  @Delete(':userId')
  async delete(@Param('userId', ParseIntPipe) userId: number) {
    const response = await this.userService.deleteById(userId);
    return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
  }
}
