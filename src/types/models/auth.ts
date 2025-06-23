export interface AuthState {
  role: string;
  email: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  username: string;
  password: string;
}

export interface ResetPasswordRequestData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface OAuthSignInData {
  provider: string;
  code: string;
}