"use strict";

module.exports = {
  testEnvironment: "jsdom",
  setupTestFrameworkScriptFile: "<rootDir>/src/__testutils__/setupTests.ts",
  testMatch: ["**/*.spec.ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: { "^.+\\.(ts|tsx)$": "babel-jest" },
  coveragePathIgnorePatterns: ["/__docs__/", "/__tests__/", "/__testutils__/"],
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
};
