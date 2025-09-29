
'use client';
// Level badge component for attributes and skills
import React from 'react';
import { cn } from '@/lib/utils';
import { Crown, Star, Award, Zap } from 'lucide-react';

interface LevelBadgeProps {
  level?: number;
  tier?: 'None' | 'Skill' | 'Expertise' | 'Mastery';
  type: 'attribute' | 'skill';
  className?: string;
}

export function LevelBadge({ level, tier, type, className }: LevelBadgeProps) {
  if (type === 'attribute' && level) {
    const colorClass = level >= 10 ? 'bg-purple-500 text-white' : 
                      level >= 5 ? 'bg-blue-500 text-white' : 
                      'bg-gray-500 text-white';

    return (
      <div className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
        colorClass,
        className
      )}>
        <Zap className="w-3 h-3" />
        <span>Lv. {level}</span>
      </div>
    );
  }

  if (type === 'skill' && tier) {
    const config = {
      None: { icon: Star, color: 'bg-gray-400 text-white', label: 'Beginner' },
      Skill: { icon: Award, color: 'bg-green-500 text-white', label: 'Skill' },
      Expertise: { icon: Star, color: 'bg-blue-500 text-white', label: 'Expertise' },
      Mastery: { icon: Crown, color: 'bg-purple-500 text-white', label: 'Mastery' },
    };

    const { icon: Icon, color, label } = config[tier];

    return (
      <div className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
        color,
        className
      )}>
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
    );
  }

  return null;
}
