import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO } from './auth.dto';
import { IsPublic } from 'src/shared/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   @IsPublic()
   async login(@Body() body: LoginBodyDTO) {
      return await this.authService.login(body);
   }

   @Post('logout')
   async logout(@Body() body: LogoutBodyDTO) {
      return await this.authService.logout(body);
   }

   @Post('refresh-token')
   async refreshToken(@Body() body: RefreshTokenBodyDTO) {
      return await this.authService.refreshToken(body);
   }
}
