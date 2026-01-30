import { GameColor } from '../constants';

export class ColorSystem {
  private redEnabled = false;
  private greenEnabled = false;
  private blueEnabled = false;

  setColors(red: boolean, green: boolean, blue: boolean): void {
    this.redEnabled = red;
    this.greenEnabled = green;
    this.blueEnabled = blue;
  }

  isRedEnabled(): boolean {
    return this.redEnabled;
  }

  isGreenEnabled(): boolean {
    return this.greenEnabled;
  }

  isBlueEnabled(): boolean {
    return this.blueEnabled;
  }

  getActiveColor(): GameColor {
    let color = GameColor.NONE;
    if (this.redEnabled) color |= GameColor.RED;
    if (this.greenEnabled) color |= GameColor.GREEN;
    if (this.blueEnabled) color |= GameColor.BLUE;
    return color;
  }

  isColorActive(platformColor: GameColor): boolean {
    return this.getActiveColor() === platformColor;
  }

  reset(): void {
    this.redEnabled = false;
    this.greenEnabled = false;
    this.blueEnabled = false;
  }
}
