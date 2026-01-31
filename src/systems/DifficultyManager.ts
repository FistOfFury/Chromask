import { DIFFICULTY, DifficultyLevel, DIFFICULTY_PRESETS, DifficultyPreset } from '../constants';

export class DifficultyManager {
  private startY: number;
  private preset: DifficultyPreset;

  constructor(startY: number, difficulty: DifficultyLevel = DifficultyLevel.MEDIUM) {
    this.startY = startY;
    this.preset = DIFFICULTY_PRESETS[difficulty];
  }

  getHeightClimbed(currentY: number): number {
    return Math.max(0, this.startY - currentY);
  }

  getPlatformHeight(pixelHeight: number): number {
    return Math.floor(pixelHeight / DIFFICULTY.HEIGHT_PER_PLATFORM);
  }

  getScrollSpeed(heightClimbed: number): number {
    // EASY mode (multiplier = 0) means no forced scroll
    if (this.preset.scrollSpeedMultiplier === 0) {
      return 0;
    }

    if (heightClimbed < DIFFICULTY.FLOOR_START_HEIGHT) {
      return 0;
    }

    const progressRange = DIFFICULTY.MAX_DIFFICULTY_HEIGHT - DIFFICULTY.FLOOR_START_HEIGHT;
    const progress = Math.min((heightClimbed - DIFFICULTY.FLOOR_START_HEIGHT) / progressRange, 1);

    const baseSpeed = DIFFICULTY.INITIAL_SCROLL_SPEED + 
      (DIFFICULTY.MAX_SCROLL_SPEED - DIFFICULTY.INITIAL_SCROLL_SPEED) * progress;
    
    return baseSpeed * this.preset.scrollSpeedMultiplier;
  }
}
