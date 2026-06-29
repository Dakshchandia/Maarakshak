import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const D = dirname(fileURLToPath(import.meta.url));
const file = resolve(D, '../server/src/index.ts');
let c = readFileSync(file, 'utf8');

// Remove the phantom DB routes block between // ── Medicines DB and // ── Appointments DB ... end
// Keep everything from // ── Local chat fallback onward
const digitalTwinStart = c.indexOf('\napp.post(\'/api/ai/digital-twin\'');
const medicinesDbStart = c.indexOf('\n// ── Medicines DB');

if (medicinesDbStart > -1 && digitalTwinStart > medicinesDbStart) {
  // Remove everything from Medicines DB comment up to (but not including) digital-twin route
  const before = c.slice(0, medicinesDbStart);
  const after = c.slice(digitalTwinStart);
  c = before + after;
  console.log('Removed phantom DB routes block ✅');
} else {
  console.log('Block not found or already clean:', { medicinesDbStart, digitalTwinStart });
}

// Also check for duplicate analyzePrompt declarations
const count = (c.match(/const analyzePrompt\s*=/g) || []).length;
console.log('analyzePrompt declarations:', count);

writeFileSync(file, c, 'utf8');
console.log('server/src/index.ts cleaned');
