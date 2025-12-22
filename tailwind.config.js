/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7fce8',
          100: '#eef8d1',
          200: '#ddf0a3',
          300: '#c8e66f',
          400: '#b3d93d',
          500: '#bddb2d',
          600: '#9bb824',
          700: '#7a951d',
          800: '#5f7217',
          900: '#4d5d13',
        },
        secondary: {
          50: '#e6f7f5',
          100: '#b3e8e0',
          200: '#80d9cb',
          300: '#4dcab6',
          400: '#1abba1',
          500: '#17a68c',
          600: '#128570',
          700: '#0e6454',
          800: '#0a4338',
          900: '#06221c',
        },
      },
    },
  },
  plugins: [],
}

