import { CURRENCY } from '@/constants';

interface PriceProps {
  value: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Price({ value, originalPrice, discount, size = 'md', className = '' }: PriceProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-semibold text-gray-900 dark:text-white ${sizeClasses[size]}`}>
        {CURRENCY.SYMBOL}
        {value.toLocaleString(CURRENCY.LOCALE)}
      </span>
      {originalPrice && originalPrice > value && (
        <span className={`text-gray-500 line-through ${sizeClasses[size]}`}>
          {CURRENCY.SYMBOL}
          {originalPrice.toLocaleString(CURRENCY.LOCALE)}
        </span>
      )}
      {discount && (
        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
          {discount}% off
        </span>
      )}
    </div>
  );
}
