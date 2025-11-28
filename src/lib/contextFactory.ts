import { useContext, Context } from 'react';

export function createContextHook<T>(
  context: Context<T | undefined>,
  hookName: string,
  providerName: string
) {
  return function useCustomContext() {
    const ctx = useContext(context);
    
    if (ctx === undefined) {
      throw new Error(`${hookName} must be used within a ${providerName}`);
    }
    
    return ctx;
  };
}
