import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neumorphic-bg': 'var(--neumorphic-bg)',
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
        'success': 'var(--success-color)',
        'warning': 'var(--warning-color)',
        'text': 'var(--text-color)',
        'text-secondary': 'var(--text-secondary)',
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px var(--neumorphic-shadow-dark), -8px -8px 16px var(--neumorphic-shadow-light)',
        'neumorphic-inset': 'inset 6px 6px 12px var(--neumorphic-shadow-dark), inset -6px -6px 12px var(--neumorphic-shadow-light)',
        'neumorphic-hover': '10px 10px 20px var(--neumorphic-shadow-dark), -10px -10px 20px var(--neumorphic-shadow-light)',
      },
      borderRadius: {
        'neumorphic': 'var(--border-radius)',
      },
    },
  },
  plugins: [],
}
export default config


