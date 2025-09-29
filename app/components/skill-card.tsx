
'use client';
// Skill card component showing skill progress, tier, and attributes
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { LevelBadge } from '@/components/ui/level-badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Trash2, Clock, Target } from 'lucide-react';
import { Skill, Attribute } from '@/lib/types';
import { SkillProgression } from '@/lib/xp-calculator';
import { cn } from '@/lib/utils';

interface SkillCardProps {
  skill: Skill;
  attributes: Attribute[];
  onDelete?: (id: string) => void;
  className?: string;
}

export function SkillCard({ skill, attributes, onDelete, className }: SkillCardProps) {
  const tierProgress = SkillProgression.getTierProgress(skill.totalHours);
  const nextThreshold = SkillProgression.getNextTierThreshold(skill.totalHours);
  
  // Get linked attributes
  const linkedAttributes = attributes.filter(attr => 
    skill.attributeIds.includes(attr.id)
  );

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-200 hover:shadow-lg',
      'hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50',
      className
    )}>
      <CardContent className="p-0">
        {/* Image header */}
        <div className="relative h-32 bg-gray-200 overflow-hidden">
          <Image
            src={skill.imageUrl}
            alt={skill.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to a default pattern on error
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          
          {/* Delete button */}
          {onDelete && (
            <button
              onClick={() => onDelete(skill.id)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors shadow-lg"
              title="Delete skill"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          
          {/* Tier badge */}
          <div className="absolute bottom-2 left-2">
            <LevelBadge tier={skill.tier} type="skill" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{skill.totalHours.toFixed(1)} hours</span>
            </div>
          </div>

          {/* Progress to next tier */}
          {tierProgress && nextThreshold && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Next: {nextThreshold}h</span>
                <span className="font-medium">
                  {tierProgress.current.toFixed(1)} / {tierProgress.target}h
                </span>
              </div>
              <ProgressBar
                value={tierProgress.current}
                max={tierProgress.target}
                color="success"
                showText={false}
                size="sm"
              />
            </div>
          )}

          {/* Linked attributes */}
          {linkedAttributes.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <Target className="w-3 h-3" />
                <span>Linked to:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {linkedAttributes.map(attr => (
                  <span
                    key={attr.id}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    {attr.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
