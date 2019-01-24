"use strict";

const babelPlugin = require("rollup-plugin-babel");
const nodeResolvePlugin = require("rollup-plugin-node-resolve");
const { sizeSnapshot } = require("rollup-plugin-size-snapshot");

const pkg = require("./package");

module.exports = [
  createConfig("es"),
  createConfig("cjs"),
  createConfig("es2015"),
];

function createConfig(target) {
  const externals = Object.keys(pkg.peerDependencies);

  return {
    input: "./src/index.ts",

    output: {
      file: `./react-google-maps.${target}.js`,
      format: target.startsWith("es") ? "es" : target,
    },

    external: id => externals.includes(id),

    plugins: [
      nodeResolvePlugin({ extensions: [".ts", ".tsx"] }),

      babelPlugin({
        babelrc: false,
        runtimeHelpers: false,
        extensions: [".ts", ".tsx"],
        presets: [
          [
            "@babel/preset-env",
            {
              loose: true,
              modules: false,
              forceAllTransforms: target !== "es2015",
              targets: { esmodules: target === "es2015" },
            },
          ],
          "@babel/react",
          "@babel/preset-typescript",
        ],
      }),

      sizeSnapshot({ matchSnapshot: process.env.CI === "true" }),
    ],
  };
}
