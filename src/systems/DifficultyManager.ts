import { DIFFICULTY } from '../constants';

export class DifficultyManager {
  private startY: number;

  constructor(startY: number) {
    this.startY = startY;
  }

  getHeightClimbed(currentY: number): number {
    return Math.max(0, this.startY - currentY);
  }

  getScrollSpeed(heightClimbed: number): number {
    if (heightClimbed < DIFFICULTY.GRACE_PERIOD) {
      return 0;
    }

    const progressRange = DIFFICULTY.MAX_DIFFICULTY_HEIGHT - DIFFICULTY.GRACE_PERIOD;
    const progress = Math.min((heightClimbed - DIFFICULTY.GRACE_PERIOD) / progressRange, 1);

    return DIFFICULTY.MAX_SCROLL_SPEED * progress * progress;
  }
}
