import { Badge } from '@/components/atoms/Badge';
import { TaskPriority } from '@/services/taskService';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    variant: 'secondary' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  medium: {
    label: 'Medium',
    variant: 'default' as const,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  high: {
    label: 'High',
    variant: 'default' as const,
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
  urgent: {
    label: 'Urgent',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
};

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
}
