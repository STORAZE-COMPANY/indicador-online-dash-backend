/* eslint-disable @typescript-eslint/require-await */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users = [
    {
      id: 1,
      email: "admin@admin.com",
      password: bcrypt.hashSync("123456", 10),
      role: "admin",
    },
  ];

  async validateUser(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) throw new UnauthorizedException("Usuário não encontrado");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException("Senha incorreta");

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
