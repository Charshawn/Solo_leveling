
// Complex XP calculation engine for Solo Leveling MVP
import { StreakSegment, XPCalculationResult } from './types';

export class XPCalculator {
  private static readonly BASE_XP_PER_MINUTE = 10;
  private static readonly STREAK_BONUS_PER_HOUR = 100;
  private static readonly ACCELERATION_MULTIPLIER = 1.5;

  /**
   * Calculate total XP for a session with complex streak and acceleration rules
   */
  static calculateSessionXP(
    focusMinutesTotal: number,
    streakSegments: StreakSegment[]
  ): XPCalculationResult {
    const baseXp = this.BASE_XP_PER_MINUTE * focusMinutesTotal;
    let bonusXp = 0;
    let streakBonusXp = 0;
    let acceleratedBonusXp = 0;

    // Process each streak segment separately
    for (const segment of streakSegments) {
      const segmentBonus = this.calculateSegmentBonus(segment.minutes);
      bonusXp += segmentBonus.total;
      streakBonusXp += segmentBonus.streakBonus;
      acceleratedBonusXp += segmentBonus.acceleratedBonus;
    }

    return {
      baseXp,
      bonusXp,
      totalXp: baseXp + bonusXp,
      breakdown: {
        baseFocusXp: baseXp,
        streakBonusXp,
        acceleratedBonusXp,
      },
    };
  }

  /**
   * Calculate bonus XP for a single streak segment
   */
  private static calculateSegmentBonus(segmentMinutes: number): {
    total: number;
    streakBonus: number;
    acceleratedBonus: number;
  } {
    const completedHours = Math.floor(segmentMinutes / 60);
    const partialMinutes = segmentMinutes % 60;

    let streakBonus = 0;
    let acceleratedBonus = 0;

    // Hours 1-3: Fixed 100 XP bonus per hour
    const regularBonusHours = Math.min(3, completedHours);
    streakBonus += regularBonusHours * this.STREAK_BONUS_PER_HOUR;

    // Hours 4+: Accelerating returns (1.5x multiplier)
    if (completedHours > 3) {
      let perHourTotalPrev = 700; // Hour 3 total (600 base + 100 bonus)
      
      for (let hour = 4; hour <= completedHours; hour++) {
        const perHourTotalCurr = perHourTotalPrev * this.ACCELERATION_MULTIPLIER;
        const hourBonusXp = perHourTotalCurr - 600; // Subtract base XP
        acceleratedBonus += hourBonusXp;
        perHourTotalPrev = perHourTotalCurr;
      }
    }

    // Handle partial hour
    if (partialMinutes > 0) {
      const hourNumber = completedHours + 1;
      const partialRatio = partialMinutes / 60;

      if (hourNumber <= 3) {
        // Regular bonus hours
        streakBonus += this.STREAK_BONUS_PER_HOUR * partialRatio;
      } else {
        // Accelerated bonus hours
        const perHourTotalPrev = hourNumber === 4 
          ? 700 
          : 700 * Math.pow(this.ACCELERATION_MULTIPLIER, hourNumber - 4);
        const perHourTotalCurr = perHourTotalPrev * this.ACCELERATION_MULTIPLIER;
        const partialBonusXp = (perHourTotalCurr - 600) * partialRatio;
        acceleratedBonus += partialBonusXp;
      }
    }

    return {
      total: streakBonus + acceleratedBonus,
      streakBonus,
      acceleratedBonus,
    };
  }

  /**
   * Calculate XP required for next level based on current level
   */
  static getXpToNextLevel(level: number): number {
    const band = Math.floor((level - 1) / 5);
    return 700 + (band * 700);
  }

  /**
   * Calculate what level a given XP amount represents
   */
  static getLevelFromXp(totalXp: number): { level: number; currentXp: number; xpToNext: number } {
    let level = 1;
    let remainingXp = totalXp;

    while (remainingXp > 0) {
      const xpForThisLevel = this.getXpToNextLevel(level);
      
      if (remainingXp >= xpForThisLevel) {
        remainingXp -= xpForThisLevel;
        level++;
      } else {
        break;
      }
    }

    const xpToNext = this.getXpToNextLevel(level) - remainingXp;

    return {
      level,
      currentXp: remainingXp,
      xpToNext,
    };
  }
}

/**
 * Skill progression utilities
 */
export class SkillProgression {
  static getSkillTier(totalHours: number): 'None' | 'Skill' | 'Expertise' | 'Mastery' {
    if (totalHours >= 1000) return 'Mastery';
    if (totalHours >= 100) return 'Expertise'; 
    if (totalHours >= 20) return 'Skill';
    return 'None';
  }

  static getNextTierThreshold(totalHours: number): number | null {
    if (totalHours < 20) return 20;
    if (totalHours < 100) return 100;
    if (totalHours < 1000) return 1000;
    return null;
  }

  static getTierProgress(totalHours: number): { current: number; target: number; percentage: number } | null {
    const nextThreshold = this.getNextTierThreshold(totalHours);
    if (!nextThreshold) return null;

    let previousThreshold = 0;
    if (nextThreshold === 100) previousThreshold = 20;
    if (nextThreshold === 1000) previousThreshold = 100;

    return {
      current: totalHours - previousThreshold,
      target: nextThreshold - previousThreshold,
      percentage: ((totalHours - previousThreshold) / (nextThreshold - previousThreshold)) * 100,
    };
  }
}
