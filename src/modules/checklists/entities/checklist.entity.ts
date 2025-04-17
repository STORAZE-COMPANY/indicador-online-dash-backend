import { QuestionType } from "../enums/question-type.enum";

import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDate,
  IsOptional,
} from "class-validator";
import { CheckListFieldsProperties } from "../enums/checkList.enum";
import { Anomalies } from "@shared/enums";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";

export class Question {
  @ApiProperty({
    example: "Qual é a sua idade?",
    description: "Texto da pergunta",
  })
  @IsString()
  questionText: string;

  @ApiProperty({
    example: "multiple-choice",
    description: "Tipo da pergunta",
    enum: ["multiple-choice", "text", "boolean"],
  })
  questionType: QuestionType;

  @ApiProperty({
    example: ["Opção 1", "Opção 2"],
    description: "Opções disponíveis para a pergunta",
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    example: true,
    description: "Define se a pergunta é obrigatória",
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({ example: 1, description: "Posição da pergunta na categoria" })
  @IsNumber()
  position: number;
}

export class CheckList {
  @ApiProperty({ description: CheckListFieldsProperties.id })
  @IsString()
  id: string;
  @ApiProperty({
    description: CheckListFieldsProperties.name,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListFieldsProperties.expiries_in,
  })
  @IsDate()
  expiries_in?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListFieldsProperties.image_expiries_in,
  })
  @IsDate()
  images_expiries_in?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListFieldsProperties.created_at,
  })
  @IsDate()
  created_at?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: CheckListFieldsProperties.updated_at,
  })
  @IsDate()
  updated_at?: Date;
}
export class CheckListQuestions {
  @IsString()
  id: string;
  @IsString()
  question: string;

  @IsString()
  type: string;

  @IsBoolean()
  isRequired: boolean;

  @IsString()
  checkList_id: string;

  @IsString()
  @IsOptional()
  IAPrompt: string | null;

  @IsNonBlankString({ isOptional: false })
  categories_id: string;
}
export class CheckListMultipleChoice {
  @IsString()
  choice: string;

  @IsBoolean()
  anomalyStatus: Anomalies | null;

  @IsString()
  question_id: string;
}
