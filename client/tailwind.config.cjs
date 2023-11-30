/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        error: 'var(--error-color)',
        bg: 'var(--bg-color)',
        bg2: 'var(--bg-color-2)',
        bg3: 'var(--bg-color-3)',
        bg4: 'var(--bg-color-4)',
        text: 'var(--text-color)',
        text2: 'var(--text-color-2)',
        text3: 'var(--text-color-3)',
        text4: 'var(--text-color-4)',
        link: 'var(--link-color)',
        linkHover: 'var(--text-color-hover)',
        btnBg: 'var(--btn-bg-color)',
        btnBorderHover: 'var(--btn-border-color-hover)',
        btnOutlineFocus: 'var(--btn-outline-color-focus)'
      },
      boxShadow: { '2xl': '0 0px 20px 30px rgb(0 0 0 / .4)' },
    },
    screens: {
      'sm>': { max: '640px' },
      'md>': { max: '768px' },
      'lg>': { max: '1024px' },
      'xl>': { max: '1280px' },

      'sm<': { min: '641px' },
      'md<': { min: '768px' },
      'lg<': { min: '1024px' },
      'xl<': { min: '1280px' },
    },
  },
  plugins: [],
};
