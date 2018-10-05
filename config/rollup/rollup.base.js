"use strict";

const cleaner = require("rollup-plugin-cleaner");
const prettier = require("rollup-plugin-prettier");
const typescript = require("rollup-plugin-typescript2");
const pkg = require("../../package");

module.exports = function createRollupConfig({ target }) {
  const externals = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
  ];

  return {
    input: "./src/index.ts",

    output: {
      file: `./react-google-maps.${target}.js`,
      format: target.startsWith("es") ? "es" : target,
    },

    external(id) {
      return externals.includes(id);
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
