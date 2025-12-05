/**
 * Rideable Pokemon Data
 *
 * Maps rideable Pokemon to their seat configuration.
 * Separated from movement data for cleaner organization.
 */

import type { SeatPosition } from "../behaviors/types";

/** Ride type determines control scheme and jump behavior */
export type RideType = "land" | "air" | "water";

/** Rideable configuration for a Pokemon */
export interface RideableData {
  /** Seat position offset [x, y, z] */
  seatPosition: SeatPosition;
  /** Determines jump/flight behavior */
  rideType: RideType;
}

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
    rideType: "land",
  },
  rapidash: {
    seatPosition: [0, 1.8, 0],
    rideType: "land",
  },
  dodrio: {
    seatPosition: [0, 1.8, 0],
    rideType: "land",
  },
  tauros: {
    seatPosition: [0, 1.5, 0],
    rideType: "land",
  },
  rhydon: {
    seatPosition: [0, 2, 0],
    rideType: "land",
  },
  rhyperior: {
    seatPosition: [0, 2.2, 0],
    rideType: "land",
  },
  stantler: {
    seatPosition: [0, 1.6, 0],
    rideType: "land",
  },
  donphan: {
    seatPosition: [0, 1.5, 0],
    rideType: "land",
  },
  zebstrika: {
    seatPosition: [0, 1.8, 0],
    rideType: "land",
  },
  sawsbuck: {
    seatPosition: [0, 1.7, 0],
    rideType: "land",
  },
  bouffalant: {
    seatPosition: [0, 1.6, 0],
    rideType: "land",
  },
  gogoat: {
    seatPosition: [0, 1.5, 0],
    rideType: "land",
  },
  mudsdale: {
    seatPosition: [0, 2, 0],
    rideType: "land",
  },

  // ============================================
  // Air Mounts
  // ============================================
  charizard: {
    seatPosition: [0, 2.5, 0.3],
    rideType: "air",
  },
  pidgeot: {
    seatPosition: [0, 1.5, 0],
    rideType: "air",
  },
  aerodactyl: {
    seatPosition: [0, 1.8, 0],
    rideType: "air",
  },
  dragonite: {
    seatPosition: [0, 2.2, 0],
    rideType: "air",
  },
  articuno: {
    seatPosition: [0, 1.8, 0],
    rideType: "air",
  },
  zapdos: {
    seatPosition: [0, 1.8, 0],
    rideType: "air",
  },
  moltres: {
    seatPosition: [0, 2, 0],
    rideType: "air",
  },
  skarmory: {
    seatPosition: [0, 1.5, 0],
    rideType: "air",
  },
  lugia: {
    seatPosition: [0, 2.5, 0],
    rideType: "air",
  },
  hooh: {
    seatPosition: [0, 2.2, 0],
    rideType: "air",
  },
  salamence: {
    seatPosition: [0, 2, 0],
    rideType: "air",
  },
  rayquaza: {
    seatPosition: [0, 3, 0],
    rideType: "air",
  },
  staraptor: {
    seatPosition: [0, 1.5, 0],
    rideType: "air",
  },
  honchkrow: {
    seatPosition: [0, 1.5, 0],
    rideType: "air",
  },
  garchomp: {
    seatPosition: [0, 2, 0],
    rideType: "air",
  },
  braviary: {
    seatPosition: [0, 1.5, 0],
    rideType: "air",
  },
  hydreigon: {
    seatPosition: [0, 2, 0],
    rideType: "air",
  },
  noivern: {
    seatPosition: [0, 1.8, 0],
    rideType: "air",
  },
  corviknight: {
    seatPosition: [0, 1.8, 0],
    rideType: "air",
  },

  // ============================================
  // Water Mounts
  // ============================================
  lapras: {
    seatPosition: [0, 2.0, 0],
    rideType: "water",
  },
  gyarados: {
    seatPosition: [0, 3.0, -0.5],
    rideType: "water",
  },
  blastoise: {
    seatPosition: [0, 1.8, -0.3],
    rideType: "water",
  },
  wailord: {
    seatPosition: [0, 4, 0],
    rideType: "water",
  },
  milotic: {
    seatPosition: [0, 1.5, 0],
    rideType: "water",
  },
  sharpedo: {
    seatPosition: [0, 1.2, 0],
    rideType: "water",
  },
  kyogre: {
    seatPosition: [0, 2.5, 0],
    rideType: "water",
  },
  samurott: {
    seatPosition: [0, 1.8, 0],
    rideType: "water",
  },
  jellicent: {
    seatPosition: [0, 2, 0],
    rideType: "water",
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
