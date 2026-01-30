import Phaser from 'phaser';
import { GameColor, COLOR_HEX, VISUAL, PLATFORM } from '../constants';

export class Platform extends Phaser.Physics.Arcade.Sprite {
  public readonly platformColor: GameColor;
  private dashedBorder: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, color: GameColor) {
    super(scene, x, y, `platform_${color}`);
    
    this.platformColor = color;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setTint(COLOR_HEX[color]);
    this.setAlpha(VISUAL.PLATFORM_INACTIVE_ALPHA);

    this.dashedBorder = scene.add.graphics();
    this.drawDashedBorder(COLOR_HEX[color]);
    this.dashedBorder.setVisible(true);
  }

  private drawDashedBorder(color: number): void {
    const w = PLATFORM.WIDTH;
    const h = PLATFORM.HEIGHT;
    const dashLen = 6;
    const gapLen = 4;
    
    this.dashedBorder.lineStyle(2, color, 0.8);
    
    const drawDashedLine = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / len;
      const ny = dy / len;
      
      let pos = 0;
      let drawing = true;
      
      while (pos < len) {
        const segLen = drawing ? dashLen : gapLen;
        const endPos = Math.min(pos + segLen, len);
        
        if (drawing) {
          this.dashedBorder.beginPath();
          this.dashedBorder.moveTo(x1 + nx * pos, y1 + ny * pos);
          this.dashedBorder.lineTo(x1 + nx * endPos, y1 + ny * endPos);
          this.dashedBorder.strokePath();
        }
        
        pos = endPos;
        drawing = !drawing;
      }
    };

    const left = this.x - w / 2;
    const top = this.y - h / 2;
    
    drawDashedLine(left, top, left + w, top);
    drawDashedLine(left + w, top, left + w, top + h);
    drawDashedLine(left + w, top + h, left, top + h);
    drawDashedLine(left, top + h, left, top);
  }

  setSolid(isSolid: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = isSolid;
    this.setAlpha(isSolid ? VISUAL.PLATFORM_ACTIVE_ALPHA : VISUAL.PLATFORM_INACTIVE_ALPHA);
    this.dashedBorder.setVisible(!isSolid);
  }

  destroy(fromScene?: boolean): void {
    this.dashedBorder.destroy();
    super.destroy(fromScene);
  }
}
