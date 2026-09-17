export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C4CF1',
          hover: '#5a4add',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brand-sm': '0 4px 14px rgba(108,76,241,0.39)',
        'brand-lg': '0 16px 32px rgba(124,58,237,0.35)',
        'card': '0 8px 30px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
