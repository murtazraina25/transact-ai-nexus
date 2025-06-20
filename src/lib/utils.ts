import { TIMERS } from "@/helpers/constants/timers";
import { ErrorData } from "@/types/models/error";
import { clsx, type ClassValue } from "clsx"
import { NavigateFunction } from "react-router-dom";
import { toast } from '@/components/ui/use-toast';
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const globalRouter = { navigate: null } as {
  navigate: null | NavigateFunction;
};

const toastConfig = {
  duration: TIMERS.TOASTER_DELAY,
};

export const notifyError = (errorData?: ErrorData) => {
  toast({
    ...toastConfig,
    description:
      errorData?.errorList?.toString() ||
      errorData?.message ||
      'Something went wrong. Please try again later',
    variant: 'destructive',
  });
};

export const notifySuccess = (message: string) => {
  toast({
    ...toastConfig,
    description: message,
    variant: 'success',
  });
};