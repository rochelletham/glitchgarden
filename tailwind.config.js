/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'lightgreen': '#86efac',
        'white': '#ffffff',
        'purple': '#3f3cbb',
        'midnight': '#121063',
        'metal': '#565584',
        'tahiti': '#3ab7bf',
        'silver': '#ecebff',
        'bubble-gum': '#ff77e9',
        'bermuda': '#78dcca',

        'background-color':'#1b1d1f',        /* near-black dark gray */
        'surface-color': '#25282a',           /* card/panel surface */
        'border-color': '#2f3234',            /* subtle borders */

        // text colors
        't-color': 'rgba(236, 246, 242, 1)',
        'sec-t-color': 'rgb(228, 239, 235)',
        'muted-text-color': '#999999',

        /* Kiwi Green Accent */
        'dark-green': 'rgba(138, 200, 134, 1)',
        'light-green': 'rgba(148, 212, 122, 1)',
        'lighter-green':'rgb(159, 228, 131)',
        'orange':'rgba(246, 177, 81, 1)',
        'light-blue':'rgba(123, 161, 233, 1)',
        'purple':'rgba(123, 161, 233, 1)',

        /* background colors */
        'primary-bk': 'rgb(37, 37, 37)',
        'secondary-bk': 'rgb(52, 52, 52)',
        'tertiary-bk': 'rgba(87, 94, 103, 1)',
        // 'tertiary-bk': 'rgb(56, 59, 65)',
        'primary-color': '#85cb33',
        'primary-color-hover': '#6dae29',
        'primary-color-muted': 'rgba(133, 203, 51, 0.2)',

        /* Inputs & UI */
        'input-bg-color': '#2c2f31',
        'input-border-color': '#3c3f41',
        'button-text-color': '#0a0a0a'
      },
    },
  plugins: [],
  }
}
