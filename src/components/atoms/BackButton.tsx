import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface BackButtonProps {
  to?: string;
  label?: string;
  fallback?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function BackButton({ 
  to, 
  label = 'Back', 
  fallback = '/dashboard',
  variant = 'ghost',
  size = 'sm',
  className = 'mb-4'
}: BackButtonProps) {
  const navigate = useNavigate();
  const params = useParams();
  
  const destination = to || (params.projectId ? `/dashboard/projects/${params.projectId}` : fallback);
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => navigate(destination)}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
