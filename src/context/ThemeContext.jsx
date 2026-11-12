// ===========================================================================
// A.2 — THEME
//
// Light / Dark / System, with System as the default. An explicit choice
// persists; System keeps following the operating system for as long as it is
// selected. The resolved theme is written to <html data-theme> before first
// paint by the inline script in index.html, so there is no flash and no
// layout instability — only the ground and the ink cross-fade.
// ===========================================================================
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);
const KEY = 'a2-theme';
const MODES = ['light', 'dark', 'system'];

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const readStored = () => {
  try {
    const v = localStorage.getItem(KEY);
    return MODES.includes(v) ? v : 'system';
  } catch {
    return 'system';
  }
};

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(readStored);
  const [resolved, setResolved] = useState(() =>
    readStored() === 'system' ? systemTheme() : readStored(),
  );

  // Follow the OS only while System is selected.
  useEffect(() => {
    if (mode !== 'system') {
      setResolved(mode);
      return;
    }
    const q = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setResolved(q.matches ? 'dark' : 'light');
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#303337' : '#f1ede6');
  }, [resolved]);

  const setMode = useCallback((next) => {
    if (!MODES.includes(next)) return;
    setModeState(next);
    try {
      // System is the default, so selecting it clears the preference rather
      // than storing a third value that could drift from the OS.
      if (next === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch { /* private mode — the session still works, it just won't persist */ }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode, modes: MODES }}>
      {children}
    </ThemeContext.Provider>
  );
}
