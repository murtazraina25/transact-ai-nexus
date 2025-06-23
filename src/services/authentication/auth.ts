import { dispatchAction } from '@/state-management/store';
import { API_END_POINTS } from '@/helpers/constants/apiEndpoints';
import { setCredentials } from '@/state-management/auth/authSlice';
import { axiosInstance } from '@/helpers/interceptors/api-interceptor';
import { LoginFormData, OAuthSignInData, SignUpFormData } from '@/types/models/auth';

export const LogIn = async (loginFormData: LoginFormData) => {
  const loginResponse = await axiosInstance.post(API_END_POINTS.login, loginFormData);
  const authDetails = {
    email: loginResponse.data.email,
    role: loginResponse.data.role,
  };
  dispatchAction(setCredentials(authDetails));
  return authDetails;
};

export const signUp = (signUpFormData: SignUpFormData) => {
  return axiosInstance.post(API_END_POINTS.signup, signUpFormData);
};

export const signOut = () => {
  return axiosInstance.post(API_END_POINTS.logout);
}


export const oAuthSignIn = async (oAuthDataSignin:OAuthSignInData) => {
  const response = await axiosInstance.post(API_END_POINTS.oauthSignIn,oAuthDataSignin);
  const authDetails = {
    email: response.data.email,
    role: response.data.role,
  };
  dispatchAction(setCredentials(authDetails));
  return authDetails;
}