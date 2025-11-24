import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // si testea hooks o componentes React
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // para alias @/
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // opcional
};

export default config;
