import { COMBO } from '../constants';

export class ComboSystem {
  private consecutiveLands: number = 0;
  private jumpStarted: boolean = false;

  /** Call when player initiates a jump */
  onJumpStart(): void {
    this.jumpStarted = true;
  }

  /** Call when player lands on a NEW platform (isContacted() was false) */
  onNewPlatformLand(): void {
    if (this.jumpStarted) {
      this.consecutiveLands++;
      this.jumpStarted = false;
    }
  }

  /** Call when player lands on a VISITED platform or falls without landing */
  onComboBreak(): void {
    // Only break combo if we were actually in a jump
    // (collision fires every frame while standing, ignore those)
    if (this.jumpStarted) {
      this.consecutiveLands = 0;
      this.jumpStarted = false;
    }
  }

  /** Returns current combo count (0 if inactive) */
  getComboCount(): number {
    return this.consecutiveLands >= COMBO.ACTIVATION_THRESHOLD 
      ? this.consecutiveLands 
      : 0;
  }

  /** Returns true if combo is active (≥3 lands) */
  isComboActive(): boolean {
    return this.consecutiveLands >= COMBO.ACTIVATION_THRESHOLD;
  }

  /** Returns jump velocity multiplier (1.0 if no combo, up to MAX_JUMP_MULTIPLIER) */
  getJumpMultiplier(): number {
    if (!this.isComboActive()) return 1.0;
    const bonusLands = this.consecutiveLands - COMBO.ACTIVATION_THRESHOLD + 1;
    return Math.min(
      1 + bonusLands * COMBO.JUMP_MULTIPLIER_PER_LAND,
      COMBO.MAX_JUMP_MULTIPLIER
    );
  }

  /** Returns scale pulse amount for current combo (1.0 if inactive) */
  getScalePulse(): number {
    if (!this.isComboActive()) return 1.0;
    const bonusLands = this.consecutiveLands - COMBO.ACTIVATION_THRESHOLD;
    return Math.min(
      COMBO.BASE_SCALE_PULSE + bonusLands * COMBO.SCALE_PULSE_PER_COMBO,
      COMBO.MAX_SCALE_PULSE
    );
  }

  /** Reset combo state (for new game) */
  reset(): void {
    this.consecutiveLands = 0;
    this.jumpStarted = false;
  }
}
