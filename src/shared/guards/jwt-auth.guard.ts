import { AuthGuard } from "@nestjs/passport";
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * Guarda de autenticação JWT que estende a funcionalidade do AuthGuard padrão do NestJS.
 *
 * @class JwtAuthGuard
 * @extends {AuthGuard("jwt")}
 *
 * @method canActivate
 * Sobrescreve o método `canActivate` para delegar a lógica de ativação ao AuthGuard base.
 *
 * @method handleRequest
 * Manipula a validação do usuário autenticado. Lança uma exceção do tipo `UnauthorizedException`
 * caso ocorra um erro ou o usuário não esteja autenticado.
 *
 * @param {any} err - Erro ocorrido durante a autenticação, se houver.
 * @param {any} user - Objeto do usuário autenticado, se disponível.
 * @returns {any} O objeto do usuário autenticado, caso a autenticação seja bem-sucedida.
 *
 * @throws {UnauthorizedException} Caso o usuário não esteja autenticado ou ocorra um erro.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException("Usuário não autenticado. handleRequest");
    }

    // O usuário agora está no request!
    return user;
  }
}
