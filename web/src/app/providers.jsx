// src/app/providers.jsx
"use client";

import { ThemeProvider } from "@/themes/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
