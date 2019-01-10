"use strict";

const babel = require("rollup-plugin-babel");
const prettier = require("rollup-plugin-prettier");
const nodeResolve = require("rollup-plugin-node-resolve");

const pkg = require("./package");

module.exports = [
  createConfig("es"),
  createConfig("cjs"),
  createConfig("es2015"),
];

function createConfig(target) {
  const externals = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ];

  return {
    input: "./src/index.ts",

    output: {
      file: `./react-google-maps.${target}.js`,
      format: target.startsWith("es") ? "es" : target,
    },

    external(id) {
      return externals.includes(id) || id.startsWith("@babel/runtime");
    },

    plugins: [
      nodeResolve({ extensions: [".ts", ".tsx"] }),

      babel({
        babelrc: false,
        runtimeHelpers: true,
        extensions: [".ts", ".tsx"],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              forceAllTransforms: target !== "es2015",
              targets: { esmodules: target === "es2015" },
            },
          ],
          "@babel/react",
          "@babel/preset-typescript",
        ],
        plugins: [
          "@babel/plugin-transform-runtime",
          "@babel/plugin-proposal-class-properties",
        ],
      }),

      prettier({ parser: "babylon" }),
    ],
  };
}
