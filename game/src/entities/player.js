// Chronofall: Player Entity (The Aegis Warden)
// Steampunk brass combat platform featuring dual articulating turrets, pneumatic dashes, and aether shielding.

import { CONFIG } from '../config.js';
import { audio } from '../audio.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = CONFIG.PLAYER.RADIUS;
    this.speed = CONFIG.PLAYER.MOVE_SPEED;

    this.maxHp = CONFIG.PLAYER.INITIAL_CORE_HP;
    this.hp = this.maxHp;
    this.armor = CONFIG.PLAYER.BASE_ARMOR;

    this.turretAngle = 0;
    this.currentWeapon = 'KINETIC_CANNON';
    this.fireCooldown = 0;

    this.invulnTimer = 0;
    this.heat = 0; // weapon thermal load
    this.maxHeat = 100;
  }

  update(dt, input, workshop, temporal, particles, projectBullet) {
    // Movement calculation
    let mx = 0;
    let my = 0;
    if (input.isDown('KeyW') || input.isDown('ArrowUp')) my -= 1;
    if (input.isDown('KeyS') || input.isDown('ArrowDown')) my += 1;
    if (input.isDown('KeyA') || input.isDown('ArrowLeft')) mx -= 1;
    if (input.isDown('KeyD') || input.isDown('ArrowRight')) mx += 1;

    const len = Math.hypot(mx, my);
    if (len > 0) {
      mx /= len;
      my /= len;
      const targetSpeed = this.speed * workshop.speedMultiplier;
      this.vx = mx * targetSpeed;
      this.vy = my * targetSpeed;

      // Emit subtle steam when moving
      if (Math.random() < 0.25) {
        particles.emitSteam(this.x - mx * 20, this.y - my * 20, 1);
      }
    } else {
      this.vx *= 0.82;
      this.vy *= 0.82;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Bounds containment (Citadel Platform: 1280x720 padding 40px)
    this.x = Math.max(50, Math.min(CONFIG.CANVAS_WIDTH - 50, this.x));
    this.y = Math.max(50, Math.min(CONFIG.CANVAS_HEIGHT - 50, this.y));

    // Turret rotation tracking mouse pointer
    const dx = input.mouse.x - this.x;
    const dy = input.mouse.y - this.y;
    this.turretAngle = Math.atan2(dy, dx);

    // Fire cooldown management
    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt;
    }
    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
    }

    // Weapon firing
    if (input.mouse.down && this.fireCooldown <= 0) {
      this.fire(workshop, temporal, particles, projectBullet);
    }

    // Weapon hotkeys (1: Repeater, 2: Mortar, 3: Lance)
    if (input.justPressed('Digit1')) this.currentWeapon = 'KINETIC_CANNON';
    if (input.justPressed('Digit2')) this.currentWeapon = 'STEAM_MORTAR';
    if (input.justPressed('Digit3')) this.currentWeapon = 'AETHER_LANCE';
  }

  fire(workshop, temporal, particles, projectBullet) {
    const weapon = CONFIG.WEAPONS[this.currentWeapon];
    if (!weapon) return;

    const fireRate = weapon.fireRate / workshop.fireRateMultiplier;
    this.fireCooldown = fireRate;

    const cos = Math.cos(this.turretAngle);
    const sin = Math.sin(this.turretAngle);

    if (this.currentWeapon === 'KINETIC_CANNON') {
      audio.playFireRepeater();
      // Twin barrels offset
      const perpX = -sin * 8;
      const perpY = cos * 8;
      projectBullet({
        x: this.x + cos * 25 + perpX,
        y: this.y + sin * 25 + perpY,
        vx: cos * weapon.speed,
        vy: sin * weapon.speed,
        damage: weapon.damage * workshop.damageMultiplier,
        radius: 4,
        pierce: 1,
        color: weapon.color,
      });
      projectBullet({
        x: this.x + cos * 25 - perpX,
        y: this.y + sin * 25 - perpY,
        vx: cos * weapon.speed,
        vy: sin * weapon.speed,
        damage: weapon.damage * workshop.damageMultiplier,
        radius: 4,
        pierce: 1,
        color: weapon.color,
      });
      particles.emitSparks(this.x + cos * 30, this.y + sin * 30, 4, '#ffc366');
    } else if (this.currentWeapon === 'STEAM_MORTAR') {
      audio.playFireMortar();
      projectBullet({
        x: this.x + cos * 30,
        y: this.y + sin * 30,
        vx: cos * weapon.speed,
        vy: sin * weapon.speed,
        damage: weapon.damage * workshop.damageMultiplier,
        radius: 9,
        isMortar: true,
        splashRadius: weapon.splashRadius,
        pierce: 1,
        color: weapon.color,
      });
      particles.emitSteam(this.x + cos * 30, this.y + sin * 30, 8);
    } else if (this.currentWeapon === 'AETHER_LANCE') {
      audio.playFireBeam();
      projectBullet({
        x: this.x + cos * 32,
        y: this.y + sin * 32,
        vx: cos * weapon.speed,
        vy: sin * weapon.speed,
        damage: weapon.damage * workshop.damageMultiplier,
        radius: 6,
        pierce: weapon.pierce + workshop.pierceBonus,
        isBeam: true,
        color: weapon.color,
      });
      particles.emitTemporalRipple(this.x + cos * 32, this.y + sin * 32, 50, '#3fe8e0');
    }
  }

  takeDamage(amount, particles) {
    if (this.invulnTimer > 0) return;
    const mitigated = Math.max(1, amount - this.armor);
    this.hp -= mitigated;
    this.invulnTimer = 0.4;
    audio.playHit();
    particles.triggerScreenShake(7);
    particles.addFloatingText(this.x, this.y - 25, `-${Math.round(mitigated)}`, '#ff4433', 18);
  }
}
