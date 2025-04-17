import { ApiProperty } from "@nestjs/swagger";

class Company {
  @ApiProperty({
    description: "ID da empresa",
  })
  id: string;

  @ApiProperty({
    description: "Nome da empresa",
  })
  name: string;

  @ApiProperty({
    description: "ID do checklist associado à empresa",
  })
  checklistItemId: string;
  @ApiProperty({
    description: "ID da categoria do checklist",
  })
  categories_id: string;

  @ApiProperty({
    description: "Indica se o checklist possui anomalias",
  })
  hasAnomalies: boolean;
}

export class GroupedCheckList {
  @ApiProperty({
    description: "ID do checklist",
  })
  id: string;

  @ApiProperty({
    description: "Nome do checklist",
  })
  name: string;

  @ApiProperty({
    description: "Lista de empresas associadas ao checklist",
    type: () => [Company],
    example: [
      {
        id: "1",
        name: "Empresa A",
        checklistItemId: "101",
      },
      {
        id: "2",
        name: "Empresa B",
        checklistItemId: "102",
      },
    ],
  })
  companies: Company[];
}
