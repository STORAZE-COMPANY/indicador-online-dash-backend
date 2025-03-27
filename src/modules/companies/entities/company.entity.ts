export class Company {
  id: number;
  name: string;
  cnpj: string;
  isActive: boolean;
  checklistIds: number[];
  created_at?: Date;
  updated_at?: Date;
}
