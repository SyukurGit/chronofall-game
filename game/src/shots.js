// Chronofall: Deterministic Staging & Screenshot Generator
// Pre-configures deterministic states for the 4 competition screenshot views:
// 1. cover (Title & Architectural Portfolio)
// 2. combat (Temporal Dilation Core Battle)
// 3. workshop (The Clocksmith Forge & Tech Matrix)
// 4. victory (Debriefing & Rank S Evaluation)

import { GameState } from './world.js';
import { Enemy } from './entities/enemies.js';

export function stageScreenshot(world, shotName) {
  console.log(`[Staging] Configuring deterministic scene for shot: ${shotName}`);

  // Base setup
  world.stats.highScore = 38420;

  switch (shotName) {
    case 'cover':
    case '1-cover':
    case '1-cover.jpg':
    case 'start':
      world.state = GameState.TITLE;
      world.backgroundGears[0].angle = 0.35;
      world.backgroundGears[1].angle = 1.12;
      world.backgroundGears[2].angle = 0.78;
      break;

    case 'combat':
    case '2-combat':
    case '2-combat.jpg':
    case 'play':
      world.state = GameState.COMBAT;
      world.currentWaveIndex = 3; // Cycle IV
      world.waveTimer = 34;

      world.player.x = 600;
      world.player.y = 440;
      world.player.hp = 840;
      world.player.turretAngle = -0.45;
      world.player.currentWeapon = 'AETHER_LANCE';

      world.temporal.dilationActive = true;
      world.temporal.aether = 76;

      world.stats.score = 16840;
      world.workshop.aetherShards = 290;

      // Spawn active combat enemies
      world.enemies = [
        new Enemy('goliath', 960, 240, 4),
        new Enemy('chrono_leech', 420, 260, 4),
        new Enemy('steam_ram', 780, 520, 4),
        new Enemy('spitter', 280, 420, 4),
        new Enemy('scrapper', 720, 310, 4),
      ];

      // Staged projectiles
      world.playerBullets = [
        { x: 740, y: 380, vx: 900, vy: -400, damage: 180, radius: 7, pierce: 3, isBeam: true, color: '#3fe8e0' },
        { x: 860, y: 320, vx: 900, vy: -400, damage: 180, radius: 7, pierce: 2, isBeam: true, color: '#3fe8e0' },
      ];

      world.enemyBullets = [
        { x: 850, y: 280, vx: -200, vy: 140, damage: 30, radius: 6, color: '#ff5533' },
        { x: 520, y: 360, vx: 180, vy: 100, damage: 25, radius: 5, color: '#ff6633' },
      ];

      // Staged particles
      world.particles.emitTemporalRipple(600, 440, 180, '#3fe8e0');
      world.particles.emitSteam(780, 520, 10);
      world.particles.emitFlyingGears(960, 240, 8);
      world.particles.emitSparks(860, 320, 12, '#ffc366');
      world.particles.addFloatingText(960, 210, 'CRITICAL 360', '#3fe8e0', 18);
      world.particles.addFloatingText(600, 390, 'CHRONO DILATION', '#ffebaa', 14);
      break;

    case 'workshop':
    case '3-workshop':
    case '3-workshop.jpg':
    case 'forge':
      world.state = GameState.WORKSHOP;
      world.currentWaveIndex = 3;
      world.workshop.aetherShards = 340;
      world.workshop.purchasedUpgrades.add('kinetic_overclock');
      world.workshop.purchasedUpgrades.add('aether_prism');
      world.workshop.selectedIndex = 3; // Hovering on Chrono-Harmonic Gyro
      break;

    case 'victory':
    case '4-victory':
    case '4-victory.jpg':
    case 'end':
    case 'over':
      world.state = GameState.VICTORY;
      world.stats.cyclesSurvived = 7;
      world.stats.enemiesDestroyed = 186;
      world.stats.shotsFired = 842;
      world.stats.shotsHit = 716;
      world.stats.timeElapsed = 388;
      world.stats.score = 42950;
      world.workshop.aetherShards = 820;
      break;

    default:
      world.state = GameState.TITLE;
  }
}
