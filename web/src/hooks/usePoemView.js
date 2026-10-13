'use client';
import { useEffect, useState } from 'react';
import { useScript } from './useScript.js';
import { useTransliteration } from './useTransliteration.js';
import { romanizeCached } from '@/lang/romanization/engines/index.js';

export function usePoemView(poem) {
  const { mode, targetScript } = useScript();
  const { transliterate } = useTransliteration();
  const [text, setText] = useState(poem?.content ?? '');

  useEffect(() => {
    if (!poem) return;
    let cancelled = false;

    async function compute() {
      try {
        if (mode === 'original') {
          if (!cancelled) setText(poem.content);
          return;
        }
        if (mode === 'roman') {
          const out = romanizeCached(poem.content, poem.script);
          if (!cancelled) setText(out);
          return;
        }
        if (mode === 'transliterate') {
          const out = await transliterate(poem.content, poem.script, targetScript || poem.script);
          if (!cancelled) setText(out);
        }
      } catch {
        if (!cancelled) setText(poem.content);
      }
    }

    compute();
    return () => { cancelled = true; };
  }, [mode, targetScript, poem?.content, poem?.script, transliterate, poem]);

  return { text, mode };
}
