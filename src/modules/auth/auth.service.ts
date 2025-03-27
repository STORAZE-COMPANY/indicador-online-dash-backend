import { User } from "@modules/users/entities/user.entity";
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import db from "database/connection";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await db<User>("users").where({ email }).first();

    if (!user) throw new UnauthorizedException("Usuário não encontrado");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException("Senha incorreta");

    return {
      id: user.id,
      email: user.email,
      role: user.role ?? "user",
    };
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
