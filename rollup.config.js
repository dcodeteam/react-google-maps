"use strict";

const babelPlugin = require("rollup-plugin-babel");
const nodeResolvePlugin = require("rollup-plugin-node-resolve");
const { sizeSnapshot } = require("rollup-plugin-size-snapshot");

const pkg = require("./package");

const externals = Object.keys(pkg.peerDependencies);

module.exports = [
  createConfig("cjs", pkg.main),
  createConfig("es", pkg.module),
  createConfig("es2015", pkg.es2015),
];

function createConfig(target, file) {
  const isES = target.startsWith("es");
  const isES2015 = target === "es2015";
  const isCI = process.env.CI === "true";

  return {
    input: "./src/index.ts",

    output: { file, format: isES ? "es" : target },

    external: id => externals.includes(id),

    plugins: [
      nodeResolvePlugin({ extensions: [".ts", ".tsx"] }),

      babelPlugin({
        extensions: [".ts", ".tsx"],
        presets: [
          [
            "@babel/preset-env",
            {
              loose: true,
              modules: false,
              forceAllTransforms: !isES2015,
              targets: { esmodules: isES2015 },
            },
          ],
        ],
      }),

      sizeSnapshot({ matchSnapshot: isCI }),
    ],
  };
}
