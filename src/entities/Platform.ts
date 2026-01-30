import Phaser from 'phaser';
import { GameColor, COLOR_HEX, VISUAL } from '../constants';

export class Platform extends Phaser.Physics.Arcade.Sprite {
  public readonly platformColor: GameColor;

  constructor(scene: Phaser.Scene, x: number, y: number, color: GameColor) {
    super(scene, x, y, `platform_${color}`);
    
    this.platformColor = color;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setTint(COLOR_HEX[color]);
    this.setAlpha(VISUAL.PLATFORM_INACTIVE_ALPHA);
  }

  setSolid(isSolid: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = isSolid;
    this.setAlpha(isSolid ? VISUAL.PLATFORM_ACTIVE_ALPHA : VISUAL.PLATFORM_INACTIVE_ALPHA);
  }

  animateSolidity(scene: Phaser.Scene, isSolid: boolean): void {
    scene.tweens.add({
      targets: this,
      alpha: isSolid ? VISUAL.PLATFORM_ACTIVE_ALPHA : VISUAL.PLATFORM_INACTIVE_ALPHA,
      duration: VISUAL.ALPHA_TRANSITION_MS,
      ease: 'Power2',
    });
    
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = isSolid;
  }
}
