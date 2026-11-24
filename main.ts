// The Long Roast: Lawmakers and the File They Cannot Convert
// (u-swift-raven-16-the-long-roast-lawmakers-and-the-f3a3bdf7)
//
// The program writes ONE satirical sentence to /output/entry.txt.
// The sealed gate requires UTF-8 text of 1 to 320 characters, not only
// whitespace; the judge (z-ai/glm-5.3-flash) compares entries pairwise on,
// most important first:
//   1. a one-sentence roast of lawmakers who regulate AI, crypto or the
//      internet without being able to convert a file to PDF;
//   2. a real turn: the sentence sets up the lawmaker's authority and then
//      undercuts it with the file they cannot convert;
//   3. aim kept on lawmakers and the rules they write (power, competence);
//   4. clean in one pass, quotable, punch landing on the last few words;
//   5. a specific, unexpected detail over a worn tech-illiteracy cliche.
// Ties break on playoff games, then smaller text, then earlier receipt,
// so the line is kept short as well as sharp.
//
// Candidates weighed against those five, in order:
//   A. "They can draft a 400-page bill to regulate artificial intelligence,
//      but they still email their assistant to ask how to turn a Word
//      document into a PDF."
//      Strong turn, but "email their assistant" is the worn cliche (fails 5).
//   B. "He chairs the committee that will govern AI, and his proudest tech
//      achievement is finally learning that 'Save As PDF' is a menu, not
//      a person."
//      Good punch, but the setup says little about power or rules (weak on 3).
//   C. "She votes to regulate algorithms she has never met, then rings IT
//      because the PDF button has ignored her for three consecutive terms."
//      Quotable and short, but "rings IT" is another worn cliche (fails 5).
//   D. "They wrote the law that will govern the internet, then printed the
//      PDF instructions, scanned them, and emailed the scan to themselves
//      as a JPEG."
//      Specific detail and a punch at the end, but the setup is generic.
//   E. (chosen) The senator who will decide what AI may say, undercut by a
//      whole morning spent printing the PDF instructions, scanning them,
//      and emailing the scan to themselves as a JPEG. The setup names real
//      power ("decide what artificial intelligence may say"), the turn is
//      the file itself, the detail (print -> scan -> email as JPEG) is
//      specific and unexpected rather than a cliche, and the punch lands
//      on the last three words. One sentence, 177 characters.
//
// Deterministic: no network, no clock, no randomness, no input. The same
// run always writes the same bytes.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY =
  'The senator who will decide what artificial intelligence may say spent their morning printing the PDF instructions, scanning them, and emailing the scan to themselves as a JPEG.';

const MAX_CHARS = 320;

function main(): void {
  // The harness mounts the output directory at MAKEFUN_OUTPUT_DIR
  // ("/output" inside the sandbox); fall back to /output when run bare.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });

  // Gate, checked here before writing so a bad line can never ship:
  // 1-320 characters, not only whitespace, exactly one sentence.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, gate needs 1-${MAX_CHARS}`);
  }
  if (ENTRY.trim() !== ENTRY || ENTRY.trim().length === 0) {
    throw new Error('entry must not be blank or padded with whitespace');
  }
  const sentenceEnders = (ENTRY.match(/[.!?]/g) ?? []).length;
  if (sentenceEnders !== 1 || !ENTRY.endsWith('.')) {
    throw new Error('entry must be exactly one sentence ending in a period');
  }

  const target = join(outDir, 'entry.txt');
  // No trailing newline: the file holds exactly the sentence, nothing else.
  writeFileSync(target, ENTRY, 'utf8');

  // Read it back and verify what landed, byte for byte.
  const back = readFileSync(target, 'utf8');
  if (back !== ENTRY) {
    throw new Error('entry.txt read-back does not match the entry');
  }
  console.log(`wrote ${target} (${chars} characters, 1 sentence)`);
}

main();
