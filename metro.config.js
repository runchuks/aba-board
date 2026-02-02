const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure Metro resolves .mjs files (some deps publish ESM entry points)
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes('mjs')) {
  config.resolver.sourceExts.push('mjs');
}

// Provide a shim for `use-latest-callback` to ensure correct CJS/ESM interop
config.resolver.extraNodeModules = config.resolver.extraNodeModules || {};
config.resolver.extraNodeModules['use-latest-callback'] = path.resolve(
  __dirname,
  'shims',
  'use-latest-callback.js'
);

module.exports = config;
