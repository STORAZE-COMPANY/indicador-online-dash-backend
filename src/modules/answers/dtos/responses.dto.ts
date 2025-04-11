import { ApiProperty } from "@nestjs/swagger";
import { Answers } from "../entities/asnwers.entity";

export class AnswerWithCheckList extends Answers {
  @ApiProperty({
    description: "A questão vinculada a resposta",
  })
  question: string;

  @ApiProperty({ description: "Se teve anomalia na resposta ou não" })
  hasAnomaly: boolean;
  @ApiProperty({ description: "Nome da empresa vinculada a quem respondeu" })
  companyName: string;
  @ApiProperty({ description: "Nome do empregado que respondeu" })
  employeeName: string;
}
