const path = require('path');

// Require the package's built CommonJS file directly from node_modules
const pkgPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'use-latest-callback',
  'lib',
  'src',
  'index.js'
);

const mod = require(pkgPath);

// Support both CommonJS (module.exports = fn) and possible __esModule/default
const fn = mod && mod.__esModule && mod.default ? mod.default : mod;

module.exports = fn;
