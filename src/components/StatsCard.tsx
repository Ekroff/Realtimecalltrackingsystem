import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-[--color-primary] text-white',
    success: 'bg-[--color-success] text-white',
    warning: 'bg-[--color-warning] text-white',
    error: 'bg-[--color-error] text-white',
  };

  const gradientClasses = {
    primary: 'gradient-primary',
    success: 'gradient-success',
    warning: 'gradient-warning',
    error: 'gradient-error',
  };

  return (
    <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[--color-text-light] mb-2">{title}</p>
          <p className="text-3xl mb-2">{value}</p>
          {trend && (
            <p className={`text-xs flex items-center gap-1 ${trend.positive ? 'text-[--color-success]' : 'text-[--color-error]'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${gradientClasses[color]} shadow-lg`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </Card>
  );
}