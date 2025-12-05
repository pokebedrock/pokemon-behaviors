# Pokemon Behaviors – Schema Type Generation Plan

## Objectives
- Mirror the Minecraft Bedrock behavior schemas (notably `entities.json` plus nested `filters`/`format` folders) from [Blockception/Minecraft-bedrock-json-schemas@2cc0b9b](https://github.com/Blockception/Minecraft-bedrock-json-schemas/tree/2cc0b9b10b48bc7937cf86845c83504e40b9458f/source/behavior/entities).
- Convert those JSON Schemas into first-class TypeScript types so we can author reusable Pokemon behavior templates that align with Bedrock parity.
- Keep the generator self-contained inside `pokemon-behaviors` so `pokebedrock-beh` can later depend on the compiled types instead of duplicating schema knowledge.

## Guiding Principles
- Prefer early returns in all new code to avoid deep nesting.
- Keep the generator deterministic: pin schemas to a specific commit hash, normalize output structure and formatting, and avoid relying on the caller’s environment.
- Separate the concerns of **fetching schemas**, **compiling to types**, and **writing artifacts** so future maintainers can swap pieces (e.g., caching, alternative schema sources).

## Proposed Directory Layout
- `types/scripts/generateSchemas.ts` – main generator CLI.
- `types/generated/` – auto-generated `.ts` files mirroring the upstream directory structure (e.g., `entities/index.ts`, `entities/filters/Filters.ts`, etc.).
- `types/runtime/` *(future)* – optional helpers for consumers (e.g., runtime validators) if needed later.
- `PLAN.md` – project roadmap (this file).

## Generator Responsibilities
1. **Directory crawling**  
   - Use the GitHub Contents API to recursively enumerate every JSON schema under `source/behavior/entities`.
   - Ignore non-JSON files (e.g., README) but preserve nested folder names in the generated output.

2. **Schema retrieval**  
   - Download each schema via its raw URL (still pinned to the commit SHA).
   - Cache responses per run to minimize redundant network calls and support local/offline debugging later via an optional flag.

3. **Type compilation**  
   - Feed schemas into `json-schema-to-typescript` (or an equivalent compiler) with options that:
     - Preserve JSDoc comments.
     - Hoist enums and unions cleanly.
     - Emit `readonly` modifiers to prevent accidental mutation.
   - Derive type names from either schema titles or sanitized file names (`entities.json` → `EntityBehavior`).

4. **Artifact emission**  
   - Write prettified `.ts` files to `types/generated/**`, one per upstream schema file.
   - Produce a `types/generated/index.ts` barrel that re-exports everything for ergonomic imports.
   - Ensure the generator exits non-zero on failures (network, schema parse, or fs errors).

## Implementation Steps
1. **Tooling setup**
   - Add dev dependencies: `typescript`, `tsx`, `json-schema-to-typescript`, and eslint/prettier configs if needed.
   - Provide npm scripts (`generate:types`) to run the generator.

2. **Utility layer**
   - `fetchDirectoryEntries(path)` → recursively walk GitHub directories.
   - `downloadSchema(entry)` → fetch and parse JSON with helpful debug logs.
   - `computeTypeName(entry, schema)` → deterministic PascalCase naming.

3. **Compilation + output**
   - Compile schemas sequentially (or with limited concurrency) to avoid rate limits.
   - Write results plus a header comment indicating source + generation timestamp + `do not edit` notice.
   - Regenerate barrel exports after every run.

4. **Validation**
   - Smoke-test by importing generated types in a sample file (future).
   - Document usage in the README once the generator stabilizes.

## Future Enhancements
- Allow pin overrides via CLI flags (e.g., `--ref latest`).
- Cache downloaded schemas locally to support offline work.
- Layer runtime validation helpers (Ajv/zod) atop the generated types.
- Extend the approach to other schema groups (blocks, items) for cross-pack consistency.


