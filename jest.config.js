"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/config/setupTests.js"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testMatch: ["**/__tests__/**/*.spec.ts?(x)"],
  collectCoverageFrom: ["src/**/*.ts?(x)", "!src/**/__tests__/**/*"],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
};
