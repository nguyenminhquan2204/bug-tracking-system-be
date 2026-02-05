import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, RefreshTokenBodyDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   async login(@Body() body: LoginBodyDTO) {
      return await this.authService.login(body);
   }

   @Post('logout')
   async logout(@Body() body: RefreshTokenBodyDTO) {
      return await this.authService.logout(body);
   }
}
