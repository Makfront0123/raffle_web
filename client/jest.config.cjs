const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|@radix-ui|nanoid))",
  ],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],


  // Required for TS in Jest
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.jest.json",
    },
  },
};

module.exports = createJestConfig(customJestConfig);
