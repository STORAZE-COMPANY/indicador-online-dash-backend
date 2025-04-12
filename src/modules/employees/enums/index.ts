export enum EmployeesResponseMessages {
  notFound = "Funcionário não encontrado",

  created = "Funcionário criado com sucesso",

  welcome = "Bem-vindo ao sistema",

  yourPassword = "Sua senha é: ",
}

export enum EmployeesFieldsProperties {
  id = "Id do funcionário",
  name = "Nome do funcionário",
  email = "Email do funcionário",
  phone = "Telefone do funcionário",
  company_id = "ID da empresa do funcionário",
  password = "Senha do funcionário",
  roleId = "Id do nível do funcionário",

  questionId = "ID da pergunta do funcionário",

  isActive = "Status do funcionário",
}

export enum EmployeesFields {
  tableName = "employees",
  id = "id",
  name = "name",
  email = "email",
  phone = "phone",
  company_id = "company_id",
  password = "password",
  roleId = "role_id",

  questionId = "questionId",
}
