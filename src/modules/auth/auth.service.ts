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
import { AuthResponse, TokenProps, userPayload } from "./interface";

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
    });

    const refresh_token = this.generateJwtToken({
      email: user.email,
      id: user.id,
      expiresIn: "7d",
      role: user.role ?? "user",
    });

    return {
      access_token,
      refresh_token,
      user: this.buildUserAuth(user),
    };
  }

  generateJwtToken(tokenInfos: TokenProps) {
    const payload = {
      sub: tokenInfos.id,
      email: tokenInfos.email,
      role: tokenInfos.role,
    };
    return this.jwtService.sign(payload, {
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
