import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import tar from 'tar-stream';

/** GitHub repository containing Minecraft Bedrock JSON schemas. */
export const REPO = 'Blockception/Minecraft-bedrock-json-schemas';
/** Git commit reference (SHA) to pin the schema version. */
export const REF = '2cc0b9b10b48bc7937cf86845c83504e40b9458f';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Root directory for caching downloaded schema files. */
const CACHE_ROOT = path.resolve(__dirname, '../../.cache');
/** Directory where the extracted repository is stored. */
const REPO_DIR = path.join(CACHE_ROOT, 'repo');
/** Prefix used in the tar archive for filtering entries. */
const ARCHIVE_PREFIX = `${REPO.split('/')[1]}-${REF}`;

/**
 * Ensures the schema repository is downloaded and extracted, using cache when available.
 *
 * This function:
 * 1. Checks for a `.ready` marker file to determine if the repo is already cached
 * 2. If not cached, downloads the repository as a tar.gz archive from GitHub
 * 3. Extracts the archive, filtering entries by the archive prefix
 * 4. Creates a marker file to indicate successful extraction
 *
 * The repository is cached in `.cache/repo` to avoid redundant downloads.
 *
 * @throws {Error} If the download fails or the response is invalid
 */
export async function ensureRepoReady() {
  const marker = path.join(REPO_DIR, '.ready');
  try {
    await fs.access(marker);
    return;
  } catch {
    // continue
  }

  console.log('⬇️  Downloading Minecraft schema archive...');
  await fs.rm(REPO_DIR, { recursive: true, force: true });
  await fs.mkdir(REPO_DIR, { recursive: true });

  const response = await fetch(
    `https://codeload.github.com/${REPO}/tar.gz/${REF}`,
    {
      headers: {
        'User-Agent': 'pokemon-behaviors-schema-generator',
      },
    }
  );
  if (!response.ok || !response.body) {
    const body = response.body ? await response.text() : '<empty>';
    throw new Error(
      `Failed to download schema archive (${response.status}): ${body}`
    );
  }

  const extract = tar.extract();
  extract.on('entry', (header, stream, next) => {
    (async () => {
      if (!header.name.startsWith(ARCHIVE_PREFIX)) {
        stream.resume();
        return;
      }
      const relative = header.name
        .slice(ARCHIVE_PREFIX.length)
        .replace(/^\/+/, '');
      if (!relative) {
        stream.resume();
        return;
      }
      const targetPath = path.join(REPO_DIR, relative);
      if (header.type === 'directory') {
        await fs.mkdir(targetPath, { recursive: true });
        stream.resume();
        return;
      }
      if (header.type !== 'file') {
        stream.resume();
        return;
      }
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await pipeline(stream, createWriteStream(targetPath));
    })()
      .then(() => next())
      .catch(error => {
        extract.destroy(error as Error);
      });
  });

  const bodyStream = Readable.fromWeb(
    response.body as unknown as import('stream/web').ReadableStream
  );
  await pipeline(bodyStream, createGunzip(), extract);
  await fs.writeFile(marker, 'ready', 'utf8');
}

/**
 * Resolves a relative path within the cached repository to an absolute file system path.
 *
 * @param relativePath - Relative path from the repository root (e.g., `source/behavior/entities/format/components.json`)
 * @returns Absolute path to the file in the cached repository directory
 */
export function getRepoPath(relativePath: string): string {
  return path.join(REPO_DIR, relativePath);
}

