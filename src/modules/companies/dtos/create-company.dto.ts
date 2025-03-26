import { IsString, IsBoolean, IsArray, IsNumber } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  checklistIds: number[];
}
