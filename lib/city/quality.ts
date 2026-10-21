/** Deliberate quality changes with hysteresis, never a per-frame resolution oscillation. */
export class CityQuality {
  tier: number;
  private seconds = 0;
  private frames = 0;
  private slow = 0;
  private fast = 0;
  private ceiling:number;
  constructor(ceiling = 2) { this.ceiling=ceiling;this.tier = ceiling; }
  sample(dt: number) {
    if (!Number.isFinite(dt) || dt <= 0 || dt > .25) return false;
    this.seconds += dt; this.frames++;
    if (this.seconds < 2) return false;
    const fps = this.frames / this.seconds;
    this.seconds = this.frames = 0;
    this.slow = fps < 43 ? this.slow + 1 : 0;
    this.fast = fps > 57 ? this.fast + 1 : 0;
    const previous = this.tier;
    if (this.slow >= 2) { this.tier = Math.max(0, this.tier - 1); this.slow = 0; }
    if (this.fast >= 5) { this.tier = Math.min(this.ceiling, this.tier + 1); this.fast = 0; }
    return previous !== this.tier;
  }
  get pixelRatio() { return [.75, 1, 1.25][this.tier]; }
}
