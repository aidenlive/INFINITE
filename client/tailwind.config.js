/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas: {
          bg: 'oklch(96% 0 0)',
          card: 'oklch(100% 0 0)',
          border: 'oklch(90% 0 0)',
          text: 'oklch(20% 0 0)',
          muted: 'oklch(60% 0 0)',
        },
        accent: {
          primary: 'oklch(60% 0.15 250)',
          hover: 'oklch(55% 0.15 250)',
          light: 'oklch(95% 0.05 250)',
        }
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '24px',
      },
      boxShadow: {
        'card': '0 1px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'card-drag': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      spacing: {
        'unit': '4px',
      },
      animation: {
        'spring-in': 'spring-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'spring-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
