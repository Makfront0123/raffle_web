const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__test__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  verbose: true,
  roots: ['<rootDir>/src'],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
