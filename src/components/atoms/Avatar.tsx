import { cn } from '@/lib/utils';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors',
        className
      )}
    >
      {children}
    </div>
  );
}
