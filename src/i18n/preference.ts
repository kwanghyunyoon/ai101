/*
 * The stored language preference: one `localStorage` key, read on `/` to skip
 * `Accept-Language` negotiation and written by the language switcher. Every
 * access is guarded — private-mode and disabled storage must not break routing
 * (ADR 0001: Progress lives only in the browser and losing it is harmless).
 */

export const STORED_LANGUAGE_KEY = "ai101:lang";

export function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(STORED_LANGUAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredLanguage(code: string): void {
  try {
    window.localStorage.setItem(STORED_LANGUAGE_KEY, code);
  } catch {
    /* storage unavailable — the next visit just re-negotiates */
  }
}
