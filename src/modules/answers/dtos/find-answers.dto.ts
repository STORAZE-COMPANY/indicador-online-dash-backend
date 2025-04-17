import { ApiProperty } from "@nestjs/swagger";
import { Answers } from "../entities/asnwers.entity";

export class AnswersWithQuestion extends Answers {
  @ApiProperty({
    description: "Question",
  })
  question: string;
}
