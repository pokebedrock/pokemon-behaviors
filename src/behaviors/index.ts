// Types
export type {
  PokemonType,
  SeatPosition,
  ComponentGroup,
  PokemonBehaviorOutput,
} from "../types";

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
