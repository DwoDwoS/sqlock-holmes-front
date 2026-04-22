interface AxiosLikeError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isObject(error)) {
    const axiosError = error as AxiosLikeError;
    const backendMessage = axiosError.response?.data?.message ?? axiosError.response?.data?.error;
    if (backendMessage) return backendMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getErrorStatus = (error: unknown): number | undefined => {
  if (isObject(error)) {
    const axiosError = error as AxiosLikeError;
    return axiosError.response?.status;
  }
  return undefined;
};