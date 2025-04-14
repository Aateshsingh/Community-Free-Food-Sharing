
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
  variant?: 'default' | 'warning' | 'destructive';
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  action,
  variant = 'default'
}) => {
  const getIconClass = () => {
    switch (variant) {
      case 'warning':
        return 'text-amber-500';
      case 'destructive':
        return 'text-destructive';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && (
        <div className={`mb-4 ${getIconClass()}`}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      
      {action && (
        <Button asChild>
          <Link to={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
