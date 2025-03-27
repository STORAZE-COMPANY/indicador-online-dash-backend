import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Get(":email")
  async getByEmail(@Param("email") email: string): Promise<User | undefined> {
    return this.usersService.findOne(email);
  }

  @Get()
  async getAllUsers(): Promise<User | undefined> {
    return this.usersService.findAllUsers();
  }
}
