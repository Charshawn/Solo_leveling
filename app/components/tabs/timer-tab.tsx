
'use client';
// Timer tab component with Pomodoro timer and session controls
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimerDisplay } from '@/components/timer-display';
import { SessionStats } from '@/components/session-stats';
import { SessionSummaryModal } from '@/components/modals/session-summary-modal';
import { Play, Pause, Square, SkipForward, Timer, Target } from 'lucide-react';
import { TimerState, Skill, Attribute, Session } from '@/lib/types';
import { TimerEngine } from '@/lib/timer-engine';

interface TimerTabProps {
  timerState: TimerState;
  skills: Skill[];
  attributes: Attribute[];
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onStopTimer: () => Session | null;
  onSkipBreak: () => void;
  onResetTimer: () => void;
  onSetSelection: (skillId?: string, attributeIds?: string[]) => void;
}

export function TimerTab({
  timerState,
  skills,
  attributes,
  onStartTimer,
  onPauseTimer,
  onStopTimer,
  onSkipBreak,
  onResetTimer,
  onSetSelection,
}: TimerTabProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
  const [lastSession, setLastSession] = useState<Session | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Update timer selection when local state changes
  useEffect(() => {
    onSetSelection(
      selectedSkillId || undefined,
      selectedAttributeIds.length > 0 ? selectedAttributeIds : attributes.map(a => a.id)
    );
  }, [selectedSkillId, selectedAttributeIds, onSetSelection, attributes]);

  const handleStart = () => {
    if (!timerState.sessionStartTime) {
      // Starting new session - ensure selections are made
      if (selectedAttributeIds.length === 0) {
        // Default to all attributes if none selected
        const allAttrIds = attributes.map(a => a.id);
        setSelectedAttributeIds(allAttrIds);
        onSetSelection(selectedSkillId || undefined, allAttrIds);
      }
    }
    onStartTimer();
  };

  const handleStop = () => {
    const session = onStopTimer();
    if (session) {
      setLastSession(session);
      setShowSummary(true);
    }
  };

  const handleAttributeToggle = (attributeId: string) => {
    setSelectedAttributeIds(prev => {
      const newIds = prev.includes(attributeId)
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId];
      return newIds;
    });
  };

  const canStart = !timerState.isRunning;
  const canPause = timerState.isRunning;
  const canSkipBreak = timerState.phase !== 'focus' && timerState.isRunning;
  const isInSession = timerState.sessionStartTime !== null;

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <TimerDisplay timerState={timerState} />
          
          {/* Timer Controls */}
          <div className="flex justify-center gap-4 mt-6">
            {canStart && (
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                {isInSession ? 'Resume' : 'Start Session'}
              </Button>
            )}
            
            {canPause && (
              <Button
                size="lg"
                variant="outline"
                onClick={onPauseTimer}
                className="border-white text-white hover:bg-white/10"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            
            {isInSession && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleStop}
                className="border-white text-white hover:bg-white/10"
              >
                <Square className="w-5 h-5 mr-2" />
                End Session
              </Button>
            )}
            
            {canSkipBreak && (
              <Button
                size="lg"
                variant="outline"
                onClick={onSkipBreak}
                className="border-white text-white hover:bg-white/10"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip Break
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Configuration */}
      {!isInSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Session Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skill Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Skill (Optional)
              </label>
              <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a skill to train..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific skill</SelectItem>
                  {skills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name} ({skill.totalHours.toFixed(1)}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Attribute Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Award XP to Attributes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {attributes.map(attribute => (
                  <Button
                    key={attribute.id}
                    variant={selectedAttributeIds.includes(attribute.id) ? "default" : "outline"}
                    onClick={() => handleAttributeToggle(attribute.id)}
                    className="justify-start"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAttributeIds.includes(attribute.id)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {attribute.name} (Lv. {attribute.level})
                  </Button>
                ))}
              </div>
              
              {selectedAttributeIds.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ No attributes selected. XP will be awarded to all attributes.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Stats */}
      {isInSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Session Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionStats
              timerState={timerState}
              selectedSkill={skills.find(s => s.id === selectedSkillId)}
              selectedAttributes={attributes.filter(a => selectedAttributeIds.includes(a.id))}
            />
          </CardContent>
        </Card>
      )}

      {/* Pomodoro Rules Info */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Pomodoro Rules:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Focus: 25 minutes of uninterrupted work</li>
              <li>• Short Break: 5 minutes after each focus block</li>
              <li>• Long Break: 15 minutes after every 4 focus blocks</li>
              <li>• Streak continues if breaks stay within time limits</li>
              <li>• XP multipliers kick in after 3+ consecutive hours</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Session Summary Modal */}
      <SessionSummaryModal
        open={showSummary}
        onClose={() => setShowSummary(false)}
        session={lastSession}
        skill={selectedSkillId ? skills.find(s => s.id === selectedSkillId) : undefined}
        attributes={attributes.filter(a => selectedAttributeIds.includes(a.id))}
      />
    </div>
  );
}
