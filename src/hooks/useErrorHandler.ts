import { useToast } from '@/hooks/useToast';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = (error: unknown, fallbackMsg = 'An error occurred') => {
    const message = error instanceof Error ? error.message : fallbackMsg;
    
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });

    if (import.meta.env.DEV) {
      console.error('[DEV Error]:', error);
    }
  };

  return { handleError };
}
