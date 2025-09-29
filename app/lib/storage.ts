
// LocalStorage persistence layer for Solo Leveling MVP
import { User, Attribute, Skill, Session, NotificationSettings } from './types';

const STORAGE_KEYS = {
  USER: 'solo_leveling_user',
  SETTINGS: 'solo_leveling_settings',
  TIMER_STATE: 'solo_leveling_timer_state',
} as const;

export class StorageManager {
  /**
   * Save user data to localStorage
   */
  static saveUser(user: User): void {
    try {
      const serialized = JSON.stringify(user, (key, value) => {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      localStorage.setItem(STORAGE_KEYS.USER, serialized);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  /**
   * Load user data from localStorage
   */
  static loadUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Convert ISO strings back to Date objects
      const user: User = {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        attributes: parsed.attributes?.map((attr: any) => ({
          ...attr,
          createdAt: new Date(attr.createdAt),
        })) ?? [],
        skills: parsed.skills?.map((skill: any) => ({
          ...skill,
          createdAt: new Date(skill.createdAt),
        })) ?? [],
        sessions: parsed.sessions?.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        })) ?? [],
      };

      return user;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }

  /**
   * Save notification settings
   */
  static saveSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Load notification settings
   */
  static loadSettings(): NotificationSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) {
        return { audioEnabled: true, volume: 0.5 };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return { audioEnabled: true, volume: 0.5 };
    }
  }

  /**
   * Save timer state for persistence across browser sessions
   */
  static saveTimerState(state: any): void {
    try {
      const serialized = JSON.stringify(state, (key, value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      localStorage.setItem(STORAGE_KEYS.TIMER_STATE, serialized);
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }

  /**
   * Load timer state
   */
  static loadTimerState(): any | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Convert ISO strings back to Date objects where applicable
      if (parsed.sessionStartTime) {
        parsed.sessionStartTime = new Date(parsed.sessionStartTime);
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to load timer state:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Initialize default user if none exists
   */
  static initializeDefaultUser(): User {
    const defaultUser: User = {
      id: 'default-user',
      name: 'Solo Leveler',
      attributes: [
        {
          id: 'strength',
          name: 'Strength',
          level: 1,
          currentXp: 0,
          xpToNextLevel: 700,
          createdAt: new Date(),
        },
        {
          id: 'intelligence',
          name: 'Intelligence',
          level: 1,
          currentXp: 0,
          xpToNextLevel: 700,
          createdAt: new Date(),
        },
      ],
      skills: [],
      sessions: [],
      createdAt: new Date(),
    };

    this.saveUser(defaultUser);
    return defaultUser;
  }

  /**
   * Check if we're in a browser environment
   */
  static isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
