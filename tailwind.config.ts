import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#274C46',
        'off-white': '#EAE5DC',
        'gold': '#F2A900',
        'orange-brand': '#E65A1E',
        'purple-brand': '#5F295E',
        'beige-light': '#f5f1eb',
      },
      fontFamily: {
        // Site-wide default rounded font (VAG Rounded Next Heavy stand-in)
        sans: ['Fredoka', 'Rubik', 'Helvetica', 'Arial', 'sans-serif'],
        rubik: ['Fredoka', 'Rubik', 'Helvetica', 'Arial', 'sans-serif'],
        fredoka: ['Fredoka', 'Rubik', 'Helvetica', 'Arial', 'sans-serif'],
        sofia: ['Fredoka', 'Sofia Pro', 'Rubik', 'Arial', 'sans-serif'],
        // Frankfurter retained for the JEKO logo / specific accents only
        frankfurter: ['Frankfurter', 'Rubik', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};
export default config;
