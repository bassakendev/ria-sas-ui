interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const statusVariants: Record<string, keyof typeof variants> = {
    paid: 'success',
    draft: 'info',
    sent: 'warning',
    overdue: 'danger',
  };

  const variantKey = (statusVariants[String(children)] || variant) as keyof typeof variants;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variantKey]}`}>
      {children}
    </span>
  );
}
