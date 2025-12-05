/**
 * Pokemon Behavior Generator
 *
 * Generates PokemonBehaviorOutput for all Pokemon by:
 * 1. Reading movement data from /src/data/movement.ts
 * 2. Reading rideable data from /src/data/rideables.ts
 * 3. Mapping each Pokemon to the appropriate template
 * 4. Appending any custom Pokemon from /behaviors/pokemon/
 *
 * NOTE: Primary/secondary types must be provided externally (from pokebedrock-beh).
 *
 * Usage:
 *   import { generateAllBehaviors, generateBehavior } from "./generate";
 *
 *   // Generate one (requires type info)
 *   const pikachu = generateBehavior("pikachu", "electric");
 *
 *   // Generate all with type map
 *   const types = { pikachu: { primary: "electric" }, ... };
 *   const all = generateAllBehaviors(types);
 */

import {
  POKEMON_MOVEMENT,
  type PokemonMovementData,
  type LocomotionType,
  type TerrestrialMovement,
  type AquaticMovement,
  type SemiaquaticMovement,
  type VolantMovement,
  type LevitatingMovement,
} from "../data/movement";
import { RIDEABLE_POKEMON, type RideableData } from "../data/rideables";
import {
  WalkingPokemon,
  FlyingPokemon,
  SwimmingPokemon,
  LevitatingPokemon,
} from "./templates";
import type { PokemonBehaviorOutput, PokemonType } from "./types";

/** Type information for a Pokemon */
export interface PokemonTypeInfo {
  primary: PokemonType;
  secondary?: PokemonType;
}

/**
 * Map of custom Pokemon behavior functions.
 * These are loaded from /behaviors/pokemon/ and override the generated behavior.
 */
const CUSTOM_POKEMON: Record<string, () => PokemonBehaviorOutput> = {
  // Custom Pokemon will be imported here as needed
  // Example:
  // ditto: () => require("./pokemon/ditto").default(),
};

/**
 * Generate behavior from terrestrial movement data.
 */
function generateTerrestrial(
  name: string,
  data: TerrestrialMovement,
  types: PokemonTypeInfo,
  rideable?: RideableData
): PokemonBehaviorOutput {
  return new WalkingPokemon({
    typeId: `pokemon:${name}`,
    primaryType: types.primary,
    secondaryType: types.secondary,
    walkSpeed: data.walkSpeed,
    hitbox: data.hitbox,
    rideable,
  }).build();
}

/**
 * Generate behavior from aquatic movement data.
 */
function generateAquatic(
  name: string,
  data: AquaticMovement,
  types: PokemonTypeInfo,
  rideable?: RideableData
): PokemonBehaviorOutput {
  return new SwimmingPokemon({
    typeId: `pokemon:${name}`,
    primaryType: types.primary,
    secondaryType: types.secondary,
    swimSpeed: data.swimSpeed,
    walkSpeed: 0,
    avoidsLand: true,
    canBreatheUnderwater: true,
    hitbox: data.hitbox,
    rideable,
  }).build();
}

/**
 * Generate behavior from semiaquatic movement data.
 */
function generateSemiaquatic(
  name: string,
  data: SemiaquaticMovement,
  types: PokemonTypeInfo,
  rideable?: RideableData
): PokemonBehaviorOutput {
  return new SwimmingPokemon({
    typeId: `pokemon:${name}`,
    primaryType: types.primary,
    secondaryType: types.secondary,
    swimSpeed: data.swimSpeed,
    walkSpeed: data.walkSpeed,
    avoidsLand: false,
    canBreatheUnderwater: data.canBreatheUnderwater ?? true,
    hitbox: data.hitbox,
    rideable,
  }).build();
}

/**
 * Generate behavior from volant movement data.
 */
