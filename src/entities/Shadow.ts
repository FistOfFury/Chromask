import Phaser from 'phaser';
import { VISUAL } from '../constants';

export class Shadow {
  private graphics: Phaser.GameObjects.Graphics;
  private depth: number;

  constructor(scene: Phaser.Scene, depth: number = -10) {
    this.graphics = scene.add.graphics();
    this.depth = depth;
    this.graphics.setDepth(depth);
  }

  update(
    x: number,
    y: number,
    width: number,
    height: number,
    isGrounded: boolean = false,
    cameraScrollY: number = 0,
    cameraHeight: number = 720,
    lightAngle: number = VISUAL.SHADOW_LIGHT_ANGLE
  ): void {
    this.graphics.clear();

    if (!isGrounded) {
      return;
    }

    const baseAlpha = VISUAL.SHADOW_ALPHA;
    const entityBottomY = y + height / 2;

    const screenBottom = cameraScrollY + cameraHeight;
    const maxShadowLength = 500;
    const shadowLength = Math.min(screenBottom - entityBottomY, maxShadowLength);

    if (shadowLength <= 0) {
      return;
    }

    const lightAngleRad = (lightAngle * Math.PI) / 180;
    const lightDirX = -Math.cos(lightAngleRad);

    const spreadOffset = VISUAL.SHADOW_SPREAD;
    const steps = VISUAL.SHADOW_GRADIENT_STEPS;

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const nextT = (i + 1) / steps;

      const alpha = baseAlpha * (1 - t);
      if (alpha <= 0.001) continue;

      const yTop = entityBottomY + t * shadowLength;
      const yBottom = entityBottomY + nextT * shadowLength;

      const widthAtTop = width + t * spreadOffset * 2;
      const widthAtBottom = width + nextT * spreadOffset * 2;

      const xOffsetTop = t * shadowLength * lightDirX;
      const xOffsetBottom = nextT * shadowLength * lightDirX;

      const x1 = Math.round(x - widthAtTop / 2 + xOffsetTop);
      const x2 = Math.round(x + widthAtTop / 2 + xOffsetTop);
      const x3 = Math.round(x + widthAtBottom / 2 + xOffsetBottom);
      const x4 = Math.round(x - widthAtBottom / 2 + xOffsetBottom);
      const y1 = Math.round(yTop);
      const y2 = Math.round(yBottom);

      this.graphics.fillStyle(0x000000, alpha);
      this.graphics.beginPath();
      this.graphics.moveTo(x1, y1);
      this.graphics.lineTo(x2, y1);
      this.graphics.lineTo(x3, y2);
      this.graphics.lineTo(x4, y2);
      this.graphics.closePath();
      this.graphics.fillPath();
    }
  }

  setDepth(depth: number): void {
    this.depth = depth;
    this.graphics.setDepth(depth);
  }

  getDepth(): number {
    return this.depth;
  }

  clear(): void {
    this.graphics.clear();
  }

  destroy(): void {
    this.graphics.destroy();
  }
}
