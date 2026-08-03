/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12212B",
          50: "#EFF3F4",
          100: "#D7E0E3",
          400: "#3E5865",
          700: "#1B323D",
          900: "#0C171D",
        },
        brass: {
          DEFAULT: "#B8863B",
          50: "#FBF3E7",
          400: "#C99B52",
          600: "#9C6D2A",
        },
        stone: {
          bg: "#F1F0EC",
          card: "#FFFFFF",
          line: "#E1DED4",
        },
        sage: {
          DEFAULT: "#5C7A6B",
          50: "#EAF0EC",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
