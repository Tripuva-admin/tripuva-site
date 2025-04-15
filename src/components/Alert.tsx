import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  success: {
    container: 'bg-green-50 border-green-400',
    icon: 'text-green-400',
    title: 'text-green-800',
    message: 'text-green-700',
  },
  error: {
    container: 'bg-red-50 border-red-400',
    icon: 'text-red-400',
    title: 'text-red-800',
    message: 'text-red-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-400',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-400',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    message: 'text-blue-700',
  },
};

const variantIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({ 
  variant = 'info', 
  title, 
  message, 
  onClose,
  className = ''
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = variantIcons[variant];

  return (
    <div className={`border-l-4 p-4 ${styles.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`mt-2 text-sm ${styles.message}`}>
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${styles.icon} hover:bg-${variant}-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-50 focus:ring-${variant}-600`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 