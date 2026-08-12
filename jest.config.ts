import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}'
  ],

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  preset: 'ts-jest',

  rootDir: '.',

  roots: ['<rootDir>/src', '<rootDir>/tests'],

  testEnvironment: 'node',

  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '!**/*.spec.[jt]s',
    '!**/e2e/**/*.[jt]s'
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e',
    '\\.playwright\\.ts$',
    '/dist/',
    '/build/'
  ],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json'
      }
    ]
  },

  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\\\]+$'],
  verbose: true,
  watchman: true
};

export default config;
