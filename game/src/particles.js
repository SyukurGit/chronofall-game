// Chronofall: High-Performance Particle & Visual Effects Engine
// Simulates brass sparks, steam plumes, flying gears, temporal distortion ripples, and floating combat feedback.

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.ripples = [];
    this.shakeIntensity = 0;
    this.shakeDecay = 0.92;
    this.shakeX = 0;
    this.shakeY = 0;
  }

  emitSparks(x, y, count = 10, color = '#ffc366') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 260;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        color,
        alpha: 1.0,
        decay: 1.8 + Math.random() * 2.2,
      });
    }
  }

  emitSteam(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        type: 'steam',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 6 + Math.random() * 10,
        growth: 24,
        alpha: 0.55,
        decay: 0.85,
      });
    }
  }

  emitFlyingGears(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 180;
      this.particles.push({
        type: 'gear',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 18,
        radius: 4 + Math.random() * 5,
        color: '#d4a259',
        alpha: 1.0,
        decay: 1.2,
      });
    }
  }

  emitTemporalRipple(x, y, maxRadius = 140, color = '#3fe8e0') {
    this.ripples.push({
      x,
      y,
      radius: 8,
      maxRadius,
      growthRate: 380,
      alpha: 0.85,
      color,
    });
  }

  addFloatingText(x, y, text, color = '#ffebaa', size = 16) {
    this.floatingTexts.push({
      x,
      y,
      vy: -55,
      text,
      color,
      size,
      alpha: 1.0,
      decay: 1.4,
    });
  }

  triggerScreenShake(intensity = 8) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  update(dt, timeDilation = 1.0) {
    const effectiveDt = dt * timeDilation;

    // Screen Shake
    if (this.shakeIntensity > 0.1) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity *= Math.pow(this.shakeDecay, dt * 60);
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeIntensity = 0;
    }

    // Particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * effectiveDt;
      p.y += p.vy * effectiveDt;
      p.alpha -= p.decay * effectiveDt;

      if (p.type === 'steam') {
        p.radius += p.growth * effectiveDt;
      } else if (p.type === 'gear') {
        p.rotation += p.rotSpeed * effectiveDt;
        p.vy += 220 * effectiveDt; // gravity for metal debris
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Ripples update
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.growthRate * effectiveDt;
      r.alpha = 1.0 - (r.radius / r.maxRadius);
      if (r.radius >= r.maxRadius || r.alpha <= 0) {
        this.ripples.splice(i, 1);
      }
    }

    // Floating text update (runs on real dt for smooth legibility)
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= ft.decay * dt;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    // Render Ripples
    for (const r of this.ripples) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Render Particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'steam') {
        ctx.fillStyle = 'rgba(210, 220, 230, 0.35)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'gear') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        // Teeth
        ctx.fillStyle = '#9b7138';
        for (let t = 0; t < 4; t++) {
          ctx.rotate(Math.PI / 2);
          ctx.fillRect(-p.radius * 1.3, -1.5, p.radius * 2.6, 3);
        }
      }
      ctx.restore();
    }

    // Render Floating Text
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = `bold ${ft.size}px -apple-system, sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }
}
