import { axiosInstance } from '@/helpers/interceptors/api-interceptor';

export const getConnectedEmails = async () => {
  return await axiosInstance.get(`/api/email/user`)
    // /${encodeURIComponent(email)}`);
};

export const getFetchedDocumentsPerEmail = async (email: string) =>{
 return axiosInstance.post(`/api/email/documents/${encodeURIComponent(email)}`);
}