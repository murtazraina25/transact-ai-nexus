import axios, { AxiosError, AxiosResponse } from 'axios';

import { globalRouter } from '@/lib/utils';
import environment from '@/environments/environments';
import { ErrorData } from '@/types/models/error';
import { TOASTER_MESSAGES } from '../constants/messages';
import { removeLoggedInUser } from '@/state-management/store';

export const axiosInstance = axios.create({
  baseURL: environment.baseURL,
  withCredentials: true
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ errors: string[]; error?: string }>) => {
    if (!error.response) {
        return Promise.reject({
          errorList: [],
          statusCode: null,
          message: "Network error. Please try again.",
        });
    }

    const statusCode = error.response?.status;
    const message = error.response?.data?.error;
    const errorList = error.response?.data?.errors;

    const errorData: ErrorData = {
      errorList: errorList || [],
      statusCode: statusCode || null,
      message: message || error.message,
    };

    if (statusCode === 401 && globalRouter.navigate) {
      removeLoggedInUser();
      errorData.message = TOASTER_MESSAGES.UNAUTHORIZED;
      globalRouter?.navigate('/');
    }

    return Promise.reject(errorData);
  }
);