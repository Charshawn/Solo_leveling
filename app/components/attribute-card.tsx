
'use client';
// Attribute card component showing level, XP progress, and stats
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LevelBadge } from '@/components/ui/level-badge';
import { Trash2, Zap } from 'lucide-react';
import { Attribute } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AttributeCardProps {
  attribute: Attribute;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
  className?: string;
}

export function AttributeCard({ attribute, onDelete, canDelete = false, className }: AttributeCardProps) {
  const progressPercentage = (attribute.currentXp / attribute.xpToNextLevel) * 100;

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-200 hover:shadow-lg border-2',
      'hover:border-blue-300 bg-gradient-to-br from-white to-blue-50',
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{attribute.name}</h3>
              <LevelBadge level={attribute.level} type="attribute" />
            </div>
          </div>
          
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(attribute.id)}
              className="text-red-400 hover:text-red-600 p-1 transition-colors"
              title="Delete attribute"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">XP Progress</span>
            <span className="font-medium">
              {Math.round(attribute.currentXp).toLocaleString()} / {Math.round(attribute.xpToNextLevel).toLocaleString()}
            </span>
          </div>
          
          <ProgressBar
            value={attribute.currentXp}
            max={attribute.xpToNextLevel}
            color="primary"
            showText={false}
            className="mb-1"
          />
          
          <div className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}% to next level
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
