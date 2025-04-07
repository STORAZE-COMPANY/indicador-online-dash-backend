import { Module } from "@nestjs/common";
import { AppService } from "./app.service";

import { AuthModule } from "@auth/auth.module";
import { CompaniesModule } from "@companies/companies.module";
import { AppController } from "./app.controller";
import { EmployeesModule } from "@modules/employees/employees.module";
import { ChecklistsModule } from "@modules/checklists/checklists.module";
import { RolesModule } from "@modules/roles/roles.module";
import { CategoriesModule } from "@modules/categories/categories.module";
import { QuestionsModule } from "@modules/questions/questions.module";
import { AnswersModule } from "@modules/answers/answers.module";

@Module({
  imports: [
    AuthModule,
    CompaniesModule,
    EmployeesModule,
    ChecklistsModule,
    RolesModule,
    CategoriesModule,
    QuestionsModule,
    AnswersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
