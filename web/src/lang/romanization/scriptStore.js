import { romanizeCached } from './engines/index.js';

let state = { mode: 'original', targetScript: null };
const listeners = new Set();
const emit = () => { for (const l of listeners) l(); };

export const scriptStore = {
  getState: () => state,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },

  setMode(mode) { if (state.mode === mode) return; state = { ...state, mode }; emit(); },
  setTargetScript(targetScript) {
    if (state.targetScript === targetScript) return;
    state = { ...state, targetScript }; emit();
  },
  reset() { state = { mode: 'original', targetScript: null }; emit(); },
  getRomanized: (text, script) => (text ? romanizeCached(text, script) : ''),
};
