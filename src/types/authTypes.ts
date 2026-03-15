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

export interface Session {
  id: string;
  username: string;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}