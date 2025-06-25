import { axiosInstance } from '@/helpers/interceptors/api-interceptor';

export const getConnectedEmails = async (email: string) => {
  return await axiosInstance.get(`/api/email/user/${encodeURIComponent(email)}`);
};

