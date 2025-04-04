import { Module } from "@nestjs/common";
import { QuestionsService } from "@modules/questions/questions.service";
import { QuestionsController } from "./questions.controller";

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
