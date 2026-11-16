// Chronofall: Temporal Control & Flux System
// Manages real-time chronal dilation (time slow), aether reservoir consumption, and temporal shockwaves.

import { CONFIG } from '../config.js';
import { audio } from '../audio.js';

export class TemporalSystem {
  constructor() {
    this.aether = CONFIG.PLAYER.INITIAL_AETHER;
    this.maxAether = CONFIG.PLAYER.MAX_AETHER;
    this.aetherRegen = CONFIG.PLAYER.AETHER_REGEN;

    this.dilationActive = false;
    this.dilationMultiplier = CONFIG.TEMPORAL.DILATION_FACTOR;

    this.surgeActive = false;
    this.surgeTimer = 0;
    this.surgeCooldown = 0;

    this.dilationEfficiency = 1.0; // modified by workshop upgrades
  }

  toggleDilation() {
    if (this.dilationActive) {
      this.dilationActive = false;
      audio.playDilationWarp(false);
    } else {
      if (this.aether >= 15) {
        this.dilationActive = true;
        audio.playDilationWarp(true);
      }
    }
  }

  activateSurge() {
    if (this.surgeCooldown <= 0 && this.aether >= 35) {
      this.aether -= 35;
      this.surgeActive = true;
      this.surgeTimer = CONFIG.TEMPORAL.SURGE_DURATION;
      this.surgeCooldown = CONFIG.TEMPORAL.SURGE_COOLDOWN;
      audio.playDilationWarp(true);
      return true;
    }
    return false;
  }

  update(dt, particles, playerX, playerY) {
    // Regenerate Aether passively if dilation is off
    if (!this.dilationActive) {
      this.aether = Math.min(this.maxAether, this.aether + this.aetherRegen * dt);
    } else {
      // Drain Aether while dilating time
      const drainRate = CONFIG.TEMPORAL.DILATION_DRAIN * this.dilationEfficiency;
      this.aether -= drainRate * dt;
      if (this.aether <= 0) {
        this.aether = 0;
        this.dilationActive = false;
        audio.playDilationWarp(false);
        particles.addFloatingText(playerX, playerY - 40, 'AETHER DEPLETED', '#ff5544', 14);
      }
    }

    // Surge management
    if (this.surgeActive) {
      this.surgeTimer -= dt;
      if (this.surgeTimer <= 0) {
        this.surgeActive = false;
      }
    }

    if (this.surgeCooldown > 0) {
      this.surgeCooldown = Math.max(0, this.surgeCooldown - dt);
    }
  }

  getTimeScale() {
    if (this.dilationActive) {
      return this.dilationMultiplier;
    }
    return 1.0;
  }
}
