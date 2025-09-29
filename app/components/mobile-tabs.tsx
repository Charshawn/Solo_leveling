
'use client';
// Mobile-first tab navigation component
import React from 'react';
import { User, BookOpen, Timer } from 'lucide-react';
import { ActiveTab } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MobileTabsProps {
  activeTab: ActiveTab['current'];
  onTabChange: (tab: ActiveTab['current']) => void;
  className?: string;
}

export function MobileTabs({ activeTab, onTabChange, className }: MobileTabsProps) {
  const tabs = [
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      color: 'text-blue-500',
    },
    {
      id: 'skills' as const,
      label: 'Skills',
      icon: BookOpen,
      color: 'text-green-500',
    },
    {
      id: 'timer' as const,
      label: 'Timer',
      icon: Timer,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50',
      'safe-area-inset-bottom backdrop-blur-sm bg-white/95',
      className
    )}>
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200',
                'hover:bg-gray-100 min-w-[60px]',
                isActive && 'bg-gray-100'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? tab.color : 'text-gray-400'
                )}
              />
              <span 
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? tab.color : 'text-gray-400'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
