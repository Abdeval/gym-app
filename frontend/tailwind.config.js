/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ef4444', // Tailwind's red-500
        },
        secondary: {
          DEFAULT: '#9ca3af', // Tailwind's gray-400
        },
        background: {
          light: '#ffffff',    // pure white
          dark: '#0d1117',     // GitHub black
        },
        foreground: {
          light: '#f3f4f6',    // Tailwind's gray-100 (almost white)
          dark: '#24292e',     // GitHub foreground text
        },
      },
      fontFamily: {
        italic: ["Poppins-Italic", "sans-serif"],
        regular: ["Poppins-Regular", "sans-serif"],
        medium: ["Poppins-Medium", "sans-serif"],
        semibold: ["Poppins-SemiBold", "sans-serif"],
        bold: ["Poppins-Bold", "sans-serif"],
        // black: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: 'class', // enables `dark` variants using `dark` class
};
