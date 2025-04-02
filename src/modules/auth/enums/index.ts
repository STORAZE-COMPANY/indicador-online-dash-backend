export enum AuthResponseMessages {
  userNotFound = "Usuário não encontrado",

  passwordIncorrect = "Senha incorreta",

  requiredFields = "Campos obrigatórios ausentes",

  userAuth = "Usuário autenticado",

  loginResponse = "Resposta de autenticação. Contém token de acesso, token de atualização e dados do usuário autenticado.",

  refreshTokenResponse = "Token de autenticação atualizado",
}

export enum AuthRoutes {
  baseUrl = "auth",

  refreshTokenUrl = "refreshToken",
  loginUrl = "login",
  userAuthUrl = "userAuth",
}

export enum AuthFieldsProperties {
  email = "Email do usuário",
  password = "Senha do usuário",
  userId = "ID do usuário",
}
