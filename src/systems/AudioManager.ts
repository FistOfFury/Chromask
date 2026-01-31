import Phaser from 'phaser';
import { GameColor, AUDIO, COLOR_NAMES, SoundSettings, SoundMode, SoundCategory } from '../constants';

export class AudioManager {
  private scene: Phaser.Scene;
  private backgroundMusic: Phaser.Sound.BaseSound | null = null;
  private lastBruhTime: number = 0;
  private soundSettings: SoundSettings;

  constructor(scene: Phaser.Scene, soundSettings: SoundSettings) {
    this.scene = scene;
    this.soundSettings = soundSettings;
  }

  private isCategoryEnabled(category: SoundCategory): boolean {
    if (this.soundSettings.mode === SoundMode.OFF) {
      return false;
    }
    if (this.soundSettings.mode === SoundMode.ON) {
      return true;
    }
    // CUSTOM mode - check individual toggle
    return this.soundSettings.custom[category];
  }

  // Play random jump sound from 4 options
  playJump(): void {
    if (!this.isCategoryEnabled(SoundCategory.JUMP)) return;
    const keys = AUDIO.KEYS.JUMP;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.scene.sound.play(randomKey);
  }

  // Play color-specific platform hit sound
  playPlatformHit(color: GameColor): void {
    if (!this.isCategoryEnabled(SoundCategory.LANDING)) return;
    if (color === GameColor.NONE) return;
    const colorName = COLOR_NAMES[color];
    const key = `${AUDIO.KEYS.PLATFORM_HIT}-${colorName}`;
    this.scene.sound.play(key);
  }

  playGameStart(): void {
    if (!this.isCategoryEnabled(SoundCategory.UI)) return;
    this.scene.sound.play(AUDIO.KEYS.GAME_START);
  }

  playGameOver(): void {
    if (!this.isCategoryEnabled(SoundCategory.UI)) return;
    this.scene.sound.play(AUDIO.KEYS.GAME_OVER);
  }

  playColorToggle(): void {
    if (!this.isCategoryEnabled(SoundCategory.UI)) return;
    this.scene.sound.play(AUDIO.KEYS.COLOR_TOGGLE);
  }

  // Play random BRUH sound with cooldown
  playBruh(): void {
    if (!this.isCategoryEnabled(SoundCategory.UI)) return;
    const now = Date.now();
    if (now - this.lastBruhTime < AUDIO.CONFIG.BRUH_COOLDOWN_MS) return;
    
    this.lastBruhTime = now;
    const keys = AUDIO.KEYS.BRUH;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.scene.sound.play(randomKey);
  }

  startBackgroundMusic(): void {
    if (!this.isCategoryEnabled(SoundCategory.MUSIC)) return;
    if (this.backgroundMusic) return;
    
    this.backgroundMusic = this.scene.sound.add(AUDIO.KEYS.MUSIC, {
      loop: true,
      rate: AUDIO.CONFIG.MUSIC_MIN_RATE,
    });
    this.backgroundMusic.play();
  }

  // Update music playback rate based on scroll speed (0-100 → 1.0-1.5)
  updateMusicRate(scrollSpeed: number): void {
    if (!this.backgroundMusic) return;
    
    const normalizedSpeed = Math.min(scrollSpeed / 100, 1);
    const rate = AUDIO.CONFIG.MUSIC_MIN_RATE + 
      (AUDIO.CONFIG.MUSIC_MAX_RATE - AUDIO.CONFIG.MUSIC_MIN_RATE) * normalizedSpeed;
    
    // Phaser BaseSound has setRate method
    (this.backgroundMusic as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound).setRate(rate);
  }

   stopAll(): void {
     this.scene.sound.stopAll();
     this.backgroundMusic = null;
   }

   updateSoundSettings(newSettings: SoundSettings): void {
     this.soundSettings = newSettings;
     
     if (this.backgroundMusic && !this.isCategoryEnabled(SoundCategory.MUSIC)) {
       this.backgroundMusic.stop();
       this.backgroundMusic = null;
     }
   }
}
