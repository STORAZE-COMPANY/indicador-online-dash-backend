import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcryptjs";
import db from "database/connection";

@Injectable()
export class UsersService {
  async findOne(email: string): Promise<User | undefined> {
    return db<User>("users").where({ email }).first();
  }

  async findById(id: string): Promise<User | undefined> {
    return db<User>("users").where({ id }).first();
  }

  async findAllUsers(): Promise<User | undefined> {
    return db<User>("users").select(
      "id",
      "name",
      "email",
      "role",
      "created_at",
    );
  }

  async create(data: Partial<User>): Promise<User> {
    // Verifica duplicidade de e-mail
    const existing = await db<User>("users")
      .where({ email: data.email })
      .first();
    if (existing) {
      throw new ConflictException("E-mail já está em uso");
    }

    if (!data.name || !data.password || !data.email) {
      throw new InternalServerErrorException("Campos obrigatórios ausentes");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [created] = await db<User>("users")
      .insert({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role ?? "user",
      })
      .returning("*");

    return created;
  }
}
