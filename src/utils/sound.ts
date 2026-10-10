/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple, zero-dependency Web Audio synthesizer for kid-friendly gamification sounds.
const SOUND_STORAGE_KEY = 'jumbo_linux_sound_enabled';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    try {
      const stored = localStorage.getItem(SOUND_STORAGE_KEY);
      if (stored !== null) {
        this.soundEnabled = stored === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
  }

  public toggle(): boolean {
    const next = !this.soundEnabled;
    this.setEnabled(next);
    if (next) {
      this.playCommandSuccess();
    }
    return next;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Subtle, cheerful ascending chime when a user enters a correct terminal command.
   * e.g., C5 (523Hz) -> G5 (784Hz) with soft sine envelope.
   */
  public playCommandSuccess(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: now, dur: 0.12 },        // C5
        { freq: 783.99, time: now + 0.08, dur: 0.22 } // G5
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        // Gentle volume curve (subtle, non-jarring)
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + dur);
      });
    } catch {
      // Audio fallback suppression
    }
  }

  /**
   * Crisp, ultra-subtle mechanical blip when Tab autocompletes a command or file.
   */
  public playTabCompletion(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1174, now + 0.06);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio fallback suppression
    }
  }

  /**
   * Sparkling mini-fanfare when a challenge level is successfully completed.
   * C5 -> E5 -> G5 -> C6 arpeggio with warm, bright release.
   */
  public playLevelComplete(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const arpeggio = [
        { freq: 523.25, time: now, dur: 0.14 },        // C5
        { freq: 659.25, time: now + 0.09, dur: 0.14 }, // E5
        { freq: 783.99, time: now + 0.18, dur: 0.18 }, // G5
        { freq: 1046.5, time: now + 0.27, dur: 0.55 }  // C6 (high, sweet sustain)
      ];

      arpeggio.forEach(({ freq, time, dur }, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Blend sine and slight triangle for celebratory warmth on the final note
        osc.type = index === arpeggio.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const peakVolume = index === arpeggio.length - 1 ? 0.18 : 0.14;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(peakVolume, time + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + dur);
      });
    } catch {
      // Audio fallback suppression
    }
  }
}

export const soundEffects = new SoundEffectsManager();
export const playCommandSuccessSound = () => soundEffects.playCommandSuccess();
export const playLevelCompleteSound = () => soundEffects.playLevelComplete();
export const playTabCompletionSound = () => soundEffects.playTabCompletion();
export const isSoundEnabled = () => soundEffects.isEnabled();
export const toggleSound = () => soundEffects.toggle();
