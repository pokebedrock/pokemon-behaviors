import type { RideableData } from "../types";

/**
 * All rideable Pokemon mapped to their seat configuration.
 * Key is Pokemon name (without "pokemon:" prefix).
 */
export const RIDEABLE_POKEMON: Record<string, RideableData> = {
  // ============================================
  // Land Mounts
  // ============================================
  arcanine: {
    seatPosition: [0, 1.8, 0],
  },
  rapidash: {
    seatPosition: [0, 1.8, 0],
  },
  dodrio: {
    seatPosition: [0, 1.8, 0],
  },
  tauros: {
    seatPosition: [0, 1.5, 0],
  },
  rhydon: {
    seatPosition: [0, 2, 0],
  },
  rhyperior: {
    seatPosition: [0, 2.2, 0],
  },
  stantler: {
    seatPosition: [0, 1.6, 0],
  },
  donphan: {
    seatPosition: [0, 1.5, 0],
  },
  zebstrika: {
    seatPosition: [0, 1.8, 0],
  },
  sawsbuck: {
    seatPosition: [0, 1.7, 0],
  },
  bouffalant: {
    seatPosition: [0, 1.6, 0],
  },
  gogoat: {
    seatPosition: [0, 1.5, 0],
  },
  mudsdale: {
    seatPosition: [0, 2, 0],
  },

  // ============================================
  // Air Mounts
  // ============================================
  charizard: {
    seatPosition: [0, 2.5, 0.3],
  },
  pidgeot: {
    seatPosition: [0, 1.5, 0],
  },
  aerodactyl: {
    seatPosition: [0, 1.8, 0],
  },
  dragonite: {
    seatPosition: [0, 2.2, 0],
  },
  articuno: {
    seatPosition: [0, 1.8, 0],
  },
  zapdos: {
    seatPosition: [0, 1.8, 0],
  },
  moltres: {
    seatPosition: [0, 2, 0],
  },
  skarmory: {
    seatPosition: [0, 1.5, 0],
  },
  lugia: {
    seatPosition: [0, 2.5, 0],
  },
  hooh: {
    seatPosition: [0, 2.2, 0],
  },
  salamence: {
    seatPosition: [0, 2, 0],
  },
  rayquaza: {
    seatPosition: [0, 3, 0],
  },
  staraptor: {
    seatPosition: [0, 1.5, 0],
  },
  honchkrow: {
    seatPosition: [0, 1.5, 0],
  },
  garchomp: {
    seatPosition: [0, 2, 0],
  },
  braviary: {
    seatPosition: [0, 1.5, 0],
  },
  hydreigon: {
    seatPosition: [0, 2, 0],
  },
  noivern: {
    seatPosition: [0, 1.8, 0],
  },
  corviknight: {
    seatPosition: [0, 1.8, 0],
  },

  // ============================================
  // Water Mounts
  // ============================================
  lapras: {
    seatPosition: [0, 2.0, 0],
  },
  gyarados: {
    seatPosition: [0, 3.0, -0.5],
  },
  blastoise: {
    seatPosition: [0, 1.8, -0.3],
  },
  wailord: {
    seatPosition: [0, 4, 0],
  },
  milotic: {
    seatPosition: [0, 1.5, 0],
  },
  sharpedo: {
    seatPosition: [0, 1.2, 0],
  },
  kyogre: {
    seatPosition: [0, 2.5, 0],
  },
  samurott: {
    seatPosition: [0, 1.8, 0],
  },
  jellicent: {
    seatPosition: [0, 2, 0],
  },
};

/**
 * Check if a Pokemon is rideable.
 */
export function isRideable(name: string): boolean {
  return name.toLowerCase() in RIDEABLE_POKEMON;
}

/**
 * Get rideable data for a Pokemon.
 */
export function getRideableData(name: string): RideableData | undefined {
  return RIDEABLE_POKEMON[name.toLowerCase()];
}
