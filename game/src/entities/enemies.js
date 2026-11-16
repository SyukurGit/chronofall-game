// Chronofall: Enemy Entities (The Rust Swarm Cohort)
// Procedurally spawned clockwork automatons, steam drifters, pneumatic spitters, and the multi-phase Titan boss.

import { audio } from '../audio.js';

export class Enemy {
  constructor(type, x, y, waveNumber = 1) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.wave = waveNumber;
    this.isDead = false;

    this.configureArchetype();
  }

  configureArchetype() {
    switch (this.type) {
      case 'scrapper':
        this.radius = 16;
        this.maxHp = 45 + this.wave * 12;
        this.speed = 135 + Math.random() * 25;
        this.damage = 18;
        this.color = '#c46835';
        this.shardValue = 6;
        this.hasRanged = false;
        break;

      case 'drifter':
        this.radius = 20;
        this.maxHp = 80 + this.wave * 18;
        this.speed = 95;
        this.damage = 22;
        this.color = '#e08a46';
        this.shardValue = 12;
        this.hasRanged = true;
        this.shootTimer = 1.8 + Math.random() * 1.5;
        break;

      case 'spitter':
        this.radius = 24;
        this.maxHp = 140 + this.wave * 25;
        this.speed = 60;
        this.damage = 35;
        this.color = '#d45828';
        this.shardValue = 20;
        this.hasRanged = true;
        this.shootTimer = 2.4 + Math.random() * 1.2;
        break;

      case 'steam_ram':
        this.radius = 28;
        this.maxHp = 260 + this.wave * 40;
        this.speed = 80;
        this.damage = 50;
        this.color = '#8f4222';
        this.shardValue = 35;
        this.isCharging = false;
        this.chargeTimer = 3.0;
        break;

      case 'chrono_leech':
        this.radius = 22;
        this.maxHp = 180 + this.wave * 30;
        this.speed = 110;
        this.damage = 30;
        this.color = '#38b8b0';
        this.shardValue = 40;
        this.leechAether = true;
        break;

      case 'goliath':
        this.radius = 38;
        this.maxHp = 520 + this.wave * 80;
        this.speed = 50;
        this.damage = 65;
        this.color = '#732e1d';
        this.shardValue = 75;
        this.hasRanged = true;
        this.shootTimer = 2.0;
        break;

      case 'titan_boss':
        this.radius = 64;
        this.maxHp = 3200;
        this.speed = 38;
        this.damage = 110;
        this.color = '#5a1d12';
        this.shardValue = 450;
        this.isBoss = true;
        this.phase = 1;
        this.attackTimer = 2.0;
        this.bossShieldAngle = 0;
        break;

      default:
        this.radius = 18;
        this.maxHp = 50;
        this.speed = 100;
        this.damage = 20;
        this.color = '#a6542d';
        this.shardValue = 10;
    }
    this.hp = this.maxHp;
  }

  update(dt, player, spawnEnemyBullet, particles) {
    if (this.isDead) return;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    this.angle = Math.atan2(dy, dx);

    // AI movement logic
    if (this.type === 'steam_ram') {
      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) {
        this.isCharging = true;
        this.speed = 280;
        particles.emitSteam(this.x, this.y, 4);
        if (this.chargeTimer <= -1.2) {
          this.isCharging = false;
          this.speed = 80;
          this.chargeTimer = 4.0;
        }
      }
    }

    if (dist > 10) {
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Ranged attacks
    if (this.hasRanged && dist < 700) {
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = 2.2 + Math.random() * 1.0;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        spawnEnemyBullet({
          x: this.x + cos * (this.radius + 6),
          y: this.y + sin * (this.radius + 6),
          vx: cos * 240,
          vy: sin * 240,
          damage: this.damage,
          radius: 5,
          color: '#ff6c3b',
        });
        audio.playTick(0.6);
      }
    }

    // Boss mechanics
    if (this.isBoss) {
      this.bossShieldAngle += dt * 1.8;
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attackTimer = 3.0;
        // Radial blast
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          spawnEnemyBullet({
            x: this.x + Math.cos(a) * 60,
            y: this.y + Math.sin(a) * 60,
            vx: Math.cos(a) * 200,
            vy: Math.sin(a) * 200,
            damage: 35,
            radius: 7,
            color: '#ff4422',
          });
        }
        particles.emitTemporalRipple(this.x, this.y, 160, '#ff4422');
      }
    }
  }

  takeDamage(amount, particles, workshop) {
    this.hp -= amount;
    audio.playHit();
    particles.emitSparks(this.x, this.y, 4, '#ff9944');

    if (this.hp <= 0 && !this.isDead) {
      this.isDead = true;
      audio.playExplosion(this.isBoss ? 2.5 : 0.8);
      particles.emitFlyingGears(this.x, this.y, this.isBoss ? 16 : 5);
      particles.emitSteam(this.x, this.y, 8);
      particles.addFloatingText(this.x, this.y - 20, `+${this.shardValue} SHARDS`, '#ffcf66', 13);
      workshop.aetherShards += this.shardValue;
    }
  }
}
