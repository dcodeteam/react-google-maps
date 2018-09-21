"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/config/setupTests.js"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testMatch: ["**/__tests__/**/*.spec.ts?(x)"],
};
