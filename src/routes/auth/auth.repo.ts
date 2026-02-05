import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "src/database/entities/token.entity";
import { TokenType } from "src/shared/constants/other.constant";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepo {
   constructor(
      @InjectRepository(Token)
      private readonly repository: Repository<Token>
   ) {}

   async createRefreshToken(data: { token: string, userId: number, expiresAt: Date, tokenType: TokenType.REFRESH_TOKEN, tokenId: string }) {
      return await this.repository.save(data);
   }

   async deleteRefreshToken(refreshToken: string) {
      return await this.repository.delete({
         token: refreshToken 
      });
   }
}