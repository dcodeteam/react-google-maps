"use strict";

module.exports = api => {
  const isTest = api.env("test");

  api.cache(() => JSON.stringify({ isTest }));

  return {
    presets: !isTest
      ? []
      : [
          "@babel/react",
          "@babel/typescript",
          ["@babel/env", { targets: { node: true } }],
        ],
  };
};
