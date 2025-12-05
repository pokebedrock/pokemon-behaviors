import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import { ensureRepoReady, getRepoPath, REF, REPO } from "./schemaRepo";

/**
 * Represents a JSON Schema definition with support for references, unions, and various types.
 */
type JsonSchema = {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema | JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  enum?: unknown[];
  const?: unknown;
  $ref?: string;
  additionalProperties?: boolean | JsonSchema;
  description?: string;
  title?: string;
  required?: string[];
  default?: unknown;
  examples?: unknown[];
};

/**
 * Represents a parsed entity component definition with its TypeScript type string.
 */
type ComponentDefinition = {
  name: string;
  type: string;
  description?: string;
  title?: string;
};

/**
 * Context for resolving JSON Schema references, including the schema and its file path.
 */
type SchemaContext = {
  schema: JsonSchema;
  path: string;
};

/** Relative path to the root components schema file in the repository. */
const ROOT_SCHEMA = "source/behavior/entities/format/components.json";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Output file path for the generated TypeScript entity components file. */
const OUTPUT_FILE = path.resolve(
  __dirname,
  "../__generated__/entityComponents.ts"
);

/** Cache for loaded JSON schemas to avoid redundant file reads. */
const schemaCache = new Map<string, JsonSchema>();

/**
 * Main entry point: generates TypeScript type definitions from Minecraft entity component schemas.
 *
 * This function:
 * 1. Ensures the schema repository is downloaded and ready
 * 2. Loads and parses the root components schema
 * 3. Extracts all component definitions
 * 4. Generates TypeScript code with proper formatting
 * 5. Writes the output to the generated file
 */
async function main() {
  await ensureRepoReady();
  const rootContext = loadSchemaContext(ROOT_SCHEMA);
  const components = extractComponents(rootContext);
  const ts = generateTypeScript(components);
  const formatted = await prettier.format(ts, {
    parser: "typescript",
    singleQuote: true,
    trailingComma: "es5",
  });
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, formatted, "utf8");
  console.log(`✅ Wrote ${components.length} entity components.`);
}

/**
 * Loads a JSON schema from the repository, using cache to avoid redundant file reads.
 *
 * @param relativePath - Relative path to the schema file within the repository
 * @returns Schema context containing the parsed schema and its path
 */
function loadSchemaContext(relativePath: string): SchemaContext {
  if (!schemaCache.has(relativePath)) {
    const absolute = getRepoPath(relativePath);
    const raw = readFileSync(absolute, "utf8");
    schemaCache.set(relativePath, JSON.parse(raw) as JsonSchema);
  }
  return { schema: schemaCache.get(relativePath)!, path: relativePath };
}

/**
 * Extracts all component definitions from the root schema context.
 *
 * @param context - The root schema context containing component definitions
 * @returns Array of component definitions with resolved types and metadata
 */
function extractComponents(context: SchemaContext): ComponentDefinition[] {
  const props = context.schema.properties ?? {};
  const results: ComponentDefinition[] = [];
  for (const [name, schema] of Object.entries(props)) {
    const resolved = resolveSchema(schema, context);
    const typeString = jsonTypeToTsType(resolved.schema, resolved);
    results.push({
      name,
      type: typeString,
      description: resolved.schema.description ?? schema.description,
      title: resolved.schema.title ?? schema.title,
    });
  }
  return results;
}

/**
 * Resolves JSON Schema references recursively, handling circular references.
 *
 * @param schema - The schema to resolve (may contain $ref)
 * @param context - The current schema context for resolving relative references
 * @param seen - Set of already-seen reference keys to detect cycles
 * @returns Resolved schema context with all references dereferenced
 */
function resolveSchema(
  schema: JsonSchema,
  context: SchemaContext,
  seen = new Set<string>()
): SchemaContext {
  if (!schema.$ref) return { schema, path: context.path };
  const key = `${context.path}::${schema.$ref}`;
  if (seen.has(key)) {
    return { schema, path: context.path };
  }
  seen.add(key);
  const target = resolveRef(schema.$ref, context);
  if (!target) return { schema, path: context.path };
  return resolveSchema(target.schema, target, seen);
}

/**
 * Resolves a JSON Schema reference ($ref) to its target schema context.
 *
 * Supports:
 * - Local references: `#/definitions/MyType`
 * - Root references: `#`
 * - External file references: `../schemas/common.json#/definitions/Base`
 *
 * @param ref - The reference string (e.g., `#/definitions/MyType` or `../common.json`)
 * @param context - The current schema context for resolving relative paths
 * @returns The resolved schema context, or null if the reference cannot be resolved
 */
