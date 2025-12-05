/**
 * Walking (Terrestrial) Pokemon template.
 * For Pokemon that walk on ground as their primary movement.
 */

import type { ComponentGroup } from "../types";
import { BasePokemon, type BasePokemonConfig } from "./BasePokemon";

/** Configuration specific to terrestrial Pokemon */
export interface WalkingPokemonConfig extends BasePokemonConfig {
  /** Walk speed (default 0.25) */
  walkSpeed?: number;
}

/**
 * Terrestrial Pokemon template.
 * Standard ground-based movement.
 */
export class WalkingPokemon extends BasePokemon {
  protected walkSpeed: number;

  constructor(config: WalkingPokemonConfig) {
    super(config);
    this.walkSpeed = config.walkSpeed ?? 0.25;

    if (this.rideable) {
      this.families.push("rideable", "walkable");
    }
  }

  protected override buildMovementGroup(): ComponentGroup {
    return {
      "minecraft:movement": { value: this.walkSpeed },
      "minecraft:movement.generic": { max_turn: 10.0 },
      "minecraft:navigation.generic": {
        avoid_damage_blocks: true,
        avoid_portals: true,
        can_jump: true,
        can_walk: true,
        can_pass_doors: true,
      },
      "minecraft:behavior.float": { priority: 0 },
      "minecraft:behavior.random_stroll": {
        priority: 6,
        speed_multiplier: 1.0,
      },
      "minecraft:behavior.look_at_player": {
        priority: 7,
        look_distance: 8.0,
      },
      "minecraft:behavior.random_look_around": { priority: 8 },
    };
  }

  protected override buildTamedGroup(): ComponentGroup {
    const base = super.buildTamedGroup();
    if (!this.rideable) return base;

    return {
      ...base,
      "minecraft:can_power_jump": {},
      "minecraft:horse.jump_strength": {
        value: { range_min: 0, range_max: 1 },
      },
    };
  }
}
