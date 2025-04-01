import { AuthGuard } from "@nestjs/passport";
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { BaseMessages } from "@shared/enums";

/**
 * @class JwtAuthGuard
 * @extends AuthGuard
 *
 * @description
 * Guarda personalizada que estende a funcionalidade do `AuthGuard` padrão do NestJS
 * para autenticação JWT. Esta guarda verifica se o usuário está autenticado
 * e lança uma exceção personalizada caso a autenticação falhe.
 *
 * @method canActivate
 * Sobrescreve o método `canActivate` para delegar a lógica de ativação ao `AuthGuard` base.
 *
 * @method handleRequest
 * Manipula a lógica de validação do usuário autenticado. Caso ocorra um erro ou o usuário
 * não seja válido, lança uma exceção de autorização não permitida com uma mensagem personalizada.
 *
 * @template UserAuth
 * Tipo genérico que representa o usuário autenticado.
 *
 * @param err - Exceção de autorização não permitida, caso ocorra.
 * @param user - Objeto do usuário autenticado.
 *
 * @throws {UnauthorizedException}
 * Lança uma exceção caso o usuário não seja válido ou ocorra um erro durante a autenticação.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<UserAuth>(
    err: UnauthorizedException,
    user: UserAuth,
  ): UserAuth {
    if (err || !user) {
      throw new UnauthorizedException(BaseMessages.unAuthorizedUser);
    }

    return user;
  }
}
