# Individual Pokemon Overrides

This folder contains custom behavior files for Pokemon that need complex
behavior beyond what the data-driven generator can provide.

## When to use this folder

Most Pokemon should be defined in `/src/data/movement.ts` using the simple data format.
Only create a file here if a Pokemon needs:

- Custom events not supported by templates
- Unique component groups
- Special animations or scripts
- Complex transformation logic (mega evolution, form changes)

## File format

Each file should export a default function that returns `PokemonBehaviorOutput`:

```typescript
// pokemon/ditto.ts
import type { PokemonBehaviorOutput } from "../types";
import { WalkingPokemon } from "../templates";

export default function (): PokemonBehaviorOutput {
  const base = new WalkingPokemon({
    typeId: "pokemon:ditto",
    primaryType: "normal",
    speed: 0.2,
  });

  const output = base.build();

  // Add transform component group
  output.componentGroups["transformed"] = {
    // Custom transformation components
  };

  output.events["transform"] = {
    add: { component_groups: ["transformed"] },
  };

  return output;
}
```

## Registration

After creating a custom file, register it in `generate.ts`:

```typescript
const CUSTOM_POKEMON: Record<string, () => PokemonBehaviorOutput> = {
  ditto: () => require("./pokemon/ditto").default(),
};
```

## Naming

Files should be named after the Pokemon in lowercase (e.g., `ditto.ts`, `rayquaza.ts`).

**Important:** Do NOT add Pokemon to both `/src/data/movement.ts` AND this folder.
Custom Pokemon here completely override the generator.
