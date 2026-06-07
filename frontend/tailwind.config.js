/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        /* ── Warm neutrals ── */
        warm: {
          50:  '#FAF7F2',
          100: '#F5EDD8',
          150: '#EDE0D0',
          200: '#DDD0BA',
          300: '#C8B89A',
          400: '#A8967A',
          500: '#8C7B65',
          600: '#6B4C3B',
          700: '#4A3020',
          800: '#2C1810',
          900: '#1A1410',
        },
        /* ── Dark mode surfaces ── */
        dark: {
          50:  '#3A3020',
          100: '#2E2418',
          200: '#242018',
          300: '#1E1A14',
          400: '#1A1410',
          500: '#141008',
        },
        /* ── Accent: Amber-Gold ── */
        amber: {
          50:  '#FEF8EC',
          100: '#FDF0D0',
          200: '#FAE0A0',
          300: '#F5C968',
          400: '#EDB040',
          500: '#C8853A',
          600: '#A86830',
          700: '#884E24',
          800: '#68381A',
          900: '#4A2410',
        },
        /* ── Accent: Terracotta ── */
        terra: {
          50:  '#FDF2EE',
          100: '#FAE2D8',
          200: '#F4C4AB',
          300: '#ECA07C',
          400: '#E07B54',
          500: '#D4694A',
          600: '#B85038',
          700: '#963A28',
          800: '#74261A',
          900: '#52160C',
        },
        /* ── Genre accent colors ── */
        sage:   { 400: '#7C9E7E', 100: '#E8F2E8' },
        slate2: { 400: '#7A8EA0', 100: '#E4EBF2' },
        mauve:  { 400: '#9B7EA0', 100: '#EEE8F2' },
        teal2:  { 400: '#5F9EA8', 100: '#E0EFF2' },
        sepia2: { 400: '#9E8A6A', 100: '#F0EBE0' },
        navy2:  { 400: '#6A7EA8', 100: '#E0E6F2' },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'warm-sm': '0 1px 8px 0 rgba(200,133,58,0.08), 0 1px 3px 0 rgba(44,24,16,0.06)',
        'warm':    '0 2px 20px 0 rgba(200,133,58,0.10), 0 1px 6px 0 rgba(44,24,16,0.08)',
        'warm-md': '0 4px 32px 0 rgba(200,133,58,0.14), 0 2px 10px 0 rgba(44,24,16,0.10)',
        'warm-lg': '0 8px 48px 0 rgba(200,133,58,0.18), 0 4px 16px 0 rgba(44,24,16,0.12)',
        'dark-sm': '0 1px 8px 0 rgba(0,0,0,0.25)',
        'dark':    '0 2px 20px 0 rgba(0,0,0,0.35)',
        'dark-md': '0 4px 32px 0 rgba(0,0,0,0.45)',
        'glow-amber': '0 0 24px 0 rgba(200,133,58,0.30)',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.45s ease-out',
        'bounce-heart': 'bounceHeart 0.35s ease',
        'scale-in':     'scaleIn 0.25s ease-out',
        'shimmer':      'shimmer 1.8s infinite linear',
        'float':        'float 3.5s ease-in-out infinite',
        'spin-slow':    'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        bounceHeart: { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4)' }, '100%': { transform: 'scale(1)' } },
        scaleIn:     { '0%': { transform: 'scale(0.94)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
      },
    },
  },
  plugins: [],
}
