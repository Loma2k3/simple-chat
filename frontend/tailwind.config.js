/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}","./public/*"],
  theme: {
    extend: {
      backgroundImage: {
        'night-moon':"url('./img/bg-night.jpg')"
      },
      colors: {
        '3AA6B9': '#3AA6B9'
      }
    },
    fontFamily: {
      'shadow':['Shadows Into Light']
    }
  },
  plugins: [],
}

