import type { EntityComponents } from "./__generated__/entityComponents";

// ============================================
// Pokemon Elemental Types
// ============================================

/** Pokemon elemental type */
export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

// ============================================
// Component & Behavior Types
// ============================================

/** Seat position for rideable Pokemon [x, y, z] */
export type SeatPosition = [number, number, number];

/** Component group - a partial set of entity components */
export type ComponentGroup = Partial<EntityComponents>;

/** Output structure for a generated Pokemon behavior */
export interface PokemonBehaviorOutput {
  /** Base components applied to all instances */
  components: ComponentGroup;
  /** Component groups (movement, tamed, wild, etc.) */
  componentGroups: Record<string, ComponentGroup>;
  /** Entity events */
  events: Record<string, unknown>;
  /** Type families */
  families: string[];
  /** Animations to reference */
  animations?: Record<string, string>;
  /** Scripts to run */
  scripts?: { animate?: string[] };
}

// ============================================
// Movement & Locomotion Types
// ============================================

/** Hitbox definition - single value for square, or [width, height] */
export type Hitbox = number | [number, number];

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
// Rideable Types
// ============================================

/** Rideable configuration for a Pokemon */
export interface RideableData {
  /** Seat position offset [x, y, z] */
  seatPosition: SeatPosition;
  /** Number of seats (default 1) */
  seatCount?: number;
}
