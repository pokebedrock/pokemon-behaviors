/**
 * Core type definitions for Pokemon behaviors.
 * Uses generated EntityComponents from the schema generator.
 */

import type { EntityComponents } from "../__generated__/entityComponents";

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
