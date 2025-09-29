
'use client';
// Large timer display component showing current phase and countdown
import React from 'react';
import { TimerState } from '@/lib/types';
import { TimerEngine } from '@/lib/timer-engine';
import { Clock, Coffee, Battery } from 'lucide-react';

interface TimerDisplayProps {
  timerState: TimerState;
}

export function TimerDisplay({ timerState }: TimerDisplayProps) {
  const formattedTime = TimerEngine.formatTime(timerState.timeRemaining);
  
  const phaseConfig = {
    focus: {
      icon: Clock,
      label: 'Focus Time',
      color: 'text-white',
      bgColor: 'bg-white/10',
    },
    shortBreak: {
      icon: Coffee,
      label: 'Short Break',
      color: 'text-green-200',
      bgColor: 'bg-green-500/20',
    },
    longBreak: {
      icon: Battery,
      label: 'Long Break',
      color: 'text-blue-200',
      bgColor: 'bg-blue-500/20',
    },
  };

  const config = phaseConfig[timerState.phase];
  const Icon = config.icon;

  return (
    <div className="text-center">
      {/* Phase indicator */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Large timer display */}
      <div className="mb-4">
        <div className="text-6xl md:text-7xl font-mono font-bold mb-2">
          {formattedTime}
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-center items-center gap-4 text-white/80">
          <div className="text-sm">
            Blocks: {timerState.focusBlocksCompleted}
          </div>
          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          <div className="text-sm">
            Focus: {timerState.totalFocusMinutes.toFixed(0)}m
          </div>
          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          <div className="text-sm">
            Streak: {timerState.currentStreak.toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex justify-center gap-4 text-sm text-white/60">
        {timerState.isPaused && (
          <span className="px-2 py-1 bg-yellow-500/20 rounded">Paused</span>
        )}
        
        {timerState.streakBroken && (
          <span className="px-2 py-1 bg-red-500/20 rounded">Streak Broken</span>
        )}
        
        {timerState.isRunning && (
          <span className="px-2 py-1 bg-green-500/20 rounded animate-pulse">
            Active
          </span>
        )}
      </div>
    </div>
  );
}
