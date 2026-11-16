// Chronofall: Aegis of the Clockwork Citadel - Game Configuration & Constants
// Defines core balancing parameters, color palettes, weapon archetypes, and wave progressions

export const CONFIG = {
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,
  TARGET_FPS: 60,
  FIXED_STEP: 1 / 60,

  PALETTE: {
    BG_DARK: '#0b0907',
    BG_PANEL: '#140f0a',
    BORDER_BRASS: '#7a5626',
    BORDER_HIGHLIGHT: '#d4a259',
    BRONZE_LIGHT: '#f3c382',
    GOLD_METALLIC: '#e5b857',
    AETHER_CYAN: '#3fe8e0',
    AETHER_GLOW: 'rgba(63, 232, 224, 0.45)',
    STEAM_WHITE: 'rgba(230, 235, 240, 0.65)',
    RUST_RED: '#b83b28',
    RUST_ORANGE: '#e06126',
    HEAT_AMBER: '#ff9d26',
    VOID_SHADOW: 'rgba(5, 3, 2, 0.85)',
  },

  PLAYER: {
    INITIAL_CORE_HP: 1000,
    INITIAL_AETHER: 100,
    MAX_AETHER: 100,
    AETHER_REGEN: 8, // per second
    MOVE_SPEED: 260,
    BASE_ARMOR: 10,
    RADIUS: 32,
    TURRET_ROTATION_SPEED: 9.5,
  },

  TEMPORAL: {
    DILATION_FACTOR: 0.28, // Slow-mo speed
    DILATION_DRAIN: 24,    // Aether per second
    SURGE_DURATION: 4.5,   // Seconds of overdrive
    SURGE_COOLDOWN: 14.0,  // Cooldown in seconds
    REWIND_SECONDS: 2.0,   // Rewind window
  },

  WEAPONS: {
    KINETIC_CANNON: {
      name: 'Twin Brass Repeater',
      fireRate: 0.12, // seconds between shots
      damage: 28,
      speed: 720,
      range: 850,
      cost: 0,
      color: '#ffc366',
    },
    STEAM_MORTAR: {
      name: 'Pneumatic Steam Flak',
      fireRate: 0.55,
      damage: 95,
      splashRadius: 90,
      speed: 460,
      range: 750,
      cost: 15,
      color: '#e69542',
    },
    AETHER_LANCE: {
      name: 'Resonance Beam Piercer',
      fireRate: 0.85,
      damage: 180,
      pierce: 5,
      speed: 1200,
      range: 950,
      cost: 25,
      color: '#3fe8e0',
    },
  },

  WAVES: [
    {
      cycle: 1,
      title: 'Cycle I: The Scrapper Vanguard',
      duration: 38,
      enemyCount: 22,
      types: ['scrapper', 'drifter'],
      rewardAether: 120,
      flavor: 'Distant klaxons echo as lightweight rust scouts swarm the perimeter.'
    },
    {
      cycle: 2,
      title: 'Cycle II: Gear-Grinder Incursion',
      duration: 44,
      enemyCount: 32,
      types: ['scrapper', 'drifter', 'spitter'],
      rewardAether: 180,
      flavor: 'High-pressure brass spitters deploy pneumatic shrapnel.'
    },
    {
      cycle: 3,
      title: 'Cycle III: The Steam Ram Cohort',
      duration: 50,
      enemyCount: 40,
      types: ['drifter', 'spitter', 'steam_ram'],
      rewardAether: 240,
      flavor: 'Heavy plated rams charge directly into the Citadel gate.'
    },
    {
      cycle: 4,
      title: 'Cycle IV: Chrono-Leech Eclipse',
      duration: 55,
      enemyCount: 48,
      types: ['spitter', 'chrono_leech', 'steam_ram'],
      rewardAether: 310,
      flavor: 'Parasitic leeches latch onto temporal conduits, distorting reality.'
    },
    {
      cycle: 5,
      title: 'Cycle V: Ironclad Siege Engines',
      duration: 60,
      enemyCount: 56,
      types: ['scrapper', 'steam_ram', 'chrono_leech', 'goliath'],
      rewardAether: 380,
      flavor: 'Walking blast-furnaces deploy volcanic slag across the battlefield.'
    },
    {
      cycle: 6,
      title: 'Cycle VI: The Tempest of Gears',
      duration: 65,
      enemyCount: 68,
      types: ['spitter', 'chrono_leech', 'goliath', 'vanguard_elite'],
      rewardAether: 450,
      flavor: 'Relentless waves converge in synchronous clockwork precision.'
    },
    {
      cycle: 7,
      title: 'Cycle VII: The Oxidized Colossus',
      duration: 80,
      enemyCount: 80,
      types: ['goliath', 'vanguard_elite', 'titan_boss'],
      rewardAether: 600,
      flavor: 'The ancient Titan awakens from the rust chasm to shatter the core.'
    }
  ],

  UPGRADES: [
    {
      id: 'kinetic_overclock',
      tree: 'kinetic',
      tier: 1,
      name: 'High-Torque Escapement',
      desc: '+25% Repeater attack speed, +10% projectile velocity.',
      cost: 90,
    },
    {
      id: 'steam_pressurization',
      tree: 'kinetic',
      tier: 2,
      name: 'Pneumatic Super-Heater',
      desc: '+35% Mortar blast radius and leaves lingering steam hazard.',
      cost: 160,
    },
    {
      id: 'aether_prism',
      tree: 'aether',
      tier: 1,
      name: 'Prismatic Focusing Ring',
      desc: 'Beam pierces all targets and refracts secondary pulses.',
      cost: 120,
    },
    {
      id: 'temporal_stabilizer',
      tree: 'chrono',
      tier: 1,
      name: 'Chrono-Harmonic Gyro',
      desc: 'Temporal Dilation lasts 50% longer with 30% reduced aether cost.',
      cost: 140,
    },
    {
      id: 'bastion_plating',
      tree: 'citadel',
      tier: 1,
      name: 'Clockwork Reactive Armor',
      desc: '+300 Citadel Core HP and reflects 20% kinetic impact back to foes.',
      cost: 150,
    },
  ],
};
