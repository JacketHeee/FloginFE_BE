export default {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],

  moduleFileExtensions: ["js", "jsx"],

  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/tests/mock/fileMock.js",
  },

  collectCoverage: true,

  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/**/*.test.{js,jsx}",
    "!src/tests/**",
    "!cypress/**"
  ],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/public/",
    "/dist/",
    "/cypress/"
  ],

  // CHỐT QUAN TRỌNG: chỉ chạy test trong src/
  testMatch: [
    "<rootDir>/src/**/*.test.jsx",
    "<rootDir>/src/**/*.test.js",
    "<rootDir>/src/**/__tests__/**/*.[jt]sx?"
  ],

  // CHẶN 100% Jest khỏi quét Cypress
  testPathIgnorePatterns: [
    "/node_modules/",
    "/cypress/",
    "/public/",
    "/dist/"
  ],
};
