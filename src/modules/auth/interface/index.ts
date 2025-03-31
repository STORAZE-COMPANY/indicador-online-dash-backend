export interface JWTInfo {
  expiresIn: string;
}
export interface userPayload {
  id: string;
  email: string;
  role?: string;
}
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: userPayload & { name: string };
}

export interface TokenProps extends JWTInfo, userPayload {}
