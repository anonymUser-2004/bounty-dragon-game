/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      opacity:{
        lightop:0.9
      },
      colors: {
        darkPurple: '#330f74',
      },
    },
  },
  plugins: [],
}

