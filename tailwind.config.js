/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
          950: '#3b0764',
        },
        primary: {
          DEFAULT: '#5B21B6',
          foreground: '#ffffff',
        }
      },
      borderRadius: {
        'xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px 0 rgba(91,33,182,0.08)',
        'card-hover': '0 8px 32px 0 rgba(91,33,182,0.16)',
      }
    },
  },
  plugins: [],
}
