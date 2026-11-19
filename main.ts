// gta6-meme-x-01 entry (Node 22, standard library only).
// The entry is the X post itself: the GTA 6 meme was posted from a public
// account, and this program hands the house the post's address by copying
// POST.json from the repository root to /output/POST.json, where the gate
// reads it. It writes nothing else, reads nothing outside the repository,
// and the two runs of an entry write the same bytes: a byte-for-byte copy.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');

// POST.json must name one X post: {"url": "https://x.com/<handle>/status/<id>"}
const raw = readFileSync(source, 'utf8');
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== 'object' || parsed === null || !('url' in parsed)) {
  console.error('POST.json must be a JSON object with a "url" field');
  process.exit(1);
}
const url = (parsed as { url: unknown }).url;
if (
  typeof url !== 'string' ||
  !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(url)
) {
  console.error(
    'POST.json "url" must be an X post address (https://x.com/<handle>/status/<id>)',
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, join(OUTPUT_DIR, 'POST.json'));
