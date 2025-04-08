import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AnswerFieldsProperties } from "../enums";
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
