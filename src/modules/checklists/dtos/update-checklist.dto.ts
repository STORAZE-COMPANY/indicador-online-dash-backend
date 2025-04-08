import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { QuestionType } from "../enums/question-type.enum";
import { IsNonBlankString } from "@shared/validations/annotationsValidations/customDecorators";
import { CheckListItemFieldsProperties } from "../enums/checkListItem.enum";
import { CheckListFieldsProperties } from "../enums/checkList.enum";

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
export class UpdateChecklistDto {
  @IsString()
  @ApiProperty({
    example: "Checklist de Segurança",
    description: "Nome do checklist",
  })
  @Optional()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @ApiProperty({
    type: [CategoryDto],
    description: "Lista de categorias do checklist",
  })
  @Optional()
  categories: CategoryDto[];
}

export class UpdateCompanyRelated {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: "ID da empresa",
  })
  companyId: number;

  @IsNonBlankString({ isOptional: false })
  @ApiProperty({
    description: CheckListItemFieldsProperties.id,
  })
  checkListItemId: string;
}
export class updateExpiriesTime {
  @ApiProperty({
    example: 1,
    description: CheckListFieldsProperties.expiries_in,
  })
  @IsNonBlankString({ isOptional: false })
  expiriesTime: string;

  @IsNonBlankString({ isOptional: false })
  @ApiProperty({
    description: CheckListItemFieldsProperties.id,
  })
  checkListId: string;
}
