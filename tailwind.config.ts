import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warung Enin Brand Colors - Yellow & Gold Theme
        primary: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBC304", // Kuning utama
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        secondary: {
          50: "#F8F7F6",
          100: "#E8E6E3",
          200: "#D1CDC7",
          300: "#B9B0AE", // Abu-abu kecoklatan
          400: "#A3968F",
          500: "#8C7D70",
          600: "#7A6B5D",
          700: "#67594A",
          800: "#544737",
          900: "#413524",
        },
        accent: {
          50: "#FEF7E8",
          100: "#FDEFC1",
          200: "#FBE79A",
          300: "#F9DF73",
          400: "#F7D74C",
          500: "#B48310", // Emas tua
          600: "#9A6F0D",
          700: "#805B0A",
          800: "#664707",
          900: "#4C3304",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #FBC304 0%, #B48310 50%, #B9B0AE 100%)",
        "gradient-primary-hover":
          "linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D1CDC7 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        100: "25rem",
        112: "28rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        primary:
          "0 10px 25px -5px rgba(251, 191, 36, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
