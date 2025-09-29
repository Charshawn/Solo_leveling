
'use client';
// Application header with user info and settings
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';
import { User } from '@/lib/types';

interface AppHeaderProps {
  user: User | null;
  onSettingsClick?: () => void;
}

export function AppHeader({ user, onSettingsClick }: AppHeaderProps) {
  if (!user) return null;

  const totalLevels = user.attributes?.reduce((sum, attr) => sum + attr.level, 0) || 0;
  const totalSessions = user.sessions?.length || 0;

  return (
    <Card className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-600">
                {totalLevels} total levels • {totalSessions} sessions
              </p>
            </div>
          </div>

          {/* Settings button */}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
