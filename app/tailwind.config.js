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
      pattern: /(bg|text|border)-(red|green|blue|violet|amber|emerald)-(100|200|300|500|700|600)/, // You can display all the colors that you need
      variants: ['hover', 'focus'],      // Optional
    },
    {
      pattern: /grid-(cols|rows)-([0-9]+)/, // You can display all the colors that you need
      variants: ['hover', 'focus'],      // Optional
    }
  ]
}