'use client';

import { useThemeContext } from './ThemeProvider';

export function Header() {
  const { theme, toggleTheme, mounted } = useThemeContext();

  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
          File Converter
        </h1>
        <button
          onClick={toggleTheme}
          className="btn px-4 py-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}


