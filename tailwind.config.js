/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'bottom': '0 2px 4px 0 rgba(0, 0, 0, 0.1)', // 커스텀 그림자 스타일
      }
    },
  },
  plugins: [],
}