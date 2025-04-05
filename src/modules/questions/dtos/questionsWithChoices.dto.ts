import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { choices } from "./choices.dto";
import { QuestionType } from "@modules/checklists/enums/question-type.enum";

export class QuestionsWithChoices {
  @ApiProperty({
    description: "ID da questão",
  })
  id: string;

  @ApiProperty({
    description: "Questão",
  })
  question: string;

  @ApiProperty({
    description: "Tipo de resposta da questão",
    enum: [
      QuestionType.FILE_UPLOAD,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.TEXT,
    ],
  })
  type: QuestionType;

  @ApiProperty({
    description: "Se a questão é obrigatória",
  })
  isRequired: boolean;

  @ApiProperty({
    description: "ID do checklist",
  })
  checkListItem_id: string;

  @ApiProperty({
    description: "Prompt da IA",
    nullable: true,
    type: String,
  })
  IAPrompt: string | null;

  @ApiPropertyOptional({
    description: "Se multipla escolha as question choices",
    type: [choices],
  })
  choices?: choices[];
}
