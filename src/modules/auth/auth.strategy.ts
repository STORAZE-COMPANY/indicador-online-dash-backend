import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserAuth } from "./interface";
import { BaseMessages } from "@shared/enums";
export interface CustomRequest extends Request {
  user?: UserAuth;
}

/**
 * Estratégia de autenticação personalizada utilizando o Passport.js com JWT.
 *
 * @class AuthStrategy
 * @extends {PassportStrategy<typeof Strategy, UserAuth>}
 *
 * @description
 * Esta classe implementa uma estratégia de autenticação baseada em JWT (JSON Web Token).
 * Ela utiliza o token fornecido no cabeçalho de autorização (Bearer Token) para validar
 * e autenticar o usuário.
 *
 * @constructor
 * - Configura a estratégia com as seguintes opções:
 *   - `jwtFromRequest`: Extrai o token JWT do cabeçalho de autorização.
 *   - `ignoreExpiration`: Define se a expiração do token deve ser ignorada (false por padrão).
 *   - `passReqToCallback`: Passa o objeto da requisição para o callback de validação.
 *   - `secretOrKey`: Define a chave secreta usada para validar o token JWT.
 *
 * @method validate
 * - Valida o payload do token JWT.
 * - Adiciona o usuário autenticado ao objeto da requisição.
 * - Lança uma exceção `UnauthorizedException` se o payload for inválido.
 *
 * @param {CustomRequest} req - Objeto da requisição HTTP.
 * @param {UserAuth} payload - Payload decodificado do token JWT.
 * @returns {UserAuth} - Retorna o payload do usuário autenticado.
 *
 * @throws {UnauthorizedException} - Caso o token seja inválido ou o payload esteja ausente.
 */
@Injectable()
export class AuthStrategy extends PassportStrategy<typeof Strategy, UserAuth>(
  Strategy,
  "jwt",
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET || "storaze-secret",
    });
  }

  validate(req: CustomRequest, payload: UserAuth): UserAuth {
    if (!payload) {
      throw new UnauthorizedException(BaseMessages.invalidToken);
    }
    req.user = payload;
    return payload;
  }
}
