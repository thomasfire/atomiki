module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(red|green|blue|violet|amber)-(200|500|700)/, // You can display all the colors that you need
      variants: ['hover', 'focus'],      // Optional
    },
    {
      pattern: /grid-(cols|rows)-([0-9]+)/, // You can display all the colors that you need
      variants: ['hover', 'focus'],      // Optional
    }
  ]
}