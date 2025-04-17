import { ApiProperty } from "@nestjs/swagger";
import { CheckList, CheckListQuestions } from "../entities/checklist.entity";
import { Question } from "@modules/questions/entities/question.entity";

export class CheckListDto extends CheckList {
  @ApiProperty({
    isArray: true,
    type: () => [CheckListQuestions],
  })
  questions: Question[];
}
