"use strict";

module.exports = api => {
  const isTest = api.env("test");

  api.cache(() => JSON.stringify({ isTest }));

  const presets = ["@babel/react", "@babel/typescript"];

  if (isTest) {
    presets.push(["@babel/env", { targets: { node: true } }]);
  }

  return { presets };
};
