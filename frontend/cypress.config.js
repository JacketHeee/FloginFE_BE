import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // baseUrl: "https://flogin-fe-be.vercel.app/",
    baseUrl: "http://localhost:5173",

    specPattern: "cypress/e2e/**/*.{cy,spec,e2e}.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
  },
});
