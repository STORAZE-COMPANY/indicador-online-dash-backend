import { Role } from "@shared/enums";

export type EntityToAuth = "employees" | "companies";
export interface SelectByWhereAuth {
  email: string;
  role: string;
}
export interface UserAuth extends userPayload {
  name: string;
}

export interface JWTInfo {
  expiresIn: string;
}
export interface userPayload {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserAuth;
}

export interface TokenProps extends JWTInfo, userPayload {
  name: string;
}
