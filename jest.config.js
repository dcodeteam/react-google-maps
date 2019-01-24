"use strict";

module.exports = {
  testEnvironment: "jsdom",
  preset: "@dc0de/jest-preset",
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
};
