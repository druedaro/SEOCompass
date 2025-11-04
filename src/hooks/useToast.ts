import * as React from "react"

export type ToastProps = {
  variant?: 'default' | 'destructive'
  title?: React.ReactNode
  description?: React.ReactNode
}

/**
 * Simple toast implementation
 * For now, uses console.log - can be replaced with a proper toast library later
 */
export function useToast() {
  const toast = React.useCallback((props: ToastProps) => {
    const prefix = props.variant === 'destructive' ? '❌' : '✓';
    console.log(`${prefix} ${props.title}${props.description ? `: ${props.description}` : ''}`);
    
    // You can replace this with a proper toast notification library
    // like react-hot-toast or sonner in the future
  }, []);

  return { toast };
}
