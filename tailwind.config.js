/** @type {import('tailwindcss').Config} */
import flowbiteReact from 'flowbite-react/plugin/tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '.flowbite-react/class-list.json',
    ".flowbite-react\\class-list.json"
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbiteReact],
}