function generateVolant(
  name: string,
  data: VolantMovement,
  types: PokemonTypeInfo,
  rideable?: RideableData
): PokemonBehaviorOutput {
  return new FlyingPokemon({
    typeId: `pokemon:${name}`,
    primaryType: types.primary,
    secondaryType: types.secondary,
    flySpeed: data.flySpeed,
    walkSpeed: data.walkSpeed,
    hitbox: data.hitbox,
    rideable,
  }).build();
}

/**
 * Generate behavior from levitating movement data.
 */
function generateLevitating(
  name: string,
  data: LevitatingMovement,
  types: PokemonTypeInfo,
  rideable?: RideableData
): PokemonBehaviorOutput {
  return new LevitatingPokemon({
    typeId: `pokemon:${name}`,
    primaryType: types.primary,
    secondaryType: types.secondary,
    floatSpeed: data.floatSpeed,
    hitbox: data.hitbox,
    rideable,
  }).build();
}

/**
 * Generate behavior for a single Pokemon from movement data.
 */
function generateFromMovementData(
  name: string,
  data: PokemonMovementData,
  types: PokemonTypeInfo
): PokemonBehaviorOutput {
  const rideable = RIDEABLE_POKEMON[name];

  switch (data.locomotion) {
    case "terrestrial":
      return generateTerrestrial(name, data, types, rideable);
    case "aquatic":
      return generateAquatic(name, data, types, rideable);
    case "semiaquatic":
      return generateSemiaquatic(name, data, types, rideable);
    case "volant":
      return generateVolant(name, data, types, rideable);
    case "levitating":
      return generateLevitating(name, data, types, rideable);
  }
}

/**
 * Generate behavior for a single Pokemon by name.
 *
 * @param name Pokemon name (without "pokemon:" prefix)
 * @param types Type information (primary and optional secondary)
 * @returns Generated behavior output, or undefined if Pokemon not found
 */
export function generateBehavior(
  name: string,
  types: PokemonTypeInfo
): PokemonBehaviorOutput | undefined {
  const lowerName = name.toLowerCase();

  // Check for custom Pokemon first
  if (lowerName in CUSTOM_POKEMON) {
    return CUSTOM_POKEMON[lowerName]();
  }

  // Check movement data
  const movementData = POKEMON_MOVEMENT[lowerName];
  if (!movementData) return undefined;

  return generateFromMovementData(lowerName, movementData, types);
}

/**
 * Generate behaviors for all registered Pokemon.
 *
 * @param typeMap Map of Pokemon name to type info
 * @returns Map of Pokemon name to behavior output
 */
export function generateAllBehaviors(
  typeMap: Record<string, PokemonTypeInfo>
): Map<string, PokemonBehaviorOutput> {
  const behaviors = new Map<string, PokemonBehaviorOutput>();

  // Generate from movement data
  for (const [name, data] of Object.entries(POKEMON_MOVEMENT)) {
    // Skip if there's a custom override
    if (name in CUSTOM_POKEMON) continue;

    // Skip if no type info provided
    const types = typeMap[name];
    if (!types) {
      console.warn(`No type info for ${name}, skipping`);
      continue;
    }

    behaviors.set(name, generateFromMovementData(name, data, types));
  }

  // Add custom Pokemon
  for (const [name, factory] of Object.entries(CUSTOM_POKEMON)) {
    behaviors.set(name, factory());
  }

  return behaviors;
}

/**
 * Get list of all registered Pokemon names.
 */
export function getAllPokemonNames(): string[] {
  const fromData = Object.keys(POKEMON_MOVEMENT);
  const fromCustom = Object.keys(CUSTOM_POKEMON);
  return [...new Set([...fromData, ...fromCustom])];
}

/**
 * Check if a Pokemon is registered.
 */
export function hasPokemon(name: string): boolean {
  const lowerName = name.toLowerCase();
  return lowerName in POKEMON_MOVEMENT || lowerName in CUSTOM_POKEMON;
}

/**
 * Get the locomotion type for a Pokemon.
 */
export function getLocomotionType(name: string): LocomotionType | undefined {
  const data = POKEMON_MOVEMENT[name.toLowerCase()];
  return data?.locomotion;
}
