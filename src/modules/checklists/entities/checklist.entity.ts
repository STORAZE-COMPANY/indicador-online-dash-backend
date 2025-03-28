import { QuestionType } from "../enums/question-type.enum";

import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

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

export class Category {
  @ApiProperty({
    example: "Categoria de Segurança",
    description: "Nome da categoria",
  })
  @IsString()
  categoryName: string;

  @ApiProperty({
    type: [Question],
    description: "Lista de perguntas dentro da categoria",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];
}

export class Checklist {
  @ApiProperty({ example: 1, description: "ID único do checklist" })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "Checklist de Segurança",
    description: "Nome do checklist",
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: [Category],
    description: "Lista de categorias dentro do checklist",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: "Data de criação",
    required: false,
  })
  created_at?: Date;

  @ApiProperty({
    example: "2024-03-27T12:00:00Z",
    description: "Última atualização",
    required: false,
  })
  updated_at?: Date;
}
