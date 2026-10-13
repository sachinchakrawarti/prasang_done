import { translitStore } from './src/lang/transliteration/translitStore.js';
import { SUPPORTED_SCRIPTS } from './src/lang/romanization/engines/index.js';

const samples = [
  { text: 'नमस्ते दोस्तों', from: 'Devanagari' },
  { text: 'سلام دوستو',     from: 'Arabic' },
  { text: 'வணக்கம்',        from: 'Tamil' },
  { text: 'Привет',         from: 'Cyrillic' },
];

for (const { text, from } of samples) {
  console.log(`\n── ${from}: ${text}`);
  for (const to of SUPPORTED_SCRIPTS) {
    if (to === from) continue;
    try {
      const out = await translitStore.transliterate(text, from, to);
      console.log(`   → ${to.padEnd(12)} ${out}`);
    } catch (e) {
      console.log(`   → ${to.padEnd(12)} ⚠ ${e.message}`);
    }
  }
}