
'use client';
// Global app state management for Solo Leveling MVP
import { useState, useEffect, useCallback } from 'react';
import { User, Attribute, Skill, Session, NotificationSettings, ActiveTab } from '../lib/types';
import { StorageManager } from '../lib/storage';
import { XPCalculator, SkillProgression } from '../lib/xp-calculator';
import { TimerEngine } from '../lib/timer-engine';

export function useAppState() {
  // Core data state
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab['current']>('profile');
  const [settings, setSettings] = useState<NotificationSettings>({ audioEnabled: true, volume: 0.5 });
  
  // Timer state
  const [timerEngine] = useState(() => new TimerEngine());
  const [timerState, setTimerState] = useState(timerEngine.getState());

  // Initialize app state
  useEffect(() => {
    if (!StorageManager.isClient()) return;

    // Load user data
    let userData = StorageManager.loadUser();
    if (!userData) {
      userData = StorageManager.initializeDefaultUser();
    }
    setUser(userData);

    // Load settings
    const userSettings = StorageManager.loadSettings();
    setSettings(userSettings);

    // Setup timer callbacks
    timerEngine.setCallbacks({
      onTick: (state) => setTimerState(state),
      onPhaseChange: (phase) => {
        console.log(`Phase changed to: ${phase}`);
        // Could play audio notification here
      },
      onComplete: (session) => {
        handleSessionComplete(session);
      },
    });

    const interval = setInterval(() => {
      setTimerState(timerEngine.getState());
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEngine]);

  // Save user data whenever it changes
  useEffect(() => {
    if (user && StorageManager.isClient()) {
      StorageManager.saveUser(user);
    }
  }, [user]);

  // Save settings whenever they change
  useEffect(() => {
    if (StorageManager.isClient()) {
      StorageManager.saveSettings(settings);
    }
  }, [settings]);

  /**
   * Handle session completion - award XP and update skills
   */
  const handleSessionComplete = useCallback((session: Session) => {
    if (!user) return;

    // Calculate XP for the session
    const streakSegments = session.streakSegments.map(s => ({
      minutes: s.minutes,
      startTime: session.startTime,
      endTime: session.endTime,
    }));

    const xpResult = XPCalculator.calculateSessionXP(session.focusMinutesTotal, streakSegments);
    session.totalXp = xpResult.totalXp;

    // Update user data
    const updatedUser = { ...user };

    // Add session to history
    updatedUser.sessions = [...updatedUser.sessions, session];

    // Award XP to selected attributes
    session.attributeIdsAwardedTo.forEach(attrId => {
      const attr = updatedUser.attributes.find(a => a.id === attrId);
      if (attr) {
        const totalXp = attr.currentXp + attr.level * attr.xpToNextLevel + session.totalXp;
        const levelInfo = XPCalculator.getLevelFromXp(totalXp);
        
        attr.level = levelInfo.level;
        attr.currentXp = levelInfo.currentXp;
        attr.xpToNextLevel = levelInfo.xpToNext;
      }
    });

    // Update skill hours if skill was selected
    if (session.skillId) {
      const skill = updatedUser.skills.find(s => s.id === session.skillId);
      if (skill) {
        skill.totalHours += session.focusMinutesTotal / 60;
        skill.tier = SkillProgression.getSkillTier(skill.totalHours);
      }
    }

    setUser(updatedUser);
    
    // Show session summary (would trigger modal in UI)
    console.log('Session completed!', {
      focusMinutes: session.focusMinutesTotal.toFixed(1),
      xpEarned: session.totalXp,
      skillHours: session.skillId ? (session.focusMinutesTotal / 60).toFixed(1) : 0,
    });
  }, [user]);

  /**
   * Create new attribute
   */
  const createAttribute = useCallback((name: string) => {
    if (!user) return;

    const newAttribute: Attribute = {
      id: `attr_${Date.now()}`,
      name,
      level: 1,
      currentXp: 0,
      xpToNextLevel: 700,
      createdAt: new Date(),
    };

    setUser({
      ...user,
      attributes: [...user.attributes, newAttribute],
    });
  }, [user]);

  /**
   * Delete attribute (only custom attributes)
   */
  const deleteAttribute = useCallback((attributeId: string) => {
    if (!user) return;
    
    // Don't allow deleting default attributes
    if (attributeId === 'strength' || attributeId === 'intelligence') return;

    setUser({
      ...user,
      attributes: user.attributes.filter(attr => attr.id !== attributeId),
      // Remove from skills that reference this attribute
      skills: user.skills.map(skill => ({
        ...skill,
        attributeIds: skill.attributeIds.filter(id => id !== attributeId),
      })),
    });
  }, [user]);

  /**
   * Create new skill
   */
  const createSkill = useCallback((name: string, imageUrl: string, attributeIds: string[] = []) => {
    if (!user) return;

    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name,
      imageUrl,
      attributeIds,
      totalHours: 0,
      tier: 'None',
      createdAt: new Date(),
    };

    setUser({
      ...user,
      skills: [...user.skills, newSkill],
    });
  }, [user]);

  /**
   * Delete skill
   */
  const deleteSkill = useCallback((skillId: string) => {
    if (!user) return;

    setUser({
      ...user,
      skills: user.skills.filter(skill => skill.id !== skillId),
    });
  }, [user]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'avatarUrl'>>) => {
    if (!user) return;

    setUser({
      ...user,
      ...updates,
    });
  }, [user]);

  return {
    // Data
    user,
    activeTab,
    settings,
    timerState,
    
    // Actions
    setActiveTab,
    createAttribute,
    deleteAttribute,
    createSkill,
    deleteSkill,
    updateProfile,
    setSettings,
    
    // Timer actions
    startTimer: () => timerEngine.start(),
    pauseTimer: () => timerEngine.pause(),
    stopTimer: () => timerEngine.stop(),
    skipBreak: () => timerEngine.skipBreak(),
    resetTimer: () => timerEngine.reset(),
    setTimerSelection: (skillId?: string, attributeIds?: string[]) => 
      timerEngine.setSelection(skillId, attributeIds),
  };
}
