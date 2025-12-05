import type {
  PokemonBehaviorOutput,
  ComponentGroup,
  PokemonType,
  Hitbox,
  RideableData,
} from "../../types";

/** Resolve hitbox to [width, height] tuple */
function resolveHitbox(hitbox?: Hitbox): [number, number] {
  if (!hitbox) return [1, 1.5];
  if (typeof hitbox === "number") return [hitbox, hitbox];
  return hitbox;
}

/** Configuration for BasePokemon template */
export interface BasePokemonConfig {
  /** Pokemon type ID (e.g., "pokemon:pikachu") */
  typeId: `pokemon:${string}`;
  /** Primary elemental type */
  primaryType: PokemonType;
  /** Secondary elemental type */
  secondaryType?: PokemonType;
  /** Hitbox dimensions */
  hitbox?: Hitbox;
  /** Fire immunity (defaults true for fire types) */
  fireImmune?: boolean;
  /** Additional type families */
  families?: string[];
  /** Additional components to merge */
  additionalComponents?: ComponentGroup;
  /** Rideable configuration */
  rideable?: RideableData;
}

/**
 * Base Pokemon template class.
 * Generates the foundational behavior components for any Pokemon.
 */
export class BasePokemon {
  readonly typeId: `pokemon:${string}`;
  protected primaryType: PokemonType;
  protected secondaryType?: PokemonType;
  protected hitbox: [number, number];
  protected fireImmune: boolean;
  protected families: string[];
  protected additionalComponents: ComponentGroup;
  protected rideable?: RideableData;

  constructor(config: BasePokemonConfig) {
    this.typeId = config.typeId;
    this.primaryType = config.primaryType;
    this.secondaryType = config.secondaryType;
    this.hitbox = resolveHitbox(config.hitbox);
    this.fireImmune =
      config.fireImmune ??
      (config.primaryType === "fire" || config.secondaryType === "fire");
    this.families = ["pokemon", "mob", config.primaryType];
    if (config.secondaryType) this.families.push(config.secondaryType);
    if (config.families) this.families.push(...config.families);
    this.additionalComponents = config.additionalComponents ?? {};
    this.rideable = config.rideable;
  }

  /**
   * Build the base components all Pokemon share.
   */
  protected buildBaseComponents(): ComponentGroup {
    const components: ComponentGroup = {
      "minecraft:type_family": {
        family: this.families,
      },
      "minecraft:collision_box": {
        width: this.hitbox[0],
        height: this.hitbox[1],
      },
      "minecraft:health": {
        value: 20,
        max: 20,
      },
      "minecraft:physics": {},
      "minecraft:pushable": {
        is_pushable: true,
        is_pushable_by_piston: true,
      },
    };

    if (this.fireImmune) {
      components["minecraft:fire_immune"] = {};
    }

    return { ...components, ...this.additionalComponents };
  }

  /**
   * Build the movement component group.
   * Override in subclasses for different movement types.
   */
  protected buildMovementGroup(): ComponentGroup {
    return {};
  }

  /**
   * Build the tamed component group.
   */
  protected buildTamedGroup(): ComponentGroup {
    if (!this.rideable) return {};

    return {
      "minecraft:is_saddled": {},
      "minecraft:rideable": {
        seat_count: this.rideable.seatCount ?? 1,
        crouching_skip_interact: true,
        family_types: ["player"],
        interact_text: "action.interact.mount",
        seats: {
          position: this.rideable.seatPosition,
        },
      },
      "minecraft:input_ground_controlled": {},
      "minecraft:behavior.player_ride_tamed": {},
    };
  }

  /**
   * Build the wild component group.
   */
  protected buildWildGroup(): ComponentGroup {
    return {};
  }

  /**
   * Build entity events.
   */
  protected buildEvents(): Record<string, unknown> {
    return {
      "minecraft:entity_spawned": {
        add: { component_groups: ["wild", "movement"] },
      },
    };
  }

  /**
   * Generate the full behavior output.
   */
  build(): PokemonBehaviorOutput {
    return {
      components: this.buildBaseComponents(),
      componentGroups: {
        movement: this.buildMovementGroup(),
        tamed: this.buildTamedGroup(),
        wild: this.buildWildGroup(),
      },
      events: this.buildEvents(),
      families: this.families,
    };
  }
}
