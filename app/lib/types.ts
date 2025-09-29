
// Core data types for Solo Leveling MVP
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  attributes: Attribute[];
  skills: Skill[];
  sessions: Session[];
  createdAt: Date;
}

export interface Attribute {
  id: string;
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  imageUrl: string;
  attributeIds: string[];
  totalHours: number;
  tier: 'None' | 'Skill' | 'Expertise' | 'Mastery';
  createdAt: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  focusMinutesTotal: number;
  completedFocusBlocks: number;
  breaksUsed: {
    shortBreaks: number;
    longBreaks: number;
    overLimit: boolean;
  };
  streakSegments: { minutes: number }[];
  totalXp: number;
  attributeIdsAwardedTo: string[];
  skillId?: string;
}

// Timer states and configurations
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  phase: 'focus' | 'shortBreak' | 'longBreak';
  timeRemaining: number;
  focusBlocksCompleted: number;
  sessionStartTime: Date | null;
  totalFocusMinutes: number;
  currentStreak: number;
  streakBroken: boolean;
  selectedSkillId?: string;
  selectedAttributeIds: string[];
}

export interface XPCalculationResult {
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  breakdown: {
    baseFocusXp: number;
    streakBonusXp: number;
    acceleratedBonusXp: number;
  };
}

export interface StreakSegment {
  minutes: number;
  startTime: Date;
  endTime: Date;
}

// UI State types
export interface ActiveTab {
  current: 'profile' | 'skills' | 'timer';
}

export interface NotificationSettings {
  audioEnabled: boolean;
  volume: number;
}

// Skill category images mapping
export const SKILL_CATEGORY_IMAGES = {
  fitness: 'https://cdn.abacus.ai/images/e7ad7ef8-0d5a-477d-97c5-84ca684e28a3.png',
  learning: 'https://cdn.abacus.ai/images/9b2b9c39-0e21-4d32-82da-fdb9afd2d986.png',
  music: 'https://cdn.abacus.ai/images/0ef35513-af3f-46ab-a7f1-2aa922fe3c3f.png',
  coding: 'https://cdn.abacus.ai/images/ebd852b0-12dd-4b1d-b262-58d97efec0d2.png',
  art: 'https://cdn.abacus.ai/images/32c9346b-aa46-4624-9cc2-358e9abe0ded.png',
  cooking: 'https://cdn.abacus.ai/images/ebbcc7b7-6b13-47fa-8083-a3265446ce44.png',
  meditation: 'https://cdn.abacus.ai/images/b0ed4704-c63e-4ae6-9149-673723c166cc.png',
  writing: 'https://cdn.abacus.ai/images/a1816ae6-df6a-4d87-a106-118013d6b08e.png',
  sports: 'https://cdn.abacus.ai/images/b0804bd4-9b8a-4d15-8e11-e1cc5f21aa3a.png',
  reading: 'https://cdn.abacus.ai/images/9326b09c-b188-4b42-8925-6d51db11d403.png'
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORY_IMAGES;
