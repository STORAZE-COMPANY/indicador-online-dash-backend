import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcryptjs";
import db from "database/connection";
import { UserResponseMessages } from "./enums";

@Injectable()
export class UsersService {
  async findOne(email: string): Promise<User> {
    const user = await db<User>("users").where({ email }).first();
    if (!user) throw new NotFoundException(UserResponseMessages.notFound);
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return db<User>("users").where({ id }).first();
  }

  async findAllUsers(): Promise<User[]> {
    return db<User>("users").select(
      "id",
      "name",
      "email",
      "role",
      "created_at",
    );
  }

  async create(data: User): Promise<User> {
    // Verifica duplicidade de e-mail
    const existing = await db<User>("users")
      .where({ email: data.email })
      .first();
    if (existing) {
      throw new ConflictException(UserResponseMessages.emailAlreadyExists);
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
