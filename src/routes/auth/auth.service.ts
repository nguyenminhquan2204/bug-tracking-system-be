import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HasingService } from 'src/shared/services/hasing.service';
import { TokenService } from 'src/shared/services/token.service';
import { UserService } from '../user/user.service';
import { LoginBodyType, RefreshTokenBodyType } from './auth.model';
import { AuthRepo } from './auth.repo';
import { TokenType } from 'src/shared/constants/other.constant';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
   constructor(
      private readonly hasingService: HasingService,
      private readonly tokenService: TokenService,
      private readonly userService: UserService,
      private readonly authRepo: AuthRepo
   ) {}

   private async generateTokens(payload: { userId: number, roleId: number, roleName: string }) {
      const [accessToken, refreshToken] = await Promise.all([
         this.tokenService.signAccessToken({
            userId: payload.userId,
            roleId: payload.roleId,
            roleName: payload.roleName
         }),
         this.tokenService.signRefeshToken({ userId: payload.userId })
      ])
      const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
      const tokenId = randomUUID()
      await this.authRepo.createRefreshToken({
         token: refreshToken,
         userId: payload.userId,
         expiresAt: new Date(decodedRefreshToken.exp * 1000),
         tokenType: TokenType.REFRESH_TOKEN,
         tokenId,
      })

      return { accessToken, refreshToken }
   }

   async login(body: LoginBodyType) {
      const user = await this.userService.getInfoUserByEmailIncludeRole(body.email);
      if(!user) throw new NotFoundException('User not found')

      const isPasswordMatch = await this.hasingService.compare(body.password, user.password);
      if(!isPasswordMatch) throw new BadRequestException('Password incorrect')

      const token = await this.generateTokens({
         userId: user.id,
         roleId: user.role.id,
         roleName: user.role.name
      })

      return token;
   }

   async logout(body: RefreshTokenBodyType) {
      const { refreshToken } = body;

      await this.tokenService.verifyRefreshToken(refreshToken);

      const result = await this.authRepo.deleteRefreshToken(refreshToken);
      
      if (!result.affected) {
         throw new BadRequestException('Refresh token not found');
      }

      return { message: 'Logout successfully'}
   }
}