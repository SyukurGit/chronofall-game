// Chronofall: Main Client Entrypoint & 60 FPS Fixed-Step Runtime
// Coordinates game loop timing, screenshot capture staging hooks, and responsive viewport sizing.

import { CONFIG } from './config.js';
import { InputManager } from './input.js';
import { World } from './world.js';
import { Renderer } from './render.js';
import { stageScreenshot } from './shots.js';
import { audio } from './audio.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('viewport');
  if (!canvas) {
    console.error('[Chronofall] Fatal: Canvas #viewport element not found.');
    return;
  }

  const input = new InputManager(canvas);
  const world = new World();
  const renderer = new Renderer(canvas);

  // Audio unlock listener on first user interaction
  const unlockAudio = () => {
    audio.ensureContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // Check URL query parameters for automated screenshot staging (?shot=<name>)
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');

  if (shot) {
    console.log(`[Chronofall] Screenshot mode active: shot=${shot}`);
    stageScreenshot(world, shot);

    // Initial render
    renderer.render(world);

    // Expose hook and signal for headless Chromium capture
    window.__shotReady = true;
    window.__renderShot = () => renderer.render(world);

    window.addEventListener('resize', () => {
      renderer.render(world);
    });
    return;
  }

  // Normal Real-Time 60 FPS Game Loop
  let lastTime = performance.now();
  let accumulator = 0;

  function loop(currentTime) {
    const elapsed = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;
    accumulator += elapsed;

    while (accumulator >= CONFIG.FIXED_STEP) {
      world.update(CONFIG.FIXED_STEP, input);
      accumulator -= CONFIG.FIXED_STEP;
    }

    renderer.render(world);
    input.flush();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
