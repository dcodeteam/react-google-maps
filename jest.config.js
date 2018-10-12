"use strict";

module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/config/jest/setupTests.js"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testMatch: ["**/*.spec.ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: { "^.+\\.(ts|tsx)$": "babel-jest" },
  collectCoverageFrom: [
    "src/**/*.ts?(x)",
    "!src/**/__docs__/**/*",
    "!src/**/__tests__/**/*",
  ],
  coverageThreshold: {
    global: { statements: 95, branches: 95, functions: 95, lines: 95 },
  },
};
