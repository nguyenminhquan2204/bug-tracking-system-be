import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AccessTokenGuard } from "../guards/access-token.guard";
import { AuthType, ConditionGuard } from "../../constants/auth.constant";
import { AuthTypeDecoratorPayload, AUTH_TYPE_KEY } from "../decorators/auth.decorator";

@Injectable()
export class AuthenticationGuard implements CanActivate {
   private readonly authTypeGuardMap: Record<string, CanActivate>;

   constructor(
      private readonly reflector: Reflector,
      private readonly accessTokenGuard: AccessTokenGuard,
   ) {
      this.authTypeGuardMap = {
         [AuthType.Bearer]: this.accessTokenGuard,
         [AuthType.None]: { canActivate: () => true },
      };
   }

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const authTypeValue = this.getAuthTypeValue(context);
      const guards = authTypeValue.authTypes.map(((authType) => this.authTypeGuardMap[authType]));

      return authTypeValue.options.condition === ConditionGuard.AND ? this.handleAndCondition(guards, context) : this.handleOrOptions(guards, context);
   }

   private getAuthTypeValue(context: ExecutionContext): AuthTypeDecoratorPayload {
      const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
         context.getHandler(),
         context.getClass()
      ]) ?? { authTypes: [AuthType.Bearer], options: { condition: ConditionGuard.AND }}
      return authTypeValue;
   }

   private async handleOrOptions(guards: CanActivate[], context: ExecutionContext) {
      let lastError: any = null;

      // Duyệt qua hết các guard, nếu có 1 guard pass return true
      for(const guard of guards) {
         try {
            if(await guard.canActivate(context)) {
               return true
            }
         } catch (error) {
            lastError = error;
         }
      }

      if(lastError instanceof HttpException) {
         throw lastError;
      }
      throw new UnauthorizedException();
   }

   private async handleAndCondition(guards: CanActivate[], context: ExecutionContext) {
      // Duyệt qua hết các guard, nếu có 1 guard ko pass return false
      for(const guard of guards) {
         try {
            if(!(await guard.canActivate(context))) {
               throw new UnauthorizedException()
            }
         } catch (error) {
            if(error instanceof HttpException) throw error;
            throw new UnauthorizedException()
         }
      }
      return true;
   }
}