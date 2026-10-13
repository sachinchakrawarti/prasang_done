'use client';
import { useState, useMemo } from 'react';
import { romanizeCached } from '@/lang/romanization';
import PoemsCard from './poemscard';

export default function PoemCardWithRoman({ poem, lang, ...cardProps }) {
  const [roman, setRoman] = useState(false);

  const displayPoem = useMemo(() => {
    if (!roman || !poem.content || !poem.script) return poem;
    const romanized = romanizeCached(poem.content, poem.script);
    return {
      ...poem,
      excerpt: romanized.substring(0, 150) + '…',
      _romanized: true,
    };
  }, [roman, poem]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setRoman((v) => !v)}
        className="absolute top-3 right-3 z-10 text-[11px] px-2 py-1 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur border border-gray-200 dark:border-gray-700 hover:opacity-80 transition"
      >
        {roman ? 'मूल' : 'Roman'}
      </button>
      <PoemsCard poem={displayPoem} lang={lang} {...cardProps} />
    </div>
  );
}