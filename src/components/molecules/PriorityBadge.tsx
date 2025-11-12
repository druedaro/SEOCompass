import { Badge } from '@/components/atoms/Badge';
import { TaskPriority } from '@/services/taskService';
import { PRIORITY_CONFIG } from '@/constants/tasks';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
}
