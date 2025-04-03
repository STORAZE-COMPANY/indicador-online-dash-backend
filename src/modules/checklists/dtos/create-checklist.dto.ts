import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import {
  CheckListFieldsProperties,
  CheckListQuestionFieldsProperties,
  QuestionType,
} from "../enums/question-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { BaseMessagesValidations } from "@shared/enums";
import { notBlankRegex } from "@shared/validations/annotationsValidations";

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

export class CategoryDto {
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

export class CheckListQuestionsDto {
  @ApiProperty({
    description: CheckListQuestionFieldsProperties.question,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  question: string;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.type,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    description: CheckListQuestionFieldsProperties.isRequired,
  })
  @IsBoolean()
  isRequired: boolean;
}

export class CreateCheckListDto {
  @ApiProperty({
    description: CheckListFieldsProperties.name,
    example: "Checklist de Segurança",
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  name: string;

  @ApiProperty({
    example: "2023-10-01T00:00:00.000Z",
    description: CheckListFieldsProperties.expiries_in,
  })
  @IsString()
  expiries_in: Date;

  @ApiProperty({
    description: CheckListFieldsProperties.categories_id,
  })
  @IsString()
  @Matches(notBlankRegex, { message: BaseMessagesValidations.notBlank })
  @IsNotEmpty({ message: BaseMessagesValidations.notEmpty })
  categoriesId: string;

  @ApiProperty({
    description: CheckListFieldsProperties.question_list,
    example: [
      {
        question: "Qual é a sua idade?",
        type: QuestionType.TEXT,
        isRequired: true,
        checkList_id: "12345",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckListQuestionsDto)
  question_list: CheckListQuestionsDto[];
}
