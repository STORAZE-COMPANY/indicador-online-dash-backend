export enum CompaniesResponseMessages {
  notFound = "Empresa não encontrada",
  cnpjAlreadyExists = "CNPJ já cadastrado",

  welcome = "Bem-vindo!",
  yourPassword = "Sua senha é: ",
}

export enum CompaniesFieldsProperties {
  tableName = "companies",
  id = "ID da empresa",
  name = "Nome da empresa",
  email = "Email da empresa",
  cnpj = "CNPJ da empresa",
  isActive = "Se a empresa está ativa",
  created_at = "Data de criação da empresa",
  updated_at = "Última atualização da empresa",

  checkListItem_id = "ID do item de checklist",

  role = "Id do Nível de acesso da empresa",

  password = "Senha da empresa",
}
