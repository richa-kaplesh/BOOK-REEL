/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF0DC',
        },
        peach: {
          100: '#FFE8D6',
          200: '#FFD4B5',
          300: '#FFBFA0',
          400: '#FFA07A',
        },
        lavender: {
          100: '#F0E8FF',
          200: '#E0CCFF',
          300: '#C9AAFF',
          400: '#A87EF5',
        },
        mint: {
          100: '#D6F5E8',
          200: '#AEEBD4',
          300: '#7DDCBA',
          400: '#4CC9A0',
        },
        blush: {
          100: '#FFE4EC',
          200: '#FFCADB',
          300: '#FFAAC5',
        },
        warm: {
          900: '#2D1B0E',
          800: '#3D2B1F',
          700: '#5C3D2E',
          600: '#7A5548',
          500: '#9C7B6E',
          400: '#C4A99E',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        cozy: '0 2px 20px 0 rgba(61,43,31,0.08)',
        'cozy-md': '0 4px 30px 0 rgba(61,43,31,0.12)',
        'cozy-lg': '0 8px 40px 0 rgba(61,43,31,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-heart': 'bounceHeart 0.35s ease',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceHeart: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
