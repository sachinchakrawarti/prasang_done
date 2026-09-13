// src/utils/romanizationService.js
//
// Re-export shim.
//
// The real implementation lives in ./romanization/ — one file per script
// family (devanagari.js, urdu.js, ...) plus an index.js that registers
// them and exposes the public API.
//
// This file exists only so existing imports like
//     import { romanizeLine } from "@/utils/romanizationService"
// keep working without touching every component. New code can import
// directly from "@/utils/romanization" if preferred.

export {
  romanizeLine,
  romanizePoetry,
  isRomanizationAvailable,
  detectRomanizationScript,
  getSupportedLanguages,
} from "./romanization/index";