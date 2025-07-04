import { axiosInstance } from '@/helpers/interceptors/api-interceptor';
import { API_END_POINTS } from '@/helpers/constants/apiEndpoints';
import { CustomEmailPayload, SyncSettingsPayload } from '@/types/models/email';

export const connectCustomEmail = (payload: CustomEmailPayload) => {
  return axiosInstance.post(API_END_POINTS.connectCustomEmail, payload);
};

export const configureEmailSync = (payload: SyncSettingsPayload) => {
  return axiosInstance.post(API_END_POINTS.configureEmailSync, payload);
};

export const syncCustomEmailNow = (email: string) => {
  return axiosInstance.post(`/api/sync/run/${encodeURIComponent(email)}`);
};
