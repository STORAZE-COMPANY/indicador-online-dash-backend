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

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    id: string;
    email: string;
    role: string;
  }> {
    const user = await db<User>("users").where({ email }).first();

    if (!user) throw new NotFoundException(AuthResponseMessages.userNotFound);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new ForbiddenException(AuthResponseMessages.passwordIncorrect);

    return {
      id: user.id,
      email: user.email,
      role: user.role ?? "user",
    };
  }

  login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
