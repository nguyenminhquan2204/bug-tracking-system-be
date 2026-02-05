import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   async login(@Body() body: LoginBodyDTO) {
      return await this.authService.login(body);
   }
}
