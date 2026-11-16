// Chronofall: Input Management System
// Maps keyboard bindings and normalizes mouse/touch coordinates relative to the 1280x720 internal viewport.

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.justPressedKeys = new Set();

    this.mouse = {
      x: 640,
      y: 360,
      down: false,
      rightDown: false,
      justClicked: false,
    };

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      if (!this.keys.has(code)) {
        this.justPressedKeys.add(code);
      }
      this.keys.add(code);

      // Prevent page scrolling on gaming keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.mouse.down = true;
        this.mouse.justClicked = true;
      } else if (e.button === 2) {
        this.mouse.rightDown = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.down = false;
      if (e.button === 2) this.mouse.rightDown = false;
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isDown(code) {
    return this.keys.has(code);
  }

  justPressed(code) {
    return this.justPressedKeys.has(code);
  }

  flush() {
    this.justPressedKeys.clear();
    this.mouse.justClicked = false;
  }
}
