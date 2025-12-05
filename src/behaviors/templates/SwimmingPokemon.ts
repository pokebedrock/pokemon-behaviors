/**
 * Swimming Pokemon template.
 * For Pokemon that swim (aquatic or semiaquatic).
 */

import type { ComponentGroup, PokemonBehaviorOutput } from "../types";
import { BasePokemon, type BasePokemonConfig } from "./BasePokemon";

/** Configuration specific to swimming Pokemon */
export interface SwimmingPokemonConfig extends BasePokemonConfig {
  /** Swim speed (default 0.2) */
  swimSpeed?: number;
  /** Walk speed on land (default 0.2, set to 0 for aquatic only) */
  walkSpeed?: number;
  /** Can breathe underwater (default true) */
  canBreatheUnderwater?: boolean;
  /** Avoids land - for purely aquatic Pokemon (default false) */
  avoidsLand?: boolean;
}

/**
 * Swimming Pokemon template.
 * Adds aquatic navigation and swim behaviors.
 */
export class SwimmingPokemon extends BasePokemon {
  protected swimSpeed: number;
  protected walkSpeed: number;
  protected canBreatheUnderwater: boolean;
  protected avoidsLand: boolean;

  constructor(config: SwimmingPokemonConfig) {
    super(config);
    this.swimSpeed = config.swimSpeed ?? 0.2;
    this.walkSpeed = config.walkSpeed ?? 0.2;
    this.canBreatheUnderwater = config.canBreatheUnderwater ?? true;
    this.avoidsLand = config.avoidsLand ?? false;
    this.families.push("swimming");

    if (this.rideable) {
      this.families.push("rideable", "swimmable");
    }
  }

  protected override buildMovementGroup(): ComponentGroup {
    const components: ComponentGroup = {
      "minecraft:movement.generic": { max_turn: 10.0 },
      "minecraft:underwater_movement": { value: this.swimSpeed },
      "minecraft:breathable": {
        breathes_air: !this.avoidsLand,
        breathes_water: this.canBreatheUnderwater,
        suffocate_time: 0,
        total_supply: 15,
      },
      "minecraft:navigation.generic": {
        avoid_damage_blocks: true,
        avoid_portals: true,
        can_swim: true,
        can_walk: !this.avoidsLand,
        can_sink: false,
        is_amphibious: this.canBreatheUnderwater && !this.avoidsLand,
      },
      "minecraft:behavior.swim_idle": {
        priority: 5,
        idle_time: 5.0,
        success_rate: 0.1,
      },
      "minecraft:behavior.random_swim": {
        priority: 3,
        speed_multiplier: 1.0,
        xz_dist: 16,
        y_dist: 4,
        interval: 0,
      },
      "minecraft:behavior.look_at_player": {
        priority: 7,
        look_distance: 8.0,
      },
      "minecraft:behavior.random_look_around": { priority: 8 },
    };

    // Add land movement for semiaquatic
    if (!this.avoidsLand && this.walkSpeed > 0) {
      components["minecraft:movement"] = { value: this.walkSpeed };
      components["minecraft:behavior.random_stroll"] = {
        priority: 6,
        speed_multiplier: 1.0,
      };
    }

    // Add move to water behavior for aquatic Pokemon
    if (this.avoidsLand) {
      components["minecraft:behavior.move_to_water"] = {
        priority: 1,
        search_range: 15,
        search_height: 5,
      };
    }

    return components;
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

    // Add levitation reset animation for swimmable mounts
    if (this.rideable) {
      output.animations = {
        reset_levitation: "controller.animation.reset_levitation",
      };
      output.scripts = { animate: ["reset_levitation"] };
    }

    return output;
  }
}
