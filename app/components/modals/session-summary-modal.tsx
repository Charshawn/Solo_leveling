
'use client';
// Session completion summary modal
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Clock, Target, Trophy, TrendingUp } from 'lucide-react';
import { Session, Skill, Attribute } from '@/lib/types';
import { XPCalculator } from '@/lib/xp-calculator';

interface SessionSummaryModalProps {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  skill?: Skill;
  attributes: Attribute[];
}

export function SessionSummaryModal({ open, onClose, session, skill, attributes }: SessionSummaryModalProps) {
  if (!session) return null;

  const focusHours = session.focusMinutesTotal / 60;
  const streakSegments = session.streakSegments.map(s => ({
    minutes: s.minutes,
    startTime: session.startTime,
    endTime: session.endTime,
  }));

  const xpBreakdown = XPCalculator.calculateSessionXP(session.focusMinutesTotal, streakSegments);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Session Complete!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-blue-900">
                  {session.focusMinutesTotal.toFixed(0)}m
                </div>
                <div className="text-sm text-blue-600">Focus Time</div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-yellow-900">
                  {Math.round(session.totalXp).toLocaleString()}
                </div>
                <div className="text-sm text-yellow-600">XP Earned</div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Progress */}
          {skill && (
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Skill Progress</span>
                </div>
                <div className="text-sm text-green-800">
                  <strong>{skill.name}</strong>: +{focusHours.toFixed(1)} hours
                </div>
              </CardContent>
            </Card>
          )}

          {/* XP Attribution */}
          {attributes.length > 0 && (
            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">XP Awarded To</span>
                </div>
                <div className="space-y-1">
                  {attributes.map(attr => (
                    <div key={attr.id} className="text-sm text-purple-800">
                      <strong>{attr.name}</strong>: +{Math.round(session.totalXp).toLocaleString()} XP
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* XP Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">XP Breakdown</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Base XP (10/min):</span>
                  <span>{Math.round(xpBreakdown.breakdown.baseFocusXp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak Bonus:</span>
                  <span>{Math.round(xpBreakdown.breakdown.streakBonusXp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceleration Bonus:</span>
                  <span>{Math.round(xpBreakdown.breakdown.acceleratedBonusXp)}</span>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Total XP:</span>
                  <span>{Math.round(session.totalXp)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <div className="text-xs text-gray-500 text-center">
            <div>Blocks Completed: {session.completedFocusBlocks}</div>
            <div>
              Session Duration: {Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))} minutes
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full">
            Continue Training
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