function resolveRef(ref: string, context: SchemaContext): SchemaContext | null {
  if (ref.startsWith("#/")) {
    const target = getByPointer(context.schema, ref);
    return target ? { schema: target, path: context.path } : null;
  }
  if (ref.startsWith("#")) return context;
  const [refPath, fragment] = ref.split("#", 2);
  const baseDir = path.posix.dirname(context.path);
  const normalized = path.posix.normalize(path.posix.join(baseDir, refPath));
  const targetContext = loadSchemaContext(normalized);
  if (fragment && fragment.startsWith("/")) {
    const target = getByPointer(targetContext.schema, `#${fragment}`);
    return target ? { schema: target, path: normalized } : null;
  }
  return targetContext;
}

/**
 * Resolves a JSON Pointer to a nested schema value.
 *
 * Implements RFC 6901 JSON Pointer specification, handling escaped characters:
 * - `~1` → `/`
 * - `~0` → `~`
 * - `%3A` → `:`
 *
 * @param schema - The root schema to navigate
 * @param pointer - JSON Pointer string (e.g., `#/definitions/MyType`)
 * @returns The schema at the pointer location, or null if not found
 */
function getByPointer(schema: JsonSchema, pointer: string): JsonSchema | null {
  if (!pointer.startsWith("#/")) return schema;
  const parts = pointer
    .slice(2)
    .split("/")
    .map((part) =>
      part.replace(/~1/g, "/").replace(/~0/g, "~").replace(/%3A/g, ":")
    );
  let current: any = schema;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current)
      current = current[part];
    else return null;
  }
  return current as JsonSchema;
}

/**
 * Converts a JSON Schema type definition to a TypeScript type string.
 *
 * Handles:
 * - Primitive types (string, number, boolean, null)
 * - Arrays and tuples
 * - Objects with properties
 * - Unions (oneOf, anyOf, enum)
 * - Intersections (allOf)
 * - Constants
 * - References ($ref)
 *
 * @param schema - The JSON schema to convert
 * @param context - Schema context for resolving references
 * @param depth - Recursion depth to prevent infinite loops (max 20)
 * @returns TypeScript type string representation
 */
function jsonTypeToTsType(
  schema: JsonSchema,
  context: SchemaContext,
  depth = 0
): string {
  if (depth > 20) return "unknown";

  if (schema.$ref) {
    const target = resolveRef(schema.$ref, context);
    if (target) return jsonTypeToTsType(target.schema, target, depth + 1);
    return "unknown";
  }

  if (schema.oneOf || schema.anyOf) {
    const options = schema.oneOf ?? schema.anyOf ?? [];
    const types = options
      .map((option) => jsonTypeToTsType(option, context, depth + 1))
      .filter(Boolean);
    return wrapUnion(types);
  }

  if (schema.allOf) {
    const types = schema.allOf.map((option) =>
      jsonTypeToTsType(option, context, depth + 1)
    );
    return types.length ? types.join(" & ") : "unknown";
  }

  if (schema.enum)
    return wrapUnion(
      schema.enum.map((value) =>
        typeof value === "string" ? `'${value}'` : JSON.stringify(value)
      )
    );

  if (schema.const !== undefined)
    return typeof schema.const === "string"
      ? `'${schema.const}'`
      : JSON.stringify(schema.const);

  if (Array.isArray(schema.type))
    return wrapUnion(
      schema.type.map((type) =>
        jsonTypeToTsType({ ...schema, type }, context, depth + 1)
      )
    );

  if (schema.type === "array" && schema.items) {
    if (Array.isArray(schema.items)) {
      const tuple = schema.items
        .map((item) => jsonTypeToTsType(item, context, depth + 1))
        .join(", ");
      return `[${tuple}]`;
    }
    const itemType = jsonTypeToTsType(schema.items, context, depth + 1);
    return `(${itemType})[]`;
  }

  if (schema.type === "object" || schema.properties)
    return renderObject(schema, context, depth + 1);
  switch (schema.type) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "array":
      return "unknown[]";
    case "object":
      return "Record<string, unknown>";
    default:
      return "unknown";
  }
}

/**
 * Renders a JSON Schema object type as a TypeScript object type string.
 *
 * Includes:
 * - Property definitions with optional markers
 * - JSDoc comments for properties
 * - Additional properties index signature
 *
 * @param schema - The object schema to render
 * @param context - Schema context for resolving nested types
 * @param depth - Current indentation depth for formatting
 * @returns TypeScript object type string with proper formatting
 */
