import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { QuestionType } from "../enums/question-type.enum";
import { ApiProperty } from "@nestjs/swagger";

class QuestionDto {
  @IsString()
  @ApiProperty({
    example: "Qual é a sua idade?",
    description: "Texto da pergunta",
  })
  questionText: string;

  @IsEnum(QuestionType)
  @ApiProperty({
    example: "multiple-choice",
    description: "Tipo da pergunta",
    enum: [
      QuestionType.FILE_UPLOAD,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.TEXT,
    ],
  })
  questionType: QuestionType;

  @IsArray()
  @ApiProperty({ type: [String], description: "Opções da pergunta" })
  options: string[];

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: "Indica se a pergunta é obrigatória",
  })
  isRequired: boolean;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: "Posição da pergunta",
  })
  position: number;
}

class CategoryDto {
  @IsString()
  @ApiProperty({
    example: "Categoria de Segurança",
    description: "Nome da categoria",
  })
  categoryName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ApiProperty({
    type: [QuestionDto],
    description: "Lista de perguntas dentro da categoria",
  })
  questions: QuestionDto[];
}

export class CreateChecklistDto {
  @IsString()
  @ApiProperty({
    example: "Checklist de Segurança",
    description: "Nome do checklist",
  })
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @ApiProperty({
    type: [CategoryDto],
    description: "Lista de categorias do checklist",
  })
  categories: CategoryDto[];
}
