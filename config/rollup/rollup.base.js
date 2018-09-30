"use strict";

const cleaner = require("rollup-plugin-cleaner");
const prettier = require("rollup-plugin-prettier");
const typescript = require("rollup-plugin-typescript2");

module.exports = function createRollupConfig({ target }) {
  return {
    input: "./src/index.ts",
    output: {
      format: target.startsWith("es") ? "es" : target,
      file: `./${target}/index.js`,
    },
    external(id) {
      switch (id) {
        case "tslib":
        case "react":
        case "react-dom":
          return true;
        default:
          return false;
      }
    },
    plugins: [
      cleaner({
        targets: [`./${target}/`, target === "cjs" && "./typings/"].filter(
          Boolean,
        ),
      }),

      typescript({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfig: `./tsconfig.${target}.json`,
      }),

      prettier({ parser: "babylon" }),
    ],
  };
};
