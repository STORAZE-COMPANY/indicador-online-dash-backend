export enum ApiSwaggerDescription {
  title = "Indicador Online API",
  description = "Documentação da API usando Swagger",
  version = "1.0",
}

export enum BaseMessages {
  notFound = "Registro não encontrado",
  alreadyExists = "Registro já cadastrado",
  requiredFields = "Campos obrigatórios ausentes",
  emailAlreadyExists = "E-mail já cadastrado",

  notEmpty = "O campo não pode ser vazio",
  unAuthorizedUser = "Usuário não autenticado",

  invalidToken = "Token inválido",
}

export enum smtpMessages {
  emailSent = "Email enviado com sucesso",
  emailNotSent = "Falha ao enviar email",
  welcome = "Bem-vindo!",
  yourPassword = "Sua senha é: ",
}

export enum BaseMessagesValidations {
  phoneRegex = "O telefone deve conter exatamente 11 dígitos numéricos (sem pontos, barras ou outros caracteres especiais).",

  withoutSpecialCharacters = "O campo não pode conter caracteres especiais",
  notBlank = "O campo não pode conter apenas espaços",

  notEmpty = "O campo não pode ser vazio",

  isNumber = "O campo deve ser um número",

  notNegative = "O campo não pode ser negativo",
}

export enum BasePaginatedParams {
  limit = "Limite de registros por página",
  page = "Página de registros",
  query = "Query de busca",
}

export enum Role {
  admin = "admin",
  superAdmin = "superAdmin",

  user = "user",
}
