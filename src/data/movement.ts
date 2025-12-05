/**
 * Pokemon Movement Data
 *
 * Maps Pokemon to their locomotion behavior configuration.
 * This is the source of truth for how Pokemon move in the world.
 *
 * Locomotion Types (scientific naming):
 * - "terrestrial"  : Ground-dwelling, walks only (Pikachu, Bulbasaur)
 * - "aquatic"      : Fully aquatic, swims only, avoids land (Magikarp, Goldeen)
 * - "semiaquatic"  : Can traverse both land and water (Squirtle, Gyarados)
 * - "volant"       : Capable of powered flight, may also walk (Charizard, Pidgey)
 * - "levitating"   : Hovers/floats without traditional flight (Gastly, Magnemite)
 *
 * NOTE: Pokemon with custom behavior files in /behaviors/pokemon/ should NOT
 * be listed here - they will be appended separately during generation.
 *
 * NOTE: Primary/secondary types are fetched from pokebedrock-beh during generation.
 */

/** Hitbox definition - single value for square, or [width, height] */
export type Hitbox = number | [number, number];

// ============================================
// Locomotion Type Definitions (Discriminated Union)
// ============================================

/** Base properties shared by all locomotion types */
interface BaseMovement {
  /** Collision hitbox - number for square, [width, height] for rectangle */
  hitbox?: Hitbox;
}

/** Ground-dwelling Pokemon that only walk */
export interface TerrestrialMovement extends BaseMovement {
  locomotion: "terrestrial";
  /** Walking speed (default 0.25) */
  walkSpeed?: number;
}

/** Fully aquatic Pokemon that only swim */
export interface AquaticMovement extends BaseMovement {
  locomotion: "aquatic";
  /** Swimming speed (default 0.2) */
  swimSpeed?: number;
}

/** Pokemon that can traverse both land and water */
export interface SemiaquaticMovement extends BaseMovement {
  locomotion: "semiaquatic";
  /** Walking speed on land (default 0.2) */
  walkSpeed?: number;
  /** Swimming speed in water (default 0.25) */
  swimSpeed?: number;
  /** Whether can breathe underwater (default true) */
  canBreatheUnderwater?: boolean;
}

/** Pokemon capable of powered flight */
export interface VolantMovement extends BaseMovement {
  locomotion: "volant";
  /** Flying speed (default 1.0) */
  flySpeed?: number;
  /** Walking speed when grounded (default 0.2) */
  walkSpeed?: number;
}

/** Pokemon that hover/float without traditional flight */
export interface LevitatingMovement extends BaseMovement {
  locomotion: "levitating";
  /** Hover/float speed (default 0.5) */
  floatSpeed?: number;
}

/** Union of all locomotion types */
export type PokemonMovementData =
  | TerrestrialMovement
  | AquaticMovement
  | SemiaquaticMovement
  | VolantMovement
  | LevitatingMovement;

/** Locomotion category type */
export type LocomotionType = PokemonMovementData["locomotion"];

// ============================================
// Pokemon Movement Registry
// ============================================

/**
 * Movement data for all Pokemon.
 * Key is Pokemon name (matches typeId without "pokemon:" prefix).
 */
