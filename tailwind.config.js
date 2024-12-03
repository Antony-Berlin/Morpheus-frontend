/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#39ff14', 
          500: '#32cd32',
          600: '#28a428',
          800: '#1b6b1b',
        },
      },
      boxShadow: {
        'glass-light': '0 4px 30px rgba(39, 245, 130, 0.2)',
        'glass-dark': '0 4px 30px rgba(39, 245, 130, 0.4)',
      },  
    },
  },
  plugins: [],
}

