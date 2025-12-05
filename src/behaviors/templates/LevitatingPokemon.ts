import type { ComponentGroup } from "../../types";
import { BasePokemon, type BasePokemonConfig } from "./BasePokemon";

/** Configuration specific to levitating Pokemon */
export interface LevitatingPokemonConfig extends BasePokemonConfig {
  /** Hover/float speed (default 0.5) */
  floatSpeed?: number;
}

/**
 * Levitating Pokemon template.
 * Adds hovering movement (like ghosts, psychics, magnets).
 */
export class LevitatingPokemon extends BasePokemon {
  protected floatSpeed: number;

  constructor(config: LevitatingPokemonConfig) {
    super(config);
    this.floatSpeed = config.floatSpeed ?? 0.5;
    this.families.push("levitating");
  }

  protected override buildMovementGroup(): ComponentGroup {
    return {
      "minecraft:movement.generic": { max_turn: 10.0 },
      "minecraft:flying_speed": { value: this.floatSpeed },
      "minecraft:can_fly": {},
      "minecraft:navigation.fly": {
        avoid_damage_blocks: true,
        avoid_portals: true,
        can_path_from_air: true,
      },
      "minecraft:behavior.random_fly": {
        priority: 2,
        xz_dist: 10,
        y_dist: 2,
        y_offset: 0,
        speed_multiplier: 0.8,
        can_land_on_trees: false,
        avoid_damage_blocks: true,
      },
      "minecraft:behavior.look_at_player": {
        priority: 7,
        look_distance: 8.0,
      },
      "minecraft:behavior.random_look_around": { priority: 8 },
    };
  }
}
