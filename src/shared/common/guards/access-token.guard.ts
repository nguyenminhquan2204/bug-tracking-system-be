import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { TokenService } from "src/shared/services/token.service";
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from "../../constants/auth.constant";
import { AccessTokenPayload } from "../../types/jwt.type";
import { HttpMethod } from "src/shared/constants/other.constant";
import { RoleService } from "src/routes/role/role.service";

@Injectable()
export class AccessTokenGuard implements CanActivate {
   constructor(
      private readonly tokenService: TokenService,
      private readonly roleService: RoleService
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      // Extra and validate token
      const decodedAccesstoken = await this.extractAndValidateToken(request);

      // Check user permission
      await this.validateUserPermission(decodedAccesstoken, request);
      return true
   }

   // decode from accessToken
   private async extractAndValidateToken(request: any): Promise<AccessTokenPayload> {
      const accessToken = this.extractAccessTokenFromHeader(request);
      try {
         const decodedAccesstoken = await this.tokenService.verifyAccessToken(accessToken);

         request[REQUEST_USER_KEY] = decodedAccesstoken;
         return decodedAccesstoken
      } catch {
         throw new UnauthorizedException('Error.InvalidAccessToken');
      }
   }

   // Get accessToken from request
   private extractAccessTokenFromHeader(request: any): string {
      const accessToken = request.headers['authorization']?.split(' ')[1];
      if(!accessToken) {
         throw new UnauthorizedException('Error.MissingAccessToken');
      }
      return accessToken;
   }

   // check roleId valid with permission ?
   private async validateUserPermission(decodedAccesstoken: AccessTokenPayload, request: any): Promise<void> {
      const roleId: number = decodedAccesstoken.roleId;
      const path: string = request.route.path;
      const method = request.method as keyof typeof HttpMethod;


      const role = await this.roleService.findRoleAuthById({ roleId, path, method }).catch(() => {
         throw new ForbiddenException()
      });

      const permission = role?.permissions ?? []
      const canAccess = permission.length > 0  // Length array only 1 or 0
      if(!canAccess) {
         throw new ForbiddenException()
      }

      request[REQUEST_ROLE_PERMISSIONS] = role;

      // information route path
      // console.log(request);
   }
}
