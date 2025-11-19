import { Badge } from '@/components/atoms/Badge';
import { PRIORITY_CONFIG } from '@/constants/tasks';
import type { PriorityBadgeProps } from '@/types/componentTypes';

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
}
