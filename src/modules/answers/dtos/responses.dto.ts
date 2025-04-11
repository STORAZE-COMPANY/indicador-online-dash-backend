import { ApiProperty } from "@nestjs/swagger";
import { choices } from "@modules/questions/dtos/choices.dto";
import { AnswerFieldsProperties } from "../enums";
import { Anomalies } from "@shared/enums";
import { AnswerChoice } from "../entities/asnwers.entity";

export class AnswerWithCheckList {
  @ApiProperty({
    description: "Resposta da pergunta",
  })
  answer?: string;

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

export class MultipleChoiceAnswers extends AnswerChoice {
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

  @ApiProperty({ description: "Lista de opções de resposta" })
  choice: choices;
}

export class AnswersWithQuestions {
  @ApiProperty({
    description: AnswerFieldsProperties.id,
  })
  id: string;

  @ApiProperty({
    description: "Questão vinculada a resposta",
  })
  question: string;

  @ApiProperty({
    description: "Resposta da pergunta",
  })
  answer: string;

  @ApiProperty({
    description: AnswerFieldsProperties.question_id,
  })
  question_id: string;

  @ApiProperty({
    description: "Nome da empresa vinculada a quem respondeu",
  })
  companyName: string;

  @ApiProperty({
    description: "Nome do empregado que respondeu",
  })
  employeeName: string;

  @ApiProperty({
    description: "Data de criação da resposta",
  })
  created_at: string; // ou Date, se preferir

  @ApiProperty({
    description: "Data de atualização da resposta",
  })
  updated_at: string; // ou Date, se preferir

  @ApiProperty({
    description: AnswerFieldsProperties.employee_id,
  })
  employee_id: number;

  @ApiProperty({
    description: AnswerFieldsProperties.anomalyStatus,
    enum: Anomalies,
  })
  anomalyStatus?: Anomalies | null; // nem todos têm esse campo

  @ApiProperty({ description: "Se teve anomalia na resposta ou não" })
  hasAnomaly: boolean;
}