function renderObject(
  schema: JsonSchema,
  context: SchemaContext,
  depth: number
): string {
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const indent = "  ".repeat(depth);
  const lines: string[] = ["{"];
  for (const [key, value] of Object.entries(props)) {
    const doc = generateJSDoc(value, depth);
    if (doc) lines.push(doc);
    const optional = required.has(key) ? "" : "?";
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `'${key}'`;
    const type = jsonTypeToTsType(value, context, depth + 1);
    lines.push(`${indent}${safeKey}${optional}: ${type};`);
  }
  if (schema.additionalProperties === true)
    lines.push(`${indent}[key: string]: unknown;`);
  else if (typeof schema.additionalProperties === "object") {
    const additional = jsonTypeToTsType(
      schema.additionalProperties,
      context,
      depth + 1
    );
    lines.push(`${indent}[key: string]: ${additional};`);
  }
  lines.push(`${"  ".repeat(depth - 1)}}`);
  return lines.join("\n");
}

/**
 * Creates a TypeScript union type string from an array of type strings.
 *
 * Removes duplicates and handles edge cases:
 * - Empty array → `unknown`
 * - Single type → returns the type as-is (no union)
 * - Multiple types → joins with ` | `
 *
 * @param types - Array of TypeScript type strings
 * @returns Union type string or single type if only one unique type
 */
function wrapUnion(types: string[]): string {
  const unique = [...new Set(types.filter(Boolean))];
  if (!unique.length) return "unknown";
  return unique.length === 1 ? unique[0] : unique.join(" | ");
}

/**
 * Generates JSDoc comment block for a schema property.
 *
 * Includes:
 * - Title (if different from description)
 * - Description (multi-line supported)
 * - Default value
 * - Example value
 *
 * @param schema - The schema to generate documentation for
 * @param depth - Indentation depth for proper formatting
 * @returns JSDoc comment string, or empty string if no documentation available
 */
function generateJSDoc(schema: JsonSchema, depth: number): string {
  const lines: string[] = [];
  if (
    schema.title ||
    schema.description ||
    schema.default !== undefined ||
    (schema.examples && schema.examples.length)
  ) {
    const indent = "  ".repeat(depth);
    lines.push(`${indent}/**`);
    if (schema.title && schema.title !== schema.description)
      lines.push(`${indent} * ${schema.title}`);
    if (schema.description)
      schema.description.split("\n").forEach((line) => {
        lines.push(`${indent} * ${line}`);
      });
    if (schema.default !== undefined)
      lines.push(`${indent} * @default ${JSON.stringify(schema.default)}`);
    if (schema.examples && schema.examples.length)
      lines.push(`${indent} * @example ${JSON.stringify(schema.examples[0])}`);
    lines.push(`${indent} */`);
  }
  return lines.join("\n");
}

/**
 * Converts a string to PascalCase format.
 *
 * Splits on non-alphanumeric characters, capitalizes each part, and joins them.
 * Example: `minecraft:health` → `MinecraftHealth`
 *
 * @param value - The string to convert
 * @returns PascalCase string
 */
function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Generates the complete TypeScript file content from component definitions.
 *
 * Creates:
 * - File header banner with source information
 * - Type aliases for each component (e.g., `EntityComponentHealth`)
 * - Main `EntityComponents` interface with all components as optional properties
 *
 * @param components - Array of component definitions to generate types for
 * @returns Complete TypeScript file content as a string
 */
function generateTypeScript(components: ComponentDefinition[]): string {
  const banner = [
    "/*",
    " * ⚠️ AUTO-GENERATED FILE ⚠️",
    ` * Source repo: ${REPO}`,
    ` * Source ref: ${REF}`,
    " * Script: pokemon-behaviors/types/scripts/generateComponents.ts",
    " *",
    " * Do not edit this file directly. Run `npm run generate:types` instead.",
    ` * Source file: ${ROOT_SCHEMA}`,
    ` * Origin: https://raw.githubusercontent.com/${REPO}/${REF}/${ROOT_SCHEMA}`,
    " */",
  ].join("\n");

  const typeAliases = components
    .map((component) => {
      const typeName = `EntityComponent${toPascalCase(component.name)}`;
      const docLines: string[] = [];
      if (component.title || component.description) {
        docLines.push("/**");
        if (component.title && component.title !== component.description) {
          docLines.push(` * ${component.title}`);
        }
        if (component.description)
          component.description.split("\n").forEach((line) => {
            docLines.push(` * ${line}`);
          });
        docLines.push(" */");
      }
      const doc = docLines.join("\n");
      return `${doc ? `${doc}\n` : ""}export type ${typeName} = ${
        component.type
      };\n`;
    })
    .join("\n");

  const interfaceDoc = [
    "/**",
    " * All known Minecraft entity components with strong TypeScript types.",
    " */",
  ].join("\n");

  const interfaceBody = `${interfaceDoc}
export interface EntityComponents {
${components
  .map((component) => {
    const typeName = `EntityComponent${toPascalCase(component.name)}`;
    return `  '${component.name}'?: ${typeName};`;
  })
  .join("\n")}
}

export default EntityComponents;
`;

  return `${banner}\n\n${typeAliases}\n${interfaceBody}`;
}

void main();
