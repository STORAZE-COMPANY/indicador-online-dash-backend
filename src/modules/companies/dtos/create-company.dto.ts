import { IsString, IsBoolean } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsBoolean()
  isActive: boolean;
}
