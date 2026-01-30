import Phaser from 'phaser';
import { Platform } from '../entities/Platform';
import { GameColor, PLATFORM, DIFFICULTY, GAME, CAMERA } from '../constants';

export class PlatformSpawner {
  private scene: Phaser.Scene;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private lastSpawnY: number;
  private currentMaxGapY: number;

  constructor(scene: Phaser.Scene, platforms: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.platforms = platforms;
    this.lastSpawnY = GAME.HEIGHT - 100;
    this.currentMaxGapY = DIFFICULTY.INITIAL_MAX_GAP_Y;
  }

  private getAvailableColors(height: number): GameColor[] {
    const absHeight = Math.abs(height);

    if (absHeight < DIFFICULTY.PHASE_2_HEIGHT) {
      return [GameColor.RED, GameColor.GREEN, GameColor.BLUE];
    } else if (absHeight < DIFFICULTY.PHASE_3_HEIGHT) {
      return [
        GameColor.RED,
        GameColor.GREEN,
        GameColor.BLUE,
        GameColor.YELLOW,
        GameColor.MAGENTA,
        GameColor.CYAN,
      ];
    } else {
      return [
        GameColor.RED,
        GameColor.GREEN,
        GameColor.BLUE,
        GameColor.YELLOW,
        GameColor.MAGENTA,
        GameColor.CYAN,
        GameColor.WHITE,
      ];
    }
  }

  private createPlatform(x: number, y: number, color: GameColor): Platform {
    const platform = new Platform(this.scene, x, y, color);
    this.platforms.add(platform);
    return platform;
  }

  spawnPlatformsAbove(currentY: number): void {
    const spawnUntil = currentY - CAMERA.SPAWN_AHEAD;

    while (this.lastSpawnY > spawnUntil) {
      const gapY = Phaser.Math.Between(PLATFORM.MIN_GAP_Y, this.currentMaxGapY);
      this.lastSpawnY -= gapY;

      const margin = PLATFORM.WIDTH / 2 + 10;
      const x = Phaser.Math.Between(margin, GAME.WIDTH - margin);

      const colors = this.getAvailableColors(this.lastSpawnY);
      const color = Phaser.Math.RND.pick(colors);

      this.createPlatform(x, this.lastSpawnY, color);
    }
  }

  cullPlatformsBelow(cameraScrollY: number): void {
    const cullY = cameraScrollY + GAME.HEIGHT + CAMERA.CULL_BEHIND;

    this.platforms.getChildren().forEach((child) => {
      const platform = child as Platform;
      if (platform.y > cullY) {
        platform.destroy();
      }
    });
  }

  updateDifficulty(heightClimbed: number): void {
    const progress = Math.min(heightClimbed / DIFFICULTY.MAX_DIFFICULTY_HEIGHT, 1);

    this.currentMaxGapY = Phaser.Math.Linear(
      DIFFICULTY.INITIAL_MAX_GAP_Y,
      DIFFICULTY.FINAL_MAX_GAP_Y,
      progress
    );
  }

  createInitialPlatforms(): void {
    this.createPlatform(GAME.WIDTH / 2, GAME.HEIGHT - 50, GameColor.RED);
    this.spawnPlatformsAbove(GAME.HEIGHT);
  }

  getPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    return this.platforms;
  }
}
