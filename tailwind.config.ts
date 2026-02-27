import type { Config } from "tailwindcss";

const config: Config = {
  // darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      colors: {
        // Base
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Primary
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },

        // Secondary
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
        },

        // Accent
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },

        // Destructive
        destructive: {
          DEFAULT: "var(--destructive)",
          hover: "var(--destructive-hover)",
          foreground: "var(--destructive-foreground)",
        },

        // Muted
        muted: {
          DEFAULT: "var(--muted)",
          hover: "var(--muted-hover)",
          foreground: "var(--muted-foreground)",
        },

        // Card / Popover
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },

        // Sidebar
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },

        // Border / Ring / Input
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Charts
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
