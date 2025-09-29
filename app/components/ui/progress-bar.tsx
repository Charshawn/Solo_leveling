
'use client';
// Enhanced progress bar component for Solo Leveling MVP
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showText?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max, 
  className, 
  showText = true,
  color = 'primary',
  size = 'md',
  animated = false
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500', 
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showText && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{Math.round(value).toLocaleString()}</span>
          <span>{Math.round(max).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
