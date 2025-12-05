/**
 * Pokemon Behaviors - Main Entry Point
 *
 * This module provides behavior templates and a generator for creating
 * Minecraft Bedrock entity behaviors for Pokemon.
 *
 * @example
 * ```typescript
 * import { generateBehavior, generateAllBehaviors, WalkingPokemon } from "./behaviors";
 *
 * // Generate a registered Pokemon's behavior (requires type info)
 * const pikachuBehavior = generateBehavior("pikachu", { primary: "electric" });
 *
 * // Generate all registered Pokemon (requires type map from pokebedrock-beh)
 * const typeMap = { pikachu: { primary: "electric" }, ... };
 * const allBehaviors = generateAllBehaviors(typeMap);
 *
 * // Or create a custom one directly
 * const custom = new WalkingPokemon({
 *   typeId: "pokemon:custommon",
 *   primaryType: "normal",
 *   walkSpeed: 0.3,
 * }).build();
 * ```
 *
 * @module behaviors
 */

// Types
export type {
  PokemonType,
  SeatPosition,
  ComponentGroup,
  PokemonBehaviorOutput,
} from "./types";

// Templates
export {
  BasePokemon,
  WalkingPokemon,
  FlyingPokemon,
  SwimmingPokemon,
  LevitatingPokemon,
  type BasePokemonConfig,
  type WalkingPokemonConfig,
  type FlyingPokemonConfig,
  type SwimmingPokemonConfig,
  type LevitatingPokemonConfig,
} from "./templates";

// Generator
export {
  generateBehavior,
  generateAllBehaviors,
  getAllPokemonNames,
  hasPokemon,
  getLocomotionType,
  type PokemonTypeInfo,
} from "./generate";
