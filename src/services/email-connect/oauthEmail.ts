import { axiosInstance } from '@/helpers/interceptors/api-interceptor';
import { API_END_POINTS } from '@/helpers/constants/apiEndpoints';
import { OAuthEmailPayload } from '@/types/models/email';

export const  connectOAuthEmail = (payload: OAuthEmailPayload) => {
  return axiosInstance.post(API_END_POINTS.connectOAuthEmail, payload);
};


export const syncOauthEmailNow = (email: string) => {
  return axiosInstance.post(`/api/sync/oauth/${encodeURIComponent(email)}`);
};
