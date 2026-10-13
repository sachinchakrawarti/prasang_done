'use client';
import { useSyncExternalStore } from 'react';
import { translitStore } from '@/lang/transliteration/translitStore.js';

export function useTransliteration() {
  const state = useSyncExternalStore(
    translitStore.subscribe,
    translitStore.getState,
    translitStore.getState,
  );

  return {
    ...state,
    transliterate: translitStore.transliterate,
    clearCache:    translitStore.clearCache,
  };
}
