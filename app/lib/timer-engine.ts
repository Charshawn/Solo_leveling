
// Pomodoro timer engine with complex streak tracking
import { TimerState, StreakSegment, Session } from './types';
import { StorageManager } from './storage';

export class TimerEngine {
  private static readonly FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
  private static readonly SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
  private static readonly LONG_BREAK_DURATION = 15 * 60; // 15 minutes
  private static readonly BREAK_OVERRUN_THRESHOLD = 60; // 1 minute in seconds
  
  private timer: NodeJS.Timeout | null = null;
  private state: TimerState;
  private callbacks: {
    onTick?: (state: TimerState) => void;
    onPhaseChange?: (phase: string) => void;
    onStreakBreak?: () => void;
    onComplete?: (session: Session) => void;
  } = {};

  constructor(initialState?: Partial<TimerState>) {
    this.state = {
      isRunning: false,
      isPaused: false,
      phase: 'focus',
      timeRemaining: TimerEngine.FOCUS_DURATION,
      focusBlocksCompleted: 0,
      sessionStartTime: null,
      totalFocusMinutes: 0,
      currentStreak: 0,
      streakBroken: false,
      selectedSkillId: undefined,
      selectedAttributeIds: [],
      ...initialState,
    };

    // Try to restore state from localStorage
    this.restoreState();
  }

  /**
   * Start or resume the timer
   */
  start(): void {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    
    if (!this.state.sessionStartTime) {
      this.state.sessionStartTime = new Date();
    }

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);

    this.persistState();
  }

  /**
   * Pause the timer
   */
  pause(): void {
    if (!this.state.isRunning) return;

    this.state.isRunning = false;
    this.state.isPaused = true;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Check if pausing outside break window breaks streak
    if (this.state.phase === 'focus') {
      // Pausing during focus for >1 minute breaks streak
      // This would need additional logic to track pause duration
    }

    this.persistState();
  }

  /**
   * Stop/end the session
   */
  stop(): Session | null {
    if (!this.state.sessionStartTime) return null;

    const session = this.generateSession();
    
    // Reset timer state
    this.reset();
    
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete(session);
    }

    return session;
  }

  /**
   * Skip current break
   */
  skipBreak(): void {
    if (this.state.phase === 'focus') return;

    // Move to next focus phase
    this.state.phase = 'focus';
    this.state.timeRemaining = TimerEngine.FOCUS_DURATION;
    
    if (this.callbacks.onPhaseChange) {
      this.callbacks.onPhaseChange('focus');
    }

    this.persistState();
  }

  /**
   * Reset timer to initial state
   */
  reset(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.state = {
      isRunning: false,
      isPaused: false,
      phase: 'focus',
      timeRemaining: TimerEngine.FOCUS_DURATION,
      focusBlocksCompleted: 0,
      sessionStartTime: null,
      totalFocusMinutes: 0,
      currentStreak: 0,
      streakBroken: false,
      selectedSkillId: undefined,
      selectedAttributeIds: [],
    };

    this.persistState();
  }

  /**
   * Set selected skill and attributes for the session
   */
  setSelection(skillId?: string, attributeIds: string[] = []): void {
    this.state.selectedSkillId = skillId;
    this.state.selectedAttributeIds = attributeIds;
    this.persistState();
  }

  /**
   * Get current timer state
   */
  getState(): TimerState {
    return { ...this.state };
  }

  /**
   * Register callbacks
   */
  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...callbacks };
  }

  /**
   * Timer tick logic
   */
  private tick(): void {
    this.state.timeRemaining--;

    if (this.state.phase === 'focus') {
      this.state.totalFocusMinutes = this.calculateTotalFocusMinutes();
      this.state.currentStreak = this.state.totalFocusMinutes / 60;
    }

    // Phase transition when timer reaches 0
    if (this.state.timeRemaining <= 0) {
      this.handlePhaseTransition();
    }

    if (this.callbacks.onTick) {
      this.callbacks.onTick({ ...this.state });
    }

    this.persistState();
  }

  /**
   * Handle phase transitions (focus -> break -> focus)
   */
  private handlePhaseTransition(): void {
    if (this.state.phase === 'focus') {
      this.state.focusBlocksCompleted++;
      
      // Determine break type
      if (this.state.focusBlocksCompleted % 4 === 0) {
        this.state.phase = 'longBreak';
        this.state.timeRemaining = TimerEngine.LONG_BREAK_DURATION;
      } else {
        this.state.phase = 'shortBreak';
        this.state.timeRemaining = TimerEngine.SHORT_BREAK_DURATION;
      }
    } else {
      // Break -> Focus
      this.state.phase = 'focus';
      this.state.timeRemaining = TimerEngine.FOCUS_DURATION;
    }

    if (this.callbacks.onPhaseChange) {
      this.callbacks.onPhaseChange(this.state.phase);
    }
  }

  /**
   * Calculate total focus minutes elapsed
   */
  private calculateTotalFocusMinutes(): number {
    if (!this.state.sessionStartTime) return 0;
    
    const focusTimePerBlock = TimerEngine.FOCUS_DURATION / 60;
    const completedFocusMinutes = this.state.focusBlocksCompleted * focusTimePerBlock;
    
    // Add current focus block progress
    if (this.state.phase === 'focus') {
      const currentBlockProgress = (TimerEngine.FOCUS_DURATION - this.state.timeRemaining) / 60;
      return completedFocusMinutes + currentBlockProgress;
    }
    
    return completedFocusMinutes;
  }

  /**
   * Generate session data when stopping
   */
  private generateSession(): Session {
    const now = new Date();
    const focusMinutes = this.calculateTotalFocusMinutes();
    
    // For MVP, treat entire session as one streak segment
    // In production, would track actual streak breaks
    const streakSegments: StreakSegment[] = [{
      minutes: focusMinutes,
      startTime: this.state.sessionStartTime!,
      endTime: now,
    }];

    const session: Session = {
      id: `session_${Date.now()}`,
      startTime: this.state.sessionStartTime!,
      endTime: now,
      focusMinutesTotal: focusMinutes,
      completedFocusBlocks: this.state.focusBlocksCompleted,
      breaksUsed: {
        shortBreaks: 0, // Would track in production
        longBreaks: 0,
        overLimit: false,
      },
      streakSegments: streakSegments.map(s => ({ minutes: s.minutes })),
      totalXp: 0, // Will be calculated by XP system
      attributeIdsAwardedTo: this.state.selectedAttributeIds,
      skillId: this.state.selectedSkillId,
    };

    return session;
  }

  /**
   * Persist timer state to localStorage
   */
  private persistState(): void {
    if (StorageManager.isClient()) {
      StorageManager.saveTimerState(this.state);
    }
  }

  /**
   * Restore timer state from localStorage
   */
  private restoreState(): void {
    if (!StorageManager.isClient()) return;

    const savedState = StorageManager.loadTimerState();
    if (savedState) {
      // Restore basic state but don't auto-resume timer
      this.state = {
        ...this.state,
        ...savedState,
        isRunning: false,
        isPaused: false,
      };
    }
  }

  /**
   * Format time for display (MM:SS)
   */
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
