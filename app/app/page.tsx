
'use client';
// Main application page component
import React, { useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { MobileTabs } from '@/components/mobile-tabs';
import { ProfileTab } from '@/components/tabs/profile-tab';
import { SkillsTab } from '@/components/tabs/skills-tab';
import { TimerTab } from '@/components/tabs/timer-tab';
import { useAppState } from '@/hooks/use-app-state';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const {
    user,
    activeTab,
    timerState,
    setActiveTab,
    createAttribute,
    deleteAttribute,
    createSkill,
    deleteSkill,
    updateProfile,
    startTimer,
    pauseTimer,
    stopTimer,
    skipBreak,
    resetTimer,
    setTimerSelection,
  } = useAppState();

  // Show loading state while user data is being loaded
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading Solo Leveling...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <AppHeader user={user} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            onCreateAttribute={createAttribute}
            onDeleteAttribute={deleteAttribute}
            onUpdateProfile={updateProfile}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsTab
            skills={user.skills || []}
            attributes={user.attributes || []}
            onCreateSkill={createSkill}
            onDeleteSkill={deleteSkill}
          />
        )}

        {activeTab === 'timer' && (
          <TimerTab
            timerState={timerState}
            skills={user.skills || []}
            attributes={user.attributes || []}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onStopTimer={stopTimer}
            onSkipBreak={skipBreak}
            onResetTimer={resetTimer}
            onSetSelection={setTimerSelection}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <MobileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
