// src/types/authTypes.ts
export interface User {
  user_id: string;
  username: string;
  public_id: string;
  roles: string[];
  expires_at: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires: string;
}