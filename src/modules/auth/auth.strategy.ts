import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserAuth } from "./interface";
export interface CustomRequest extends Request {
  user?: UserAuth;
}

/**
 * Estratégia de autenticação utilizando JWT (JSON Web Token).
 *
 * Esta classe é uma extensão da estratégia Passport para autenticação
 * baseada em tokens JWT. Ela utiliza o cabeçalho `Authorization` com o
 * formato `Bearer <token>` para extrair o token JWT da requisição.
 *
 * @class AuthStrategy
 * @extends {PassportStrategy(Strategy)}
 *
 * @constructor
 * - Configura a estratégia com as seguintes opções:
 *   - `jwtFromRequest`: Extrai o token JWT do cabeçalho de autorização.
 *   - `ignoreExpiration`: Define se a expiração do token deve ser ignorada (false por padrão).
 *   - `passReqToCallback`: Passa o objeto da requisição para o método de validação.
 *   - `secretOrKey`: Define a chave secreta usada para validar o token JWT, obtida da variável de ambiente `JWT_SECRET`.
 *
 * @method validate
 * - Valida o payload do token JWT.
 * - Adiciona o payload do usuário ao objeto da requisição (`req.user`).
 * - Lança uma exceção `UnauthorizedException` se o payload for inválido.
 *
 * @param {CustomRequest} req - Objeto da requisição HTTP.
 * @param {UserAuth} payload - Payload decodificado do token JWT.
 * @returns {UserAuth} - Retorna o payload do usuário autenticado.
 *
 * @throws {UnauthorizedException} - Caso o token seja inválido ou o payload não esteja presente.
 */
@Injectable()
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(req: CustomRequest, payload: UserAuth): UserAuth {
    if (!payload) {
      throw new UnauthorizedException("Token inválido");
    }
    req.user = payload;
    return payload;
  }
}
