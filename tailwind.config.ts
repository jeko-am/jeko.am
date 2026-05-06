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
        // Brand colors driven by runtime CSS variables (see globals.css :root)
        // so /admin/store-editor/theme can change them live without rebuild.
        // The "<alpha-value>" placeholder preserves existing `bg-deep-green/80`
        // and similar alpha utilities.
        'deep-green':   'rgb(var(--deep-green-rgb) / <alpha-value>)',
        'off-white':    'rgb(var(--off-white-rgb) / <alpha-value>)',
        'gold':         'rgb(var(--gold-rgb) / <alpha-value>)',
        'orange-brand': 'rgb(var(--orange-brand-rgb) / <alpha-value>)',
        'purple-brand': 'rgb(var(--purple-brand-rgb) / <alpha-value>)',
        'beige-light':  'rgb(var(--beige-light-rgb) / <alpha-value>)',
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
