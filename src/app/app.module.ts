import { Module } from "@nestjs/common";
import { AppService } from "./app.service";

import { AuthModule } from "@auth/auth.module";
import { UsersModule } from "@users/users.module";
import { CompaniesModule } from "@companies/companies.module";
import { AppController } from "./app.controller";
import { EmployeesModule } from "@modules/employees/employees.module";
import { ChecklistsModule } from "@modules/checklists/checklists.module";
import { RolesModule } from "@modules/roles/roles.module";
import { CategoriesModule } from "@modules/categories/categories.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CompaniesModule,
    EmployeesModule,
    ChecklistsModule,
    RolesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
