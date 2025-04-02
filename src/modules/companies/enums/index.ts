export enum CompaniesResponseMessages {
  notFound = "Empresa não encontrada",
  cnpjAlreadyExists = "CNPJ já cadastrado",

  welcome = "Bem-vindo!",
  yourPassword = "Sua senha é: ",
}

export enum CompaniesFieldsProperties {
  id = "ID da empresa",
  name = "Nome da empresa",
  email = "Email da empresa",
  cnpj = "CNPJ da empresa",
  isActive = "Se a empresa está ativa",
  checklistIds = "IDs dos checklists associados à empresa",
  created_at = "Data de criação da empresa",
  updated_at = "Última atualização da empresa",

  role = "Id do Nível de acesso da empresa",

  password = "Senha da empresa",
}