export const POKEMON_MOVEMENT: Record<string, PokemonMovementData> = {
  // ============================================
  // Generation 1 - Terrestrial Pokemon
  // ============================================
  bulbasaur: { locomotion: "terrestrial", walkSpeed: 0.2 },
  ivysaur: { locomotion: "terrestrial", walkSpeed: 0.2 },
  venusaur: { locomotion: "terrestrial", walkSpeed: 0.15, hitbox: 2 },
  charmander: { locomotion: "terrestrial", walkSpeed: 0.25 },
  charmeleon: { locomotion: "terrestrial", walkSpeed: 0.25 },
  pikachu: { locomotion: "terrestrial", walkSpeed: 0.3, hitbox: [0.7, 1.3] },
  raichu: { locomotion: "terrestrial", walkSpeed: 0.35 },
  sandshrew: { locomotion: "terrestrial", walkSpeed: 0.2 },
  sandslash: { locomotion: "terrestrial", walkSpeed: 0.25 },
  nidoranf: { locomotion: "terrestrial", walkSpeed: 0.2 },
  nidorina: { locomotion: "terrestrial", walkSpeed: 0.2 },
  nidoqueen: { locomotion: "terrestrial", walkSpeed: 0.2, hitbox: [1.3, 1.5] },
  nidoranm: { locomotion: "terrestrial", walkSpeed: 0.2 },
  nidorino: { locomotion: "terrestrial", walkSpeed: 0.2 },
  nidoking: { locomotion: "terrestrial", walkSpeed: 0.2, hitbox: [1.3, 1.6] },
  clefairy: { locomotion: "terrestrial", walkSpeed: 0.2 },
  clefable: { locomotion: "terrestrial", walkSpeed: 0.2 },
  vulpix: { locomotion: "terrestrial", walkSpeed: 0.25 },
  ninetales: { locomotion: "terrestrial", walkSpeed: 0.3, hitbox: [1.2, 1.3] },
  jigglypuff: { locomotion: "terrestrial", walkSpeed: 0.2 },
  wigglytuff: { locomotion: "terrestrial", walkSpeed: 0.2 },
  paras: { locomotion: "terrestrial", walkSpeed: 0.15 },
  parasect: { locomotion: "terrestrial", walkSpeed: 0.15 },
  venonat: { locomotion: "terrestrial", walkSpeed: 0.2 },
  diglett: { locomotion: "terrestrial", walkSpeed: 0.2 },
  dugtrio: { locomotion: "terrestrial", walkSpeed: 0.25 },
  meowth: { locomotion: "terrestrial", walkSpeed: 0.3 },
  persian: { locomotion: "terrestrial", walkSpeed: 0.35 },
  mankey: { locomotion: "terrestrial", walkSpeed: 0.3 },
  primeape: { locomotion: "terrestrial", walkSpeed: 0.35 },
  growlithe: { locomotion: "terrestrial", walkSpeed: 0.3 },
  arcanine: { locomotion: "terrestrial", walkSpeed: 0.4, hitbox: [1.8, 2] },
  abra: { locomotion: "terrestrial", walkSpeed: 0.2 },
  kadabra: { locomotion: "terrestrial", walkSpeed: 0.25 },
  alakazam: { locomotion: "terrestrial", walkSpeed: 0.3, hitbox: [1.2, 1.6] },
  machop: { locomotion: "terrestrial", walkSpeed: 0.2 },
  machoke: { locomotion: "terrestrial", walkSpeed: 0.25 },
  machamp: { locomotion: "terrestrial", walkSpeed: 0.25, hitbox: [1.5, 1.8] },
  bellsprout: { locomotion: "terrestrial", walkSpeed: 0.2 },
  weepinbell: { locomotion: "terrestrial", walkSpeed: 0.2 },
  victreebel: { locomotion: "terrestrial", walkSpeed: 0.2 },
  geodude: { locomotion: "terrestrial", walkSpeed: 0.15 },
  graveler: { locomotion: "terrestrial", walkSpeed: 0.15 },
  golem: { locomotion: "terrestrial", walkSpeed: 0.15, hitbox: 1.5 },
  ponyta: { locomotion: "terrestrial", walkSpeed: 0.35 },
  rapidash: { locomotion: "terrestrial", walkSpeed: 0.45, hitbox: [1.5, 2] },
  slowpoke: { locomotion: "terrestrial", walkSpeed: 0.1 }, // Ground variant, semiaquatic below
  doduo: { locomotion: "terrestrial", walkSpeed: 0.35 },
  dodrio: { locomotion: "terrestrial", walkSpeed: 0.45, hitbox: [1.5, 2] },
  grimer: { locomotion: "terrestrial", walkSpeed: 0.15 },
  muk: { locomotion: "terrestrial", walkSpeed: 0.15, hitbox: [1.5, 1.3] },
  onix: { locomotion: "terrestrial", walkSpeed: 0.2, hitbox: [1.5, 3] },
  drowzee: { locomotion: "terrestrial", walkSpeed: 0.2 },
  hypno: { locomotion: "terrestrial", walkSpeed: 0.25 },
  exeggcute: { locomotion: "terrestrial", walkSpeed: 0.15 },
  exeggutor: { locomotion: "terrestrial", walkSpeed: 0.2, hitbox: [1.5, 2.5] },
  cubone: { locomotion: "terrestrial", walkSpeed: 0.2 },
  marowak: { locomotion: "terrestrial", walkSpeed: 0.25 },
  hitmonlee: { locomotion: "terrestrial", walkSpeed: 0.3 },
  hitmonchan: { locomotion: "terrestrial", walkSpeed: 0.3 },
  lickitung: { locomotion: "terrestrial", walkSpeed: 0.2 },
  rhyhorn: { locomotion: "terrestrial", walkSpeed: 0.2, hitbox: 1.5 },
  rhydon: { locomotion: "terrestrial", walkSpeed: 0.2, hitbox: [1.8, 2] },
  chansey: { locomotion: "terrestrial", walkSpeed: 0.2 },
  tangela: { locomotion: "terrestrial", walkSpeed: 0.2 },
  kangaskhan: {
    locomotion: "terrestrial",
    walkSpeed: 0.25,
    hitbox: [1.5, 2.2],
  },
  mrmime: { locomotion: "terrestrial", walkSpeed: 0.25 },
  scyther: { locomotion: "terrestrial", walkSpeed: 0.35, hitbox: [1.5, 1.8] },
  jynx: { locomotion: "terrestrial", walkSpeed: 0.2 },
  electabuzz: { locomotion: "terrestrial", walkSpeed: 0.3 },
  magmar: { locomotion: "terrestrial", walkSpeed: 0.3 },
  pinsir: { locomotion: "terrestrial", walkSpeed: 0.25 },
  tauros: { locomotion: "terrestrial", walkSpeed: 0.35, hitbox: 1.5 },
  ditto: { locomotion: "terrestrial", walkSpeed: 0.2 },
  eevee: { locomotion: "terrestrial", walkSpeed: 0.3, hitbox: [0.6, 0.8] },
  jolteon: { locomotion: "terrestrial", walkSpeed: 0.4 },
  flareon: { locomotion: "terrestrial", walkSpeed: 0.35 },
  porygon: { locomotion: "terrestrial", walkSpeed: 0.2 },
  snorlax: { locomotion: "terrestrial", walkSpeed: 0.1, hitbox: [2, 2.5] },

  // ============================================
  // Generation 1 - Volant Pokemon (Flying)
  // ============================================
  caterpie: { locomotion: "terrestrial", walkSpeed: 0.15 },
  metapod: { locomotion: "terrestrial", walkSpeed: 0.05 },
  butterfree: { locomotion: "volant", flySpeed: 0.7 },
  weedle: { locomotion: "terrestrial", walkSpeed: 0.15 },
  kakuna: { locomotion: "terrestrial", walkSpeed: 0.05 },
  beedrill: { locomotion: "volant", flySpeed: 0.9 },
  pidgey: { locomotion: "volant", flySpeed: 0.8, walkSpeed: 0.2 },
  pidgeotto: { locomotion: "volant", flySpeed: 1.0, walkSpeed: 0.2 },
  pidgeot: {
    locomotion: "volant",
    flySpeed: 1.2,
    walkSpeed: 0.25,
    hitbox: [1.5, 1.8],
  },
  spearow: { locomotion: "volant", flySpeed: 0.9, walkSpeed: 0.2 },
  fearow: {
    locomotion: "volant",
    flySpeed: 1.1,
    walkSpeed: 0.25,
    hitbox: [1.5, 1.5],
  },
  zubat: { locomotion: "volant", flySpeed: 0.8 },
  golbat: { locomotion: "volant", flySpeed: 1.0, hitbox: 1.5 },
  venomoth: { locomotion: "volant", flySpeed: 0.7 },
  farfetchd: { locomotion: "volant", flySpeed: 0.8, walkSpeed: 0.25 },
  charizard: {
    locomotion: "volant",
    flySpeed: 1.0,
    walkSpeed: 0.15,
    hitbox: [1.5, 2.65],
  },
  aerodactyl: { locomotion: "volant", flySpeed: 1.3, hitbox: 2 },
  articuno: { locomotion: "volant", flySpeed: 1.2, hitbox: 2 },
  zapdos: { locomotion: "volant", flySpeed: 1.3, hitbox: 2 },
  moltres: { locomotion: "volant", flySpeed: 1.2, hitbox: [2, 2.5] },
  dragonite: {
    locomotion: "volant",
    flySpeed: 1.1,
    walkSpeed: 0.2,
    hitbox: [2, 2.5],
  },

  // ============================================
  // Generation 1 - Aquatic Pokemon (Water only)
  // ============================================
  magikarp: { locomotion: "aquatic", swimSpeed: 0.1, hitbox: 0.8 },
  goldeen: { locomotion: "aquatic", swimSpeed: 0.2 },
  seaking: { locomotion: "aquatic", swimSpeed: 0.25, hitbox: [1.2, 1.5] },
  horsea: { locomotion: "aquatic", swimSpeed: 0.15 },
  seadra: { locomotion: "aquatic", swimSpeed: 0.2 },
  staryu: { locomotion: "aquatic", swimSpeed: 0.2 },
  starmie: { locomotion: "aquatic", swimSpeed: 0.25 },
  tentacool: { locomotion: "aquatic", swimSpeed: 0.2 },
  tentacruel: { locomotion: "aquatic", swimSpeed: 0.25, hitbox: [1.5, 1.8] },
  shellder: { locomotion: "aquatic", swimSpeed: 0.1 },
  cloyster: { locomotion: "aquatic", swimSpeed: 0.15, hitbox: 1.5 },

  // ============================================
  // Generation 1 - Semiaquatic Pokemon (Land + Water)
  // ============================================
  squirtle: { locomotion: "semiaquatic", walkSpeed: 0.2, swimSpeed: 0.25 },
  wartortle: { locomotion: "semiaquatic", walkSpeed: 0.2, swimSpeed: 0.3 },
  blastoise: {
    locomotion: "semiaquatic",
    walkSpeed: 0.2,
    swimSpeed: 0.3,
    hitbox: [1.8, 2],
  },
  psyduck: { locomotion: "semiaquatic", walkSpeed: 0.2, swimSpeed: 0.2 },
  golduck: { locomotion: "semiaquatic", walkSpeed: 0.25, swimSpeed: 0.3 },
  poliwag: { locomotion: "semiaquatic", walkSpeed: 0.15, swimSpeed: 0.2 },
  poliwhirl: { locomotion: "semiaquatic", walkSpeed: 0.2, swimSpeed: 0.25 },
  poliwrath: { locomotion: "semiaquatic", walkSpeed: 0.25, swimSpeed: 0.3 },
  slowbro: {
    locomotion: "semiaquatic",
    walkSpeed: 0.1,
    swimSpeed: 0.15,
    hitbox: [1.5, 1.8],
  },
  seel: { locomotion: "semiaquatic", walkSpeed: 0.15, swimSpeed: 0.25 },
  dewgong: {
    locomotion: "semiaquatic",
    walkSpeed: 0.15,
    swimSpeed: 0.3,
    hitbox: 1.5,
  },
  krabby: { locomotion: "semiaquatic", walkSpeed: 0.2, swimSpeed: 0.15 },
  kingler: {
    locomotion: "semiaquatic",
    walkSpeed: 0.2,
    swimSpeed: 0.2,
    hitbox: 1.5,
  },
  omanyte: { locomotion: "semiaquatic", walkSpeed: 0.1, swimSpeed: 0.2 },
  omastar: { locomotion: "semiaquatic", walkSpeed: 0.1, swimSpeed: 0.2 },
  kabuto: { locomotion: "semiaquatic", walkSpeed: 0.15, swimSpeed: 0.2 },
  kabutops: { locomotion: "semiaquatic", walkSpeed: 0.25, swimSpeed: 0.3 },
  gyarados: {
    locomotion: "semiaquatic",
    walkSpeed: 0.1,
    swimSpeed: 0.35,
    hitbox: [2, 3.3],
  },
  lapras: {
    locomotion: "semiaquatic",
    walkSpeed: 0.1,
    swimSpeed: 0.25,
    hitbox: 2.5,
  },
  vaporeon: { locomotion: "semiaquatic", walkSpeed: 0.25, swimSpeed: 0.35 },
  dratini: { locomotion: "semiaquatic", walkSpeed: 0.15, swimSpeed: 0.2 },
  dragonair: {
    locomotion: "semiaquatic",
    walkSpeed: 0.2,
    swimSpeed: 0.25,
    hitbox: [1.5, 2],
  },

  // ============================================
  // Generation 1 - Levitating Pokemon (Hover/Float)
  // ============================================
  gastly: { locomotion: "levitating", floatSpeed: 0.5 },
  haunter: { locomotion: "levitating", floatSpeed: 0.6 },
  gengar: { locomotion: "levitating", floatSpeed: 0.6, hitbox: 1.5 },
  magnemite: { locomotion: "levitating", floatSpeed: 0.5 },
  magneton: { locomotion: "levitating", floatSpeed: 0.5, hitbox: 1.2 },
  voltorb: { locomotion: "levitating", floatSpeed: 0.4 },
  electrode: { locomotion: "levitating", floatSpeed: 0.5, hitbox: 1.2 },
  koffing: { locomotion: "levitating", floatSpeed: 0.4 },
  weezing: { locomotion: "levitating", floatSpeed: 0.4, hitbox: 1.5 },
  mewtwo: { locomotion: "levitating", floatSpeed: 0.8, hitbox: [1.5, 2.5] },
  mew: { locomotion: "levitating", floatSpeed: 0.7, hitbox: [0.6, 0.8] },

  // ============================================
  // Add more generations here...
  // ============================================
};
