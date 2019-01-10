"use strict";

module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/__testutils__/setupTests.ts"],
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
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
};
