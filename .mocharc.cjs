'use strict';

module.exports = {
  loader: "ts-node/esm",
  extension: ["ts"],
  spec: ["test/**/*.test.ts"],
  'node-option': ['import=./register.js']
};
