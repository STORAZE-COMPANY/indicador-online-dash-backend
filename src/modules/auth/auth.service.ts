import { User } from "@modules/users/entities/user.entity";
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import db from "database/connection";
import { AuthResponseMessages } from "./enums";
import { AuthResponse, TokenProps, UserAuth, userPayload } from "./interface";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<AuthResponse> {
    const user = await db<User>("users")
      .where({ email })
      .first()
      .select("id", "name", "email", "password", "role");

    if (!user) throw new NotFoundException(AuthResponseMessages.userNotFound);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new ForbiddenException(AuthResponseMessages.passwordIncorrect);

    const access_token = this.generateJwtToken({
      email: user.email,
      id: user.id,
      role: user.role ?? "user",
      expiresIn: "1d",
      name: user.name,
    });

    const refresh_token = this.generateJwtToken({
      email: user.email,
      id: user.id,
      expiresIn: "7d",
      role: user.role ?? "user",
      name: user.name,
    });

    return {
      access_token,
      refresh_token,
      user: this.buildUserAuth(user),
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const user = this.jwtService.verify<UserAuth>(refreshToken);
    const userExist = await db<User>("users")
      .where({ email: user.email })
      .first()
      .select("id", "name", "email", "password", "role");
    if (!userExist)
      throw new NotFoundException(AuthResponseMessages.userNotFound);

    const access_token = this.generateJwtToken({
      email: userExist.email,
      id: userExist.id,
      role: userExist.role,
      expiresIn: "1d",
      name: userExist.name,
    });

    const refresh_token = this.generateJwtToken({
      email: userExist.email,
      id: userExist.id,
      role: userExist.role,
      expiresIn: "7d",
      name: userExist.name,
    });

    return {
      access_token,
      refresh_token,
      user: this.buildUserAuth(userExist),
    };
  }

  async findAuthUser(id: string): Promise<UserAuth> {
    const user = await db<User>("users")
      .where({ id })
      .first()
      .select("id", "name", "email", "role");
    if (!user) throw new NotFoundException(AuthResponseMessages.userNotFound);
    return user;
  }

  generateJwtToken(tokenInfos: TokenProps) {
    const user: UserAuth = {
      id: tokenInfos.id,
      email: tokenInfos.email,
      role: tokenInfos.role,
      name: tokenInfos.name,
    };
    return this.jwtService.sign(user, {
      expiresIn: "1d",
    });
  }

  buildUserAuth(user: User): userPayload & { name: string } {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
