'use client';
import { useSyncExternalStore, useCallback } from 'react';
import { scriptStore } from '@/lang/romanization/scriptStore.js';
import { romanizeCached } from '@/lang/romanization/engines/index.js';

export function useScript() {
  const state = useSyncExternalStore(
    scriptStore.subscribe,
    scriptStore.getState,
    scriptStore.getState,
  );

  const getRomanized = useCallback((text, script) => romanizeCached(text, script), []);

  return {
    ...state,
    getRomanized,
    setMode:         scriptStore.setMode,
    setTargetScript: scriptStore.setTargetScript,
    reset:           scriptStore.reset,
  };
}
