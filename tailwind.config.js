/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#fbf7f0',
          50: '#fffdfb',
          100: '#fbf7f0',
          200: '#f3e9d8',
          300: '#e9d8bd',
          400: '#dcc19a',
        },
        ink: {
          DEFAULT: '#2b2320',
          50: '#f7f5f3',
          100: '#e9e4df',
          200: '#cfc4ba',
          300: '#aa9a8c',
          400: '#80705f',
          500: '#5f5042',
          600: '#4a3d32',
          700: '#372c24',
          800: '#261d18',
          900: '#1a1310',
          950: '#100b09',
        },
        clay: {
          DEFAULT: '#c16a42',
          50: '#fef2ec',
          100: '#fbe1d2',
          200: '#f3bb9c',
          300: '#e89a6e',
          400: '#d87f4c',
          500: '#c16a42',
          600: '#a2522f',
          700: '#7e3f26',
          800: '#5e301f',
          900: '#43241a',
        },
        sage: {
          DEFAULT: '#7f9468',
          50: '#f3f6ef',
          100: '#e3ead9',
          200: '#c7d5b4',
          300: '#a8bd8d',
          400: '#8fa877',
          500: '#7f9468',
          600: '#657a4f',
          700: '#505f3f',
        },
        gold: {
          DEFAULT: '#c79a53',
          300: '#e8d2a0',
          400: '#d8b874',
          500: '#c79a53',
          600: '#a67c3b',
        },
      },
      fontFamily: {
        display: ['"Marcellus"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.4em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'clay-glow': 'radial-gradient(circle at 30% 20%, rgba(193,106,66,0.35), transparent 60%)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        clay: '0 0 0 1px rgba(193,106,66,0.35)',
        soft: '0 24px 60px -20px rgba(43,35,32,0.18)',
        lift: '0 30px 70px -25px rgba(43,35,32,0.35)',
        glow: '0 0 0 1px rgba(193,106,66,0.15), 0 20px 45px -15px rgba(193,106,66,0.35)',
        card: '0 2px 10px -2px rgba(43,35,32,0.06), 0 12px 30px -10px rgba(43,35,32,0.1)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.16,1,0.3,1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        marquee: 'marquee 32s linear infinite',
        'marquee-rev': 'marqueeRev 38s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'scale-in': 'scaleIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        kenburns: 'kenburns 14s ease-in-out infinite alternate',
        'spin-slow': 'spin 16s linear infinite',
        blob: 'blob 12s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(28px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRev: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.94)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.12) translate(-1%,-1%)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%', transform: 'rotate(0deg)' },
          '50%': { borderRadius: '55% 45% 38% 62% / 55% 65% 35% 45%', transform: 'rotate(8deg)' },
        },
      },
    },
  },
  plugins: [],
}
