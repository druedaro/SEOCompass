import { Badge } from './Badge';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type BadgeConfig = {
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
};

const SEVERITY_CONFIG: Record<string, BadgeConfig> = {
  critical: {
    variant: 'destructive',
    icon: AlertCircle,
    label: 'Critical',
  },
  warning: {
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800',
    icon: AlertTriangle,
    label: 'Warning',
  },
  info: {
    variant: 'outline',
    icon: Info,
    label: 'Info',
  },
};

const SCORE_CONFIG = (score: number): BadgeConfig => {
  if (score >= 90) return { variant: 'default', className: 'bg-green-500 text-white' };
  if (score >= 80) return { variant: 'default', className: 'bg-blue-500 text-white' };
  if (score >= 70) return { variant: 'default', className: 'bg-yellow-500 text-white' };
  return { variant: 'destructive' };
};

interface StatusBadgeProps {
  type: 'severity' | 'category' | 'score';
  value: string | number;
  categoryClassName?: string;
}

export function StatusBadge({ type, value, categoryClassName }: StatusBadgeProps) {
  if (type === 'severity') {
    const config = SEVERITY_CONFIG[value as string];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className || ''}`}>
        {Icon && <Icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  }

  if (type === 'category') {
    return (
      <Badge variant="outline" className={categoryClassName}>
        {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
      </Badge>
    );
  }

  if (type === 'score') {
    const config = SCORE_CONFIG(value as number);
    return (
      <Badge variant={config.variant} className={config.className}>
        {value}
      </Badge>
    );
  }

  return null;
}
