/**
 * Flying (Volant) Pokemon template.
 * For Pokemon that fly as their primary movement.
 */

import type { ComponentGroup, PokemonBehaviorOutput } from "../types";
import { BasePokemon, type BasePokemonConfig } from "./BasePokemon";

/** Configuration specific to volant Pokemon */
export interface FlyingPokemonConfig extends BasePokemonConfig {
  /** Flight speed (default 1.0) */
  flySpeed?: number;
  /** Walk speed when grounded (default 0.2) */
  walkSpeed?: number;
  /** Can land on trees (default true) */
  canLandOnTrees?: boolean;
}

/**
 * Volant Pokemon template.
 * Adds aerial navigation and flight behaviors.
 */
export class FlyingPokemon extends BasePokemon {
  protected flySpeed: number;
  protected walkSpeed: number;
  protected canLandOnTrees: boolean;

  constructor(config: FlyingPokemonConfig) {
    super(config);
    this.flySpeed = config.flySpeed ?? 1.0;
    this.walkSpeed = config.walkSpeed ?? 0.2;
    this.canLandOnTrees = config.canLandOnTrees ?? true;
    this.families.push("flying");

    if (this.rideable) {
      this.families.push("rideable", "flyable");
    }
  }

  protected override buildMovementGroup(): ComponentGroup {
    return {
      "minecraft:movement.generic": { max_turn: 10.0 },
      "minecraft:flying_speed": { value: this.flySpeed },
      "minecraft:can_fly": {},
      "minecraft:navigation.fly": {
        avoid_damage_blocks: true,
        avoid_portals: true,
        can_path_from_air: true,
      },
      "minecraft:behavior.random_fly": {
        priority: 2,
        xz_dist: 15,
        y_dist: 1,
        y_offset: 0,
        speed_multiplier: 1.0,
        can_land_on_trees: this.canLandOnTrees,
        avoid_damage_blocks: true,
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
      "minecraft:horse.jump_strength": { value: 0 },
    };
  }

  override build(): PokemonBehaviorOutput {
    const output = super.build();

    // Add levitation reset animation for flyable mounts
    if (this.rideable) {
      output.animations = {
        reset_levitation: "controller.animation.reset_levitation",
      };
      output.scripts = { animate: ["reset_levitation"] };
    }

    return output;
  }
}
