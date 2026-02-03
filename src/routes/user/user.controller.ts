import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  DEFAULT_SUCCESS_MESSAGE,
  HttpStatus,
  SuccessResponse,
} from 'src/shared/helpers/response';
import { CreateUserBodyDTO } from './user.dto';

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
}
