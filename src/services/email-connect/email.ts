import { axiosInstance } from '@/helpers/interceptors/api-interceptor';

export const getConnectedEmails = async () => {
  return await axiosInstance.get(`/api/email/user`)
    // /${encodeURIComponent(email)}`);
};

