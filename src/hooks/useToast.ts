import { ReactNode, useCallback } from "react"

export type ToastProps = {
  variant?: 'default' | 'destructive'
  title?: ReactNode
  description?: ReactNode
}

export function useToast() {
  const toast = useCallback((props: ToastProps) => {
    const prefix = props.variant === 'destructive' ? '❌' : '✓';
    console.log(`${prefix} ${props.title}${props.description ? `: ${props.description}` : ''}`);
  }, []);

  return { toast };
}
