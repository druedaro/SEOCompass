import { showSuccessToast, showErrorToast } from './toast';

export interface AsyncOperationOptions<T = unknown> {
  setLoading?: (loading: boolean) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  onSuccess?: (result?: T) => void;
  onError?: (error: Error) => void;
}

export async function handleAsyncOperation<T = unknown>(
  operation: () => Promise<T>,
  options: AsyncOperationOptions<T> = {}
): Promise<boolean> {
  const { setLoading, showSuccessToast: showSuccess = true } = options;
  
  if (setLoading) setLoading(true);
  
  try {
    const result = await operation();
    if (options.successMessage && showSuccess) {
      showSuccessToast(options.successMessage);
    }
    if (options.onSuccess) options.onSuccess(result);
    return true;
  } catch (error: unknown) {
    const err = error as Error;
    const message = options.errorMessage 
      ? `${options.errorMessage}: ${err.message}`
      : err.message;
    showErrorToast(message);
    if (options.onError) options.onError(err);
    return false;
  } finally {
    if (setLoading) setLoading(false);
  }
}
