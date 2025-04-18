import { Module } from "@nestjs/common";

import { ChecklistOnEmployeeService } from "./checklistOnEmployee.service";
import { ChecklistOnEmployeeController } from "./checklistOnEmployee.controller";

@Module({
  controllers: [ChecklistOnEmployeeController],
  providers: [ChecklistOnEmployeeService],
  exports: [ChecklistOnEmployeeService],
})
export class ChecklistOnEmployeeModule {}
