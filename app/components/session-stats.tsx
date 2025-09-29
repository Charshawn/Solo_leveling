
'use client';
// Live session statistics display
import React, { useMemo } from 'react';
import { TimerState, Skill, Attribute } from '@/lib/types';
import { XPCalculator } from '@/lib/xp-calculator';
import { Zap, Clock, Target, TrendingUp } from 'lucide-react';

interface SessionStatsProps {
  timerState: TimerState;
  selectedSkill?: Skill;
  selectedAttributes: Attribute[];
}

export function SessionStats({ timerState, selectedSkill, selectedAttributes }: SessionStatsProps) {
  // Calculate live XP projection
  const liveXpProjection = useMemo(() => {
    if (timerState.totalFocusMinutes === 0) return null;

    // Create mock streak segment for current session
    const mockStreakSegment = [{
      minutes: timerState.totalFocusMinutes,
      startTime: new Date(),
      endTime: new Date(),
    }];

    return XPCalculator.calculateSessionXP(timerState.totalFocusMinutes, mockStreakSegment);
  }, [timerState.totalFocusMinutes]);

  const skillHours = timerState.totalFocusMinutes / 60;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Focus Time */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <Clock className="w-4 h-4 text-blue-500 mr-1" />
          <span className="text-sm text-gray-600">Focus Time</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {timerState.totalFocusMinutes.toFixed(0)}m
        </div>
      </div>

      {/* Projected XP */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <Zap className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="text-sm text-gray-600">XP Earned</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {liveXpProjection ? Math.round(liveXpProjection.totalXp).toLocaleString() : '0'}
        </div>
      </div>

      {/* Skill Hours */}
      {selectedSkill && (
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-gray-600">Skill Hours</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            +{skillHours.toFixed(1)}h
          </div>
        </div>
      )}

      {/* Current Streak */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
          <span className="text-sm text-gray-600">Streak</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {timerState.currentStreak.toFixed(1)}h
        </div>
      </div>

      {/* XP Breakdown */}
      {liveXpProjection && (
        <div className="col-span-2 md:col-span-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">XP Breakdown</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Base XP:</span>
                <div className="font-medium">{Math.round(liveXpProjection.breakdown.baseFocusXp)}</div>
              </div>
              <div>
                <span className="text-gray-600">Streak Bonus:</span>
                <div className="font-medium">{Math.round(liveXpProjection.breakdown.streakBonusXp)}</div>
              </div>
              <div>
                <span className="text-gray-600">Acceleration:</span>
                <div className="font-medium">{Math.round(liveXpProjection.breakdown.acceleratedBonusXp)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Attributes */}
      {selectedAttributes.length > 0 && (
        <div className="col-span-2 md:col-span-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Awarding XP to:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedAttributes.map(attr => (
                <span
                  key={attr.id}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                >
                  {attr.name} (Lv. {attr.level})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
