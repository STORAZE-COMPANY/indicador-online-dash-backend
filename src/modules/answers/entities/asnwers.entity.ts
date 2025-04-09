import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AnswerChoiceFieldsProperties, AnswerFieldsProperties } from "../enums";
import { Anomalies } from "@shared/enums";

export class Answers {
  @ApiProperty({
    description: AnswerFieldsProperties.id,
  })
  id: string;

  @ApiPropertyOptional({
    description: AnswerFieldsProperties.textAnswer,
  })
  textAnswer?: string;
  @ApiPropertyOptional({
    description: AnswerFieldsProperties.imageAnswer,
  })
  imageAnswer?: string;
  @ApiProperty({
    description: AnswerFieldsProperties.question_id,
  })
  question_id: string;
  @ApiProperty({
    description: AnswerFieldsProperties.employee_id,
  })
  employee_id: number;
  @ApiProperty({
    description: AnswerFieldsProperties.anomalyStatus,
  })
  anomalyStatus?: Anomalies;
}

export class AnswerChoice {
  @ApiProperty({
    description: AnswerChoiceFieldsProperties.id,
  })
  id: string;

  @ApiProperty({
    description: AnswerChoiceFieldsProperties.choice_id,
  })
  choice_id: string;

  @ApiProperty({
    description: AnswerChoiceFieldsProperties.employee_id,
  })
  employee_id: number;

  @ApiProperty({
    description: AnswerChoiceFieldsProperties.created_at,
  })
  created_at: Date;

  @ApiProperty({
    description: AnswerChoiceFieldsProperties.updated_at,
  })
  updated_at: Date;
}
