import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO } from './auth.dto';
import { IsPublic } from 'src/shared/common/decorators/auth.decorator';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';

@Controller('auth')
@IsPublic()
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   async login(@Body() body: LoginBodyDTO) {
      const response = await this.authService.login(body);
      return new SuccessResponse({ 
         accessToken: response.token.accessToken,
         refreshToken: response.token.refreshToken,
         role: response.role
      }, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK)
   }

   @Post('logout')
   async logout(@Body() body: LogoutBodyDTO) {
      const response = await this.authService.logout(body);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Post('refresh-token')
   async refreshToken(@Body() body: RefreshTokenBodyDTO) {
      return await this.authService.refreshToken(body);
   }
}
