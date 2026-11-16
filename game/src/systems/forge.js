// Chronofall: The Clocksmith Workshop & Upgrade Matrix
// Handles technological advancement trees, brass forging, and relic installations between combat cycles.

import { CONFIG } from '../config.js';
import { audio } from '../audio.js';

export class WorkshopSystem {
  constructor() {
    this.aetherShards = 180;
    this.purchasedUpgrades = new Set();
    this.selectedIndex = 0;

    // Active modifiers
    this.fireRateMultiplier = 1.0;
    this.damageMultiplier = 1.0;
    this.speedMultiplier = 1.0;
    this.armorBonus = 0;
    this.pierceBonus = 0;
  }

  isUnlocked(upgradeId) {
    return this.purchasedUpgrades.has(upgradeId);
  }

  canAfford(upgradeId) {
    const up = CONFIG.UPGRADES.find(u => u.id === upgradeId);
    return up && this.aetherShards >= up.cost && !this.isUnlocked(upgradeId);
  }

  purchase(upgradeId, temporalSystem, player) {
    if (!this.canAfford(upgradeId)) return false;

    const up = CONFIG.UPGRADES.find(u => u.id === upgradeId);
    this.aetherShards -= up.cost;
    this.purchasedUpgrades.add(upgradeId);
    audio.playUpgrade();

    // Apply specific tech effects
    switch (upgradeId) {
      case 'kinetic_overclock':
        this.fireRateMultiplier *= 1.25;
        break;
      case 'steam_pressurization':
        this.damageMultiplier *= 1.35;
        break;
      case 'aether_prism':
        this.pierceBonus += 3;
        break;
      case 'temporal_stabilizer':
        if (temporalSystem) {
          temporalSystem.dilationEfficiency = 0.65;
        }
        break;
      case 'bastion_plating':
        if (player) {
          player.maxHp += 300;
          player.hp = Math.min(player.maxHp, player.hp + 300);
          this.armorBonus += 15;
        }
        break;
    }
    return true;
  }
}
